import sharp from "sharp"
import path from "path"
import fs from "fs"

import { downloadImage } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"
import { removeBackground } from "../../../utils/tools"

export const command: ICommand = {
    name: "rm-bg",
    description: "Transforma uma imagem em uma figrinha cortando a imagem original em um quadrado.",
    run: async (context) => {
        if (!context.isImage) {
            await context.setReaction(reactionEmojis.error)
            return await context.replyText("Por favor, envie uma imagem para ser convertida em uma figurinha! Outros formatos de arquivo como vídeos, fotos de visualização única e documentos não são compatíveis.")
        }

        const inputFileName = randString(10) + ".jpg"
        const outDir = ".tmp/"
        const inputFilePath = path.join(outDir, inputFileName)

        try {
            await downloadImage(context.webMessage, inputFileName, outDir)
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
        await context.replyText("Aguarde! Estou removendo o fundo da sua imagem e, assim que terminar lhe enviarei a imagem como documento aqui no chat, ok?")

        let outputFilePath: string

        try {
            outputFilePath = await removeBackground(inputFilePath, outDir)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar remover o fundo da imagem",
                error.message
            )
        }

        await context.sendDocument(outputFilePath, true, "image/png")
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(inputFilePath)
        await fs.promises.unlink(outputFilePath)
    }
}