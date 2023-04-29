import { isJidGroup } from "@adiwajshing/baileys"

import { warningMessage } from "../../utils/message/message-template"

import ISpecialWord from "../../interfaces/special-word"
import { formatHtmlToMarkdown } from "../../utils/message/content"
import { isAdmin } from "../../utils/validator"

export const specialWord: ISpecialWord = {
    name: "@admins",
    run: async(context) => {
        if (!isJidGroup(context.remoteJid as string)) {
            return await warningMessage(
                context,
                "Marcação inválida",
                "Você não pode marcar os administradores fora de um grupo!"
            )
        }

        const adminIds = context.group.membersList?.filter(member => isAdmin(context, member.id)).map(member => member.id)

        await context.socket.sendMessage(
            context.remoteJid as string,
            {
                text: formatHtmlToMarkdown(`<b>Você administrador, foi marcado por <i>@${context.userJid?.split("@")[0]}</i></b>`),
                mentions: adminIds
            }
        )
    }
}