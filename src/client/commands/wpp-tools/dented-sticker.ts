import sharp from "sharp"
import path from "path"
import fs from "fs"

import { downloadImage } from "../../utils/message/media/downloader"
import { reactionEmojis, stickerSize } from "../../settings"
import randString from "../../utils/random/rand-string"

import ICommand from "../../interfaces/command"
import { errorMessage } from "../../utils/message/message-template"

export const command: ICommand = {
    name: "dented-sticker",
    description: "Transforma uma imagem em uma figrinha sem cortar a imagem original.",
    run: async (context) => {
        if (!context.isImage) {
            await context.setReaction(reactionEmojis.error)
            return await context.replyText("Por favor, envie uma imagem para ser convertida em uma figurinha! Outros formatos de arquivo como vídeos, fotos de visualização única e documentos não são compatíveis.")
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
        await context.replyText("Aguarde! Estou convertendo sua imagem para uma figurinha e assim que terminar, enviarei aqui no chat, ok?")

        const stickerOutDir = ".tmp/"
        const stickerFileName = randString(10) + ".webp"
        const stickerFilePath = path.join(stickerOutDir, stickerFileName)

        let image: sharp.Sharp

        try {
            sharp.cache(false)
            image = sharp(imageFilePath).resize({ width: stickerSize.width })
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar redimensionar a imagem",
                error.message
            )
        }

        try {
            await image.toFile(stickerFilePath)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar salvar a imagem",
                error.message
            )
        }

        await context.sendSticker(stickerFilePath, true)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(imageFilePath)
        await fs.promises.unlink(stickerFilePath)
    }
}