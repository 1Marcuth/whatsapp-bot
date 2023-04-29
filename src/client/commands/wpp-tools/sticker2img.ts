import sharp from "sharp"
import path from "path"
import fs from "fs"

import {  downloadSticker } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "sticker2img",
    description: "Transforma figurinha em uma imagem e envia no chat.",
    run: async (context) => {
        if (!context.isSticker) {
            await context.setReaction(reactionEmojis.error)
            return await context.replyText("Por favor, envie uma figurinha para ser convertida em uma imagem!")
        }

        const stickerFileName = randString(10) + ".webp"
        const outDir = ".tmp/"
        const stickerFilePath = path.join(outDir, stickerFileName)

        try {
            await downloadSticker(context.webMessage, stickerFileName, outDir)
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
        await context.replyText("Aguarde! Estou convertendo sua figurinha para uma imagem e assim que terminar, enviarei aqui no chat, ok?")

        const imageFileName = randString(10) + ".jpg"
        const imageFilePath = path.join(outDir, imageFileName)

        let image: sharp.Sharp

        try {
            sharp.cache(false)
            image = sharp(stickerFilePath)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao abrir a imagem",
                error.message
            )
        }

        try {
            await image.toFile(imageFilePath)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar salvar a imagem",
                error.message
            )
        }

        await context.sendImage(imageFilePath, "", true)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(imageFilePath)
        await fs.promises.unlink(stickerFilePath)
    }
}