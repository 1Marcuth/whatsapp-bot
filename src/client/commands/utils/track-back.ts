import { rastrearEncomendas as trackOrders } from "correios-brasil"

// import { errorMessage } from "../../utils/message/message-template"
// import { reactionEmojis } from "../../settings"
import { isoToDate } from "../../../utils/time"

import ICommand from "../../interfaces/command"
import { reactionEmojis } from "../../settings"
import { errorMessage } from "../../utils/message/message-template"

function booleanToYesOrNo(bool: boolean) {
    return bool ? "Sim" : "Não"
}

interface IUnidadeDestino {
    endereco: {
        cidade: string,
        uf: string
    }
    tipo: string
}

interface IUnidadeOrigem {
    endereco: {}
    nome: string
    tipo: string
}

interface ITrackOrderResult {
    mensagem?: string
    codObjeto?: string
    dtPrevista?: string
    eventos?: Array<{
        codigo: string
        descricao: string
        dtHrCriado: string
        tipo: string
        unidade?: IUnidadeOrigem
        unidadeDestino?: IUnidadeDestino
        urlIcone?: string
    }>
    tipoPostal?: {
        categoria: string
        descricao: string
        sigla: string
    }
    habilitaAutoDeclaracao?: boolean
    permiteEncargoImportacao?: boolean
    habilitaPercorridaCarteiro?: boolean
    bloqueioObjeto?: boolean
    possuiLocker?: boolean
    habilitaLocker?: boolean
    habilitaCrowdshipping?: boolean
}
  

export const command: ICommand = {
    name: "track-back",
    description: "Rastreia sua encomenda.",
    options: [
        {
            name: "order-code",
            type: "string",
            description: "Código da encomenda a ser rastreada.",
            required: true
        }
    ],
    run: async (context, options) => {
        const orderCode = options?.getParsedValue("order-code") as string

        await context.replyText(`Aguarde! Irei fazer a solicitação de consuta do código de rastreio <i>${orderCode}</i> da sua enconmenda em um serviço externo, assim que eu concluir a consuta eu lhe enviarei os resultados no chat, Ok?`, "html")
        await context.setReaction(reactionEmojis.waiting)

        let result: ITrackOrderResult

        try {
            result = (
                await trackOrders([ orderCode ]) as any[]
            )[0]
        } catch(error: any) {
            console.error(error)

            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar rastrear a encomenda",
                error.message
            )
        }

        if (result.mensagem) {
            await context.setReaction(reactionEmojis.error)
            return await errorMessage(
                context,
                "Erro ao tentar rastrear a encomenda",
                result.mensagem
            )
        }

        await context.replyText(
            "<b>Dados da encomenda:</b><br><br>" + 
            `<b>Código:</b> <code>${result.codObjeto}</code><br>` +
            `<b>Previsão de entrega:</b> <code>${isoToDate(result.dtPrevista as string)}</code><br>` + 
            `<b>Auto declaração habilidada:</b> <code>${booleanToYesOrNo(result.habilitaAutoDeclaracao as boolean)}</code><br>` + 
            `<b>Encargo de importação permitida:</b> <code>${booleanToYesOrNo(result.permiteEncargoImportacao as boolean)}</code><br>` + 
            `<b>Percorrida por carteiro:</b> <code>${booleanToYesOrNo(result.habilitaPercorridaCarteiro as boolean)}</code><br>` + 
            `<b>Encomenda bloqueada:</b> <code>${booleanToYesOrNo(result.bloqueioObjeto as boolean)}</code><br>` +
            `<b>Possui locker:</b> <code>${booleanToYesOrNo(result.possuiLocker as boolean)}</code><br>` + 
            `<b>Locker habilitado:</b> <code>${booleanToYesOrNo(result.habilitaLocker as boolean)}</code><br>` + 
            `<b>Crowdshipping habilitado:</b> <code>${booleanToYesOrNo(result.habilitaCrowdshipping as boolean)}</code>`
            ,
        "html")

        await context.replyText(
            "<b>Tipo postal:</b><br><br>" + 
            `<b>Categoria:</b> <code>${result.tipoPostal?.categoria}</code><br>` +
            `<b>Descrição:</b> <code>${result.tipoPostal?.descricao}</code><br>` +
            `<b>Sigla:</b> <code>${result.tipoPostal?.sigla}</code><br>`,
        "html")

        await context.replyText(
            "<b>Eventos:</b><br><br>" +
            `${result.eventos?.map((evento, index) => {
                return `<i><b>- Evento ${index + 1}:</b></i><br>` + 
                    (evento.unidade && evento.unidade?.tipo ? (
                        `\t<b>- Unidade de origem:</b><br>` + 
                        `\t\t<b>- ${evento.unidade?.tipo}:</b> <code>${evento.unidade?.nome}</code><br>`
                    ) : "") +
                    (evento.unidadeDestino && evento.unidadeDestino?.tipo ? (
                        "\t<b>- Unidade de destino:</b><br>" + 
                        `\t\t<b>- Tipo:</b> <code>${evento.unidadeDestino?.tipo}</code><br>` +
                        `\t\t<b>- Estado:</b> <code>${evento.unidadeDestino?.endereco.uf}</code><br>` +
                        `\t\t<b>- Cidade:</b> <code>${evento.unidadeDestino?.endereco.cidade}</code><br>`
                    ) : "") +
                    `\t<b>- Código:</b> <code>${evento.codigo}</code><br>` +
                    `\t<b>- Descrição:</b> <code>${evento.descricao}</code><br>` +
                    `\t<b>- Criado em:</b> <code>${isoToDate(evento.dtHrCriado)}</code><br>` +
                    `\t<b>- Tipo:</b> <code>${evento.tipo}</code><br>` +
                    "<br>-----------------------------------------------------<br>"
            }).join("<br>")}`,
        "html")

        await context.setReaction(reactionEmojis.success)
    }
}