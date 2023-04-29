import consultCep, { CEP } from "cep-promise"

import { errorMessage } from "../../utils/message/message-template"
import { reactionEmojis } from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "cep",
    description: "Consulta dados de um cep e envia no chat.",
    options: [
        {
            name: "cep",
            type: "string",
            description: "Cep a ser consultado.",
            required: true
        }
    ],
    run: async (context, options) => {
        const cep = options?.getParsedValue("cep") as string

        let cepData: CEP

        await context.replyText(`Aguarde! Irei fazer a solicitação de consuta do cep <i>${cep}</i> em um serviço externo, assim que eu concluir a consuta eu lhe enviarei os resultados no chat, Ok?`, "html")
        await context.setReaction(reactionEmojis.waiting)

        try {
            cepData = await consultCep(cep)
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro na consulta do Cep",
                error.message
            )
        }

        await context.replyText(
            "<b>Dados do cep:</b><br><br>" +
            `<b>- Cep:</b> <code>${cepData.cep}</code><br>` +
            `<b>- Serviço:</b> <code>${cepData.service}</code><br>` +
            `<b>- Estado:</b> <code>${cepData.state}</code><br>` +
            `<b>- Cidade:</b> <code>${cepData.city}</code><br>` +
            `<b>- Bairro:</b> <code>${cepData.neighborhood ? cepData.neighborhood : "Nenhum"}</code><br>` +
            `<b>- Rua:</b> <code>${cepData.street ? cepData.street : "Nenhum"}</code>`,
        "html")

        await context.setReaction(reactionEmojis.success)
    }
}