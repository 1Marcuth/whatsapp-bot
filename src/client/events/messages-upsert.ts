import getMessageContext from "../utils/message/context"
import { bot, reactionEmojis } from "../settings"

import { errorMessage } from "../utils/message/message-template"
import CommandsStorage from "../utils/command/storage"
import CommandWrapper from "../utils/command/wrapper"
import { isCommand } from "../utils/command/tools"

import IMessageData from "../interfaces/message/data"
import IEvent from "../interfaces/event/index"
import SpecialWordsStorage from "../utils/special-word/storage"
import { contentSpecialWord } from "../utils/special-word/tools"

interface IMessageUpsertKwargs {
    commandsStorage: CommandsStorage
    specialWordsStorage: SpecialWordsStorage
}

export const event: IEvent = {
    name: "messages.upsert",
    type: "on",
    run: async (
        socket,
        message: IMessageData,
        {
            commandsStorage,
            specialWordsStorage
        } : IMessageUpsertKwargs
    ) => {
        const [ webMessage ] = message.messages

        const { command, ...context } = await getMessageContext(socket, webMessage)
        const messageContent = context.messageText as string
        const fullContext = { command, ...context }
        const specialWords = specialWordsStorage.specialWords.map(specialWord => specialWord.name)

        const messsageContentSpecialWord = contentSpecialWord(messageContent, specialWords)

        if (messsageContentSpecialWord[0]) {
            const specialWord = specialWordsStorage.get((
                messsageContentSpecialWord as [boolean, string]
            )[1])

            return await specialWord?.run(fullContext)
        }

        if (!messageContent) return // If the message contains empty text
        if (!isCommand(messageContent)) return // If the message does not start with the prefix. Or also if it has nothing after the prefix
        if (context.botJid === context.userJid) return // If it was the bot itself that sent the message

        const commands = commandsStorage.commands
        const commandObject = commandsStorage.get(command)

        if (!commandObject) {
            return await errorMessage(
                fullContext,
                "Comando inexistente",
                `O comando ${bot.prefix}${command} não existe!`
            )
        }
        
        const commandWrapper = new CommandWrapper(commandObject)

        try {
            console.log(`> [client] Running command '${bot.prefix}${command}'`)
            await commandWrapper.run({ commands, ...fullContext })
        } catch (error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                fullContext,
                "Falha na execução do comando",
                `Ocorreu um erro ao tentar executar o comando ${bot.prefix}${command}: ${error.message}`
            )
        }
    }
}