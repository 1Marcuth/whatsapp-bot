import path from "path"
import fs from "fs"

import CommandsStorage from "../utils/command/storage"

import ICommand from "../interfaces/command/index"

export default async (commandsStorage: CommandsStorage) => {
    const commandsDirPath = path.join(__dirname, "../commands")
    const fileExtension = path.extname(__filename)

    fs.readdirSync(commandsDirPath)
        .forEach(dir => {
            const subFolder = path.join(commandsDirPath, dir)
            fs.readdirSync(subFolder)
                .filter(file => file.endsWith(fileExtension))
                .forEach(async (file) => {
                    const commandFilePath = path.join(subFolder, file)
                    const command = await importCommand(commandFilePath)

                    if (!command.name) {
                        throw new Error(`> [client-commands-handler-error] Not valid commmand name on: ${commandFilePath}`)
                    }

                    if (!command.run) {
                        throw new Error(`> [client-commands-handler-error] Not valid command run on: ${commandFilePath}`)
                    }

                    loadCommand(command)

                    function loadCommand(command: ICommand) {
                        commandsStorage.command(command)

                        console.log(`> [client] Command ${command.name} loaded`)
                    }
                })
        })

    async function importCommand(commandFilePath: string) {
        const command: ICommand = (await import(commandFilePath)).command
        return command
    }
}