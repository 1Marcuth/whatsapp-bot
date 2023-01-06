import { bot } from "../../settings"

import ICommand from "../../interfaces/command"

class CommandsStorage {
    public commands: ICommand[] = []

    public getCommand(name: string) {
        return this.commands.find(command => command.name === name)
    }

    public command(command: ICommand) {
        if (this.getCommand(command.name)) {
            throw new Error(`The command '${command.name}' has been duplicated!`)
        }

        if (!command.name || command.name.includes(" ") || command.name.includes(bot.commands.optionsSeparator) || command.name.includes(bot.prefix)) {
            throw new Error(`The command '${command.name}' has been duplicated!`)
        }

        if (!command.description || command.description.startsWith(" ") || command.description.endsWith(" ")) {
            throw new Error(`Command '${command.name}' does not have a valid description! Description: '${command.description}'`)
        }

        if (!command.run) {
            throw new Error(`Command '${command.name}' does not have a valid runner! Runner: '${command.run}'`)
        }

        this.commands.push(command)
    }
}

export default CommandsStorage