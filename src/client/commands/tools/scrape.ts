import axios, { AxiosResponse } from "axios"
import path from "path"
import fs from "fs"

import { errorMessage } from "../../utils/message/message-template"
import randString from "../../utils/random/rand-string"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "scrape",
    description: "Pega o HTML de uma página web e envia como documento.",
    options: [
        {
            name: "url",
            type: "string",
            description: "Url do site a ser acessado.",
            required: true
        }
    ],
    run: async (context, options) => {
        const url = "https://" + (options?.getParsedValue("url") as string)

        await context.replyText(`Aguarde! Irei começar a fazer a requisição na url <i>${url}</i> e assim que terminar eu enviarei o HTML da página aqui no chat, Ok?`, "html")
        await context.setReaction(reactionEmojis.waiting)

        let response: AxiosResponse

        try {
            response = await axios.get(url)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro na requisição",
                error.message
            )
        }

        const data = response.data

        const fileName = (
            randString(10) +
            "-" +
            url.replace("https://", "")
                .replace(/\/|\\/g, "-") +
            "-scraped" +
            ".html"
        )
        const outDir = ".tmp/"
        const filePath = path.join(outDir, fileName)

        try {
            await fs.promises.writeFile(filePath, data)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar escrever o arquivo HTML",
                error.message
            )
        }
        
        await context.sendDocument(filePath, true, "text/html")
        await context.setReaction(reactionEmojis.success)
        await fs.promises.unlink(filePath)
    }
}