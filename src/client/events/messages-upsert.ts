import getMessageContext from "../utils/message/context"
import { bot } from "../settings"

import CommandsStorage from "../utils/command/storage"
import CommandWrapper from "../utils/command/wrapper"
import { isCommand } from "../utils/command/tools"

import IMessageData from "../interfaces/message/data"
import IEvent from "../interfaces/event/index"

export const event: IEvent = {
    name: "messages.upsert",
    type: "on",
    run: async (socket: any, message: IMessageData, commandsStorage: CommandsStorage) => {
        const [ webMessage ] = message.messages

        const messageContent = webMessage.message?.conversation

        if (!messageContent) return
        if (webMessage.key.fromMe) return
        if (!isCommand(messageContent)) return

        const commands = commandsStorage.commands

        const { command, ...context } = await getMessageContext(socket, webMessage)

        const commandObject = commandsStorage.get(command)

        if (commandObject) {
            const commandWrapper = new CommandWrapper(commandObject)
            return await commandWrapper.run({ commands, command, ...context })
        }

        try {
            await context.replyText(`The Command <code>${bot.prefix}${command}</code> not exists`, "html")
        } catch (error) {
            console.log(error)
            await context.replyText(`Ocorreu um erro ao tentar executar o comando <code>${command}</code>`, "html")
        }
    }
}