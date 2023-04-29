import path from "path"
import fs from "fs"

import { downloadVideoAudioFromYouTube } from "../../../utils/youtube"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"

import ICommand from "../../interfaces/command"
import { reactionEmojis } from "../../settings"

export const command: ICommand = {
    name: "yt-audio",
    description: "Baixa áudio de um vídeo do YouTube e envia no chat.",
    options: [
        {
            name: "url",
            type: "string",
            description: "Url do vídeo a ser extraido o áudio.",
            required: true
        }
    ],
    run: async (context, options) => {
        const url = "https://" + (options?.getParsedValue("url") as string)

        const outDir = ".tmp"
        const fileName = randString(10) + ".mp3"
        const filePath = path.join(outDir, fileName)

        await context.replyText(`Aguarde! Irei começar a fazer o download do aúdio do seu vídeo de url <i>${url}</i> e assim que terminar aqui será enviado o aúdio automaticamente, Ok?`, "html")
        await context.setReaction(reactionEmojis.waiting)

        try {
            await downloadVideoAudioFromYouTube(url, filePath)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar baixar o arquivo",
                error.message
            )
        }

        await context.sendAudio(filePath, true, false)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(filePath)
    }
}