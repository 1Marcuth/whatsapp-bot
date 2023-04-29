import ICommand from "../../interfaces/command"


import { errorMessage } from "../../utils/message/message-template"
import { formatHtmlToMarkdown } from "../../utils/message/content"
import { reactionEmojis } from "../../settings"

const timeReminderLimitInMinutes = 60
const millisecondsPerMinute = 60000

export const command: ICommand = {
    name: "reminder",
    description: "Cria um lembrete e te envia uma mensagem depois do tempo se esgotar.",
    options: [
        {
            name: "message",
            type: "string",
            description: "Mensagem a ser enviada após o tempo ser esgotado.",
            required: true
        },
        {
            name: "minutes",
            type: "integer",
            description: "Tempo que após esgotado será enviada a mensagem.",
            required: true
        }
    ],
    run: async (context, options) => {
        const message = options?.getParsedValue("message") as string
        const minutes = options?.getParsedValue("minutes") as number
        const chatJid = ( context.remoteJid || context.userJid || context.replyJid ) as string

        if (minutes > timeReminderLimitInMinutes) {
            await context.setReaction(reactionEmojis.error)
            return errorMessage(
                context,
                "Tempo acima do limite",
                `Escolha um tempo entre 0 e ${timeReminderLimitInMinutes} minutos!`
            )
        }

        const nowDate = new Date()
        const reminderDate = new Date(
            nowDate.getTime() + (minutes * millisecondsPerMinute)
        )
        
        const reminderDateString = reminderDate.toLocaleDateString("br") + " às " + reminderDate.toLocaleTimeString("br")

        await context.replyText(`<b>Ok! Foi criado um lembrete para</b> <code>${reminderDateString}</code>, <b>com a mensagem:</b><br> <i>${message}</i>`, "html")

        setTimeout(
            async () => await context.replyText(`<b>LEMBRETE:</b> <code>${message}</code>`, "html"),
            minutes * millisecondsPerMinute
        )
    }
}