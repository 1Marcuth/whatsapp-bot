import IMessageContext from "../../interfaces/message/context"

async function warningMessage(
    context: IMessageContext,
    type: string,
    contnet: string
) {
    const message = `[ <b>Warning</b>: <i>${type}</i> ]<br><code>${contnet}</code>`
    return context.replyText(message, "html")
}

async function errorMessage(
    context: IMessageContext,
    type: string,
    contnet: string
) {
    const message = `[ <b>Error</b>: <i>${type}</i> ]<br><code>${contnet}</code>`
    return context.replyText(message, "html")
}

async function criticalErrorMessage(
    context: IMessageContext,
    type: string,
    contnet: string
) {
    const message = `[ <b>CRITICAL ERROR</b>: <i>${type}</i> ]<br><code>${contnet}</code>`
    return context.replyText(message, "html")
}

export {
    warningMessage,
    errorMessage,
    criticalErrorMessage
}