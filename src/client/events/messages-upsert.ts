import getMessageContext from "../utils/message/context"
import { botPrefix } from "../settings"

import CommandsStorage from "../utils/command/storage"
import CommandWrapper from "../utils/command/wrapper"
import { isCommand } from "../utils/command/tools"

import IMessageData from "../interfaces/message/data"
import IEvent from "../interfaces/event/index"

export const event: IEvent = {
    name: "messages.upsert",
    type: "on",
    run: async (socket: any, message: IMessageData, commandsStorage: CommandsStorage) => {
        const commands = commandsStorage.commands
        const [ webMessage ] = message.messages

        const { command, ...context } = getMessageContext(socket, webMessage)

        if (!isCommand(command)) return

        try {
            const commandName = command.slice(botPrefix.length).replace(botPrefix, "")
            const commandObject = commandsStorage.getCommand(commandName)

            if (commandObject) {
                const commandWrapper = new CommandWrapper(commandObject)
                return await commandWrapper.run({ commands, command, ...context })
            }

            await context.replyText(`The Command <code>${botPrefix}${commandName}</code> not exists`, "html")
        } catch (error) {
            console.error(error)
            await context.replyText(`${(error as any).message}`)
            //await context.replyText(`Ocorreu um erro ao tentar executar o comando ${command}`)
        }
    }
}