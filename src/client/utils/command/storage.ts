import ICommand from "../../interfaces/command"

class CommandsStorage {
    public commands: ICommand[] = []

    public getCommand(name: string) {
        return this.commands.find(command => command.name === name)
    }

    public command(command: ICommand) {
        this.commands.push(command)
    }
}

export default CommandsStorage