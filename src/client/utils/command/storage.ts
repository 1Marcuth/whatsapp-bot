import { bot } from "../../settings"

import ICommand from "../../interfaces/command"

class CommandsStorage {
    public commands: ICommand[] = []

    public get(name: string) {
        return this.commands.find(command => command.name === name)
    }

    public add(command: ICommand) {
        if (this.get(command.name)) {
            throw new Error(`The command '${command.name}' has been duplicated!`)
        }

        if (!command.name || command.name.includes(" ") || command.name.includes(bot.commands.optionsSeparator) || command.name.includes(bot.prefix)) {
            throw new Error(`The command '${command.name}' has been duplicated!`)
        }

        if (!command.description || command.description.startsWith(" ") || command.description.endsWith(" ")) {
            throw new Error(`The command '${command.name}' does not have a valid description! Description: '${command.description}'.`)
        }

        if (!command.run) {
            throw new Error(`The command '${command.name}' does not have a valid runner! Runner: '${command.run}'.`)
        }

        this.commands.push(command)
    }
}

export default CommandsStorage