import { errorMessage } from "../../utils/message/message-template"
import { evaluateMathOperation } from "../../../utils/math"

import ICommand from "../../interfaces/command"
import { isBotOwer } from "../../utils/validator"
import { reactionEmojis } from "../../settings"
import { sleep } from "../../../utils/time"

export const command: ICommand = {
    name: "kill",
    description: "Mata o socket e desliga o bot.",
    run: async (context) => {
        await context.setReaction(reactionEmojis.waiting)

        if (!isBotOwer(context.userJid as string)) {
            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Usuário sem permissão",
                "Você não é um dono do bot!"
            )
        }

        await context.setReaction(reactionEmojis.success)
        await context.replyText("<b>Matando socket e desligando o bot...</b>", "html")

        try {
            await sleep(500)
            context.socket.end(undefined)
        } catch(error: any) {
            console.error(error)
        }
    }
}