import { isJidGroup } from "@adiwajshing/baileys"

import { errorMessage, warningMessage } from "../../utils/message/message-template"
import { reactionEmojis } from "../../settings"
import { isAdmin } from "../../utils/validator"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "set-description",
    description: "Coloca uma descrição no grupo",
    options: [
        {
            name: "new-description",
            type: "string",
            description: "A nova descrição do grupo a ser colocada.",
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

        const newDescription = options?.getParsedValue("new-description") as string

        try {
            await context.group.setDescription(newDescription)
            await context.setReaction(reactionEmojis.success)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return errorMessage(
                context,
                "Erro ao tentar colocar a descrição do grupo",
                error.message
            )
        }
    }
}