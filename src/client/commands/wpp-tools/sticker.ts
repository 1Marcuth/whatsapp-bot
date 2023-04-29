import sharp from "sharp"
import path from "path"
import fs from "fs"

import { downloadImage } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import { reactionEmojis, stickerSize } from "../../settings"
import randString from "../../utils/random/rand-string"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "sticker",
    description: "Transforma uma imagem em uma figrinha cortando a imagem original em um quadrado.",
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

        sharp.cache(false)
        let image = sharp(imageFilePath)
        const imageMetadata = await image.metadata()

        let imageWidth: number
        let imageHeight: number

        try {
            imageWidth = stickerSize.width
            imageHeight = Math.round(((imageMetadata.height as number) / (imageMetadata.width as number)) * stickerSize.height)
            image = image.resize({ width: imageWidth, height: imageHeight })

            const imageTop = Math.round((imageHeight / 2) - (stickerSize.height / 2))
            const imageLeft = 0

            image = image.extract({
                height: stickerSize.height,
                left: imageLeft,
                top: imageTop,
                width: stickerSize.width
            })
        } catch(error: any) {
            imageWidth = Math.round(((imageMetadata.width as number) / (imageMetadata.height as number)) * stickerSize.width)
            imageHeight = stickerSize.height 
            image = image.resize({ width: imageWidth, height: imageHeight })

            const imageTop = 0
            const imageLeft = Math.round((imageWidth / 2) - (stickerSize.height / 2))

            image = image.extract({
                height: stickerSize.height,
                left: imageLeft,
                top: imageTop,
                width: stickerSize.width
            })
        }

        await image.toFile(stickerFilePath)
        await context.sendSticker(stickerFilePath, true)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(imageFilePath)
        await fs.promises.unlink(stickerFilePath)
    }
}