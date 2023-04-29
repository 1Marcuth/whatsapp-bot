import { proto } from "@adiwajshing/baileys"

function extractDataFromWebMessage(message: proto.IWebMessageInfo) {
    let remoteJid: string | null = null
    let messageText: string | null | undefined

    let isReply = false

    let replyJid: string | null = null
    let reply: string | null | undefined = null

    const {
        key: { remoteJid: jid, participant: tempUserJid },
    } = message

    if (jid) {
        remoteJid = jid
    }

    if (message) {
        const extendedTextMessage = message.message?.extendedTextMessage
        const buttonTextMessage = message.message?.buttonsResponseMessage
        const listTextMessage = message.message?.listResponseMessage

        const type1 = message.message?.conversation
        const type2 = extendedTextMessage?.text
        const type3 = message.message?.imageMessage?.caption
        const type4 = buttonTextMessage?.selectedButtonId
        const type5 = listTextMessage?.singleSelectReply?.selectedRowId
        const type6 = message?.message?.videoMessage?.caption
        const type7 = message.message?.documentMessage?.caption
        const type8 = message.message?.documentWithCaptionMessage?.message?.conversation

        messageText = type1 || type2 || type3 || type4 || type5 || type6 || type7 || type8 || ""

        isReply =
            !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage

        replyJid =
            extendedTextMessage && extendedTextMessage.contextInfo?.participant
                ? extendedTextMessage.contextInfo.participant
                : null

        reply = extendedTextMessage?.contextInfo?.quotedMessage?.conversation
    }

    const userJid = tempUserJid?.replace(/:[0-9][0-9]|:[0-9]/g, "")

    const tempMessage = message?.message

    const isImage =
        !!tempMessage?.imageMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
        !!tempMessage?.viewOnceMessage?.message?.imageMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage ||
        !!tempMessage?.viewOnceMessageV2?.message?.imageMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage ||
        !!tempMessage?.viewOnceMessageV2Extension?.message?.imageMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.imageMessage

    const isVideo =
        !!tempMessage?.videoMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ||
        !!tempMessage?.viewOnceMessage?.message?.videoMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage ||
        !!tempMessage?.viewOnceMessageV2?.message?.videoMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage ||
        !!tempMessage?.viewOnceMessageV2Extension?.message?.videoMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.videoMessage

    const isAudio =
        !!tempMessage?.audioMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.audioMessage

    const isSticker =
        !!tempMessage?.stickerMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.stickerMessage

    const isDocument =
        !!tempMessage?.documentMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage ||
        !!tempMessage?.documentWithCaptionMessage ||
        !!tempMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.documentWithCaptionMessage
            

    let mentionedJid = ""

    let mentionedJidObject =
        tempMessage?.extendedTextMessage?.contextInfo?.mentionedJid

    if (mentionedJidObject) {
        mentionedJid = mentionedJidObject[0]
    }

    return {
        userJid,
        remoteJid,
        messageText,
        isReply,
        replyJid,
        reply,
        isAudio,
        isImage,
        isSticker,
        isVideo,
        isDocument,
        mentionedJid,
        webMessage: message,
    }
}

export default extractDataFromWebMessage