import { isJidGroup, isJidUser } from "@adiwajshing/baileys"

import ICommand from "../../interfaces/command"
import { reactionEmojis } from "../../settings"
import { errorMessage, warningMessage } from "../../utils/message/message-template"
import { isAdmin } from "../../utils/validator"

export const command: ICommand = {
    name: "add-member",
    description: "Adiciona uma reação",
    options: [
        {
            name: "phone-number",
            type: "string",
            description: "Número de telefone ou menção.",
            required: true
        }
    ],
    run: async (context, options) => {
        await context.setReaction(reactionEmojis.waiting)

        if (!isJidGroup(context.remoteJid as string)) {
            await context.setReaction(reactionEmojis.error)
            return await warningMessage(
                context,
                "Chat inválido para a ação",
                "O chat atual não é um grupo!"
            )
        }

        if (!isAdmin(context, context.userJid as string)) {
            await context.setReaction(reactionEmojis.error)
            return await warningMessage(
                context,
                "Usuário sem permissão",
                "Você não é um adiministrador do grupo!"
            )
        }

        if (!isAdmin(context, context.botJid)) {
            await context.setReaction(reactionEmojis.error)
            return await warningMessage(
                context,
                "Bot sem permissão",
                "O bot não é um adiministrador do grupo!"
            )
        }

        const phoneNumber = options?.getParsedValue("phone-number")
        let jidUser = `${phoneNumber}@s.whatsapp.net`

        if (!isJidUser(jidUser)) {
            if (!isJidUser(phoneNumber)) {
                await context.setReaction(reactionEmojis.error)
                return await errorMessage(
                    context,
                    "Jid de usuário inválido",
                    "A marcação ou o número de telefone são inválidos!"
                )
            }

            jidUser = phoneNumber
        }

        if (jidUser === context.botJid) {
            await context.setReaction(reactionEmojis.error)
            return await warningMessage(
                context,
                "Erro de recursão",
                "O bot não pode fazer essa ação com ele mesmo!"
            )
        }

        try {
            await context.group.members?.add([ jidUser ])
            await context.setReaction(reactionEmojis.success)
        } catch(error: any) {
            await errorMessage(
                context,
                "Erro ao tentar adicionar o membro",
                error.message
            )
        }
    }
}