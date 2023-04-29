import { isJidGroup } from "@adiwajshing/baileys"

import { warningMessage } from "../../utils/message/message-template"

import ISpecialWord from "../../interfaces/special-word"

export const specialWord: ISpecialWord = {
    name: "@everyone",
    run: async(context) => {
        if (!isJidGroup(context.remoteJid as string)) {
            return await warningMessage(
                context,
                "Marcação inválida",
                "Você não pode marcar todos fora de um grupo!"
            )
        }

        await context.replyTextMarkingEveryone(`<b>Você foi marcado por <i>@${context.userJid?.split("@")[0]}</i></b>`, "html")
    }
}