import getMessageContext from "../utils/message/context"
import { bot } from "../settings"

import CommandsStorage from "../utils/command/storage"
import CommandWrapper from "../utils/command/wrapper"
import { isCommand } from "../utils/command/tools"

import IMessageData from "../interfaces/message/data"
import IEvent from "../interfaces/event/index"
import { isJidGroup } from "@adiwajshing/baileys"
import { errorMessage } from "../utils/message/message-template"

export const event: IEvent = {
    name: "messages.upsert",
    type: "on",
    run: async (socket: any, message: IMessageData, commandsStorage: CommandsStorage) => {
        const [ webMessage ] = message.messages

        const messageContent = webMessage.message?.conversation
        const { command, ...context } = await getMessageContext(socket, webMessage)
        const fullContext = { command, ...context }

        if (messageContent?.includes("@everyone") && isJidGroup(context.remoteJid as string)) {
            return await socket.sendMessage(context.remoteJid, {
                text: `*Você foi marcado por _@${webMessage.pushName}_*`,
                mentions: context.group.membersList?.map(member => member.id),
            })
        }

        if (!messageContent) return
        if (!isCommand(messageContent)) return

        const commands = commandsStorage.commands
        const commandObject = commandsStorage.get(command)

        if (!commandObject) {
            return await errorMessage(fullContext, "Comando inexistente", `O comando ${bot.prefix}${command} não existe!`)
        }
        
        const commandWrapper = new CommandWrapper(commandObject)

        try {
            console.log(`Rodando o comando: ${command}`)
            await commandWrapper.run({ commands, ...fullContext })
        } catch (error) {
            console.log(error)
            return await errorMessage(fullContext, `Falha na execução do comando`, `Ocorreu um erro ao tentar executar o comando ${bot.prefix}${command}: ${(error as any).message}`)
        }
    }
}