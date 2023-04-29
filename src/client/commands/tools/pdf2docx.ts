import path from "path"
import fs from "fs"

import { downloadDocument } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"
import { pdfToDocx } from "../../../utils/file-converter"

export const command: ICommand = {
    name: "pdf2docx",
    description: "Converte um arquivo `.pdf.` para `.docx`",
    run: async (context) => {
        if (!context.isDocument) {
            return await context.replyText("Não é um documento")
        }

        const outDir = ".tmp/"
        const inputFileName = randString(10) + ".pdf"
        const inputFilePath = path.join(outDir, inputFileName)
        
        try {
            await downloadDocument(context.webMessage, inputFileName, outDir)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar baixar o arquivo",
                error.message
            )
        }

        await context.setReaction(reactionEmojis.waiting)
        await context.replyText(`Aguarde! Irei começar a fazer o download do seu aqruivo <code>.pdf</code> e converté-lo em <code>.docx</code>, e assim que eu terminar a conversão eu enviarei aqui no chat, ok?`, "html")

        let outputFilePath: string
        
        try {
            outputFilePath = await pdfToDocx(inputFilePath, outDir)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar converter o arquivo",
                error.message
            )
        }

        await context.sendDocument(
            outputFilePath,
            true,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(inputFilePath)
        await fs.promises.unlink(outputFilePath)
    }
}