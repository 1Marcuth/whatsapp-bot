import sharp from "sharp"
import path from "path"
import fs from "fs"

import { downloadImage } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "reveal-image",
    description: "Copia a imagem da mensagem marcada com o comando, mesmo se ela for de visualização única.",
    run: async (context) => {
        if (!context.isImage) {
            await context.setReaction(reactionEmojis.error)
            return await context.replyText("A mensagem marcada com o comando não contém uma imagem.")
        }

        const imageFileName = randString(10) + ".jpg"
        const imageOutDir = ".tmp/"
        const imageFilePath = path.join(imageOutDir, imageFileName)

        try {
            await downloadImage(context.webMessage, imageFileName, imageOutDir)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return errorMessage(
                context,
                "Erro ao tentar baixar a imagem",
                error.message
            )
        }

        await context.setReaction(reactionEmojis.waiting)
        await context.sendImage(imageFilePath)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(imageFilePath)
    }
}