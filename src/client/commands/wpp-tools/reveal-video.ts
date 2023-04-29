import sharp from "sharp"
import path from "path"
import fs from "fs"

import { downloadVideo } from "../../utils/message/media/downloader"
import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "reveal-video",
    description: "Copia o vídeo da mensagem marcada com o comando, mesmo ele se for de visualização única.",
    run: async (context) => {
        if (!context.isVideo) {
            await context.setReaction(reactionEmojis.error)
            return await context.replyText("A mensagem marcada com o comando não contém um vídeo.")
        }

        const videoFileName = randString(10) + ".mp4"
        const videoOutDir = ".tmp/"
        const videoFilePath = path.join(videoOutDir, videoFileName)

        try {
            await downloadVideo(context.webMessage, videoFileName, videoOutDir)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return errorMessage(
                context,
                "Erro ao tentar baixar o vídeo",
                error.message
            )
        }

        await context.setReaction(reactionEmojis.waiting)
        await context.sendVideo(videoFilePath)
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(videoFilePath)
    }
}