import { proto } from "@adiwajshing/baileys"
import path from "path"
import fs from "fs"

import { extractCommandAndOptions, formatHtmlToMarkdown } from "../content"
import extractDataFromWebMessage from "../data"
import getGroupContext from "./group/index"

import IMessageParseModes from "../../../interfaces/message/parse-modes"
import IMessageContext from "../../../interfaces/message/context/index"

async function getMessageContext(
    socket: any,
    webMessage: proto.IWebMessageInfo
): Promise<IMessageContext> {
    const { remoteJid } = webMessage.key

    async function sendText(text: string, parseMode: IMessageParseModes = "markdown") {
        if (parseMode === "html") {
            text = formatHtmlToMarkdown(text)
        }

        return socket.sendMessage(remoteJid, {
            text: `${text}`,
        })
    }

    async function sendImage(
        pathOrBuffer: string | Buffer,
        caption = "",
        isReply = true,
        captionParseMode: IMessageParseModes = "markdown"
    ) {
        if (captionParseMode === "html") {
            caption = formatHtmlToMarkdown(caption)
        }

        let options = {}

        if (isReply) {
            options = {
                quoted: webMessage,
            }
        }

        const image =
            pathOrBuffer instanceof Buffer
                ? pathOrBuffer
                : fs.readFileSync(pathOrBuffer)

        const params = caption
            ? {
                image,
                caption: caption,
            }
            : { image }

        return await socket.sendMessage(remoteJid, params, options)
    }

    async function sendSticker(pathOrBuffer: string | Buffer, isReply = true) {
        let options = {}

        if (isReply) {
            options = {
                quoted: webMessage,
            }
        }

        const sticker =
            pathOrBuffer instanceof Buffer
                ? pathOrBuffer
                : fs.readFileSync(pathOrBuffer)

        return await socket.sendMessage(remoteJid, { sticker }, options)
    }

    async function sendAudio(
        pathOrBuffer: string | Buffer,
        isReply = true,
        ptt = true
    ) {
        let options = {}

        if (isReply) {
            options = {
                quoted: webMessage,
            }
        }

        const audio =
            pathOrBuffer instanceof Buffer
                ? pathOrBuffer
                : fs.readFileSync(pathOrBuffer)

        if (pathOrBuffer instanceof Buffer) {
            return await socket.sendMessage(
                remoteJid,
                {
                    audio,
                    ptt,
                    mimetype: "audio/mpeg",
                },
                options
            )
        }

        options = { ...options, url: pathOrBuffer }

        return await socket.sendMessage(
            remoteJid,
            {
                audio: { url: pathOrBuffer },
                ptt,
                mimetype: "audio/mpeg",
            },
            options
        )
    }

    async function sendDocument(
        pathOfFile: string,
        isReply = true
    ) {
        let options = {}

        const fileName = path.basename(pathOfFile)

        if (isReply) {
            options = {
                quoted: webMessage
            }
        }

        options = { ...options, url: pathOfFile }

        return await socket.sendMessage(
            remoteJid,
            {
                document: { url: pathOfFile },
                fileName
            },
            options
        )
    }

    async function replyText(text: string, parseMode: IMessageParseModes = "markdown") {
        if (parseMode === "html") {
            text = formatHtmlToMarkdown(text)
        }

        return socket.sendMessage(
            webMessage.key.remoteJid,
            { text: text },
            { quoted: webMessage }
        )
    }

    async function addReaction(emoji: string, key: proto.IMessageKey = webMessage.key) {
        return socket.sendMessage(
            webMessage.key.remoteJid,
            {
                react: {
                    text: emoji,
                    key: key
                }
            }
        )
    }

    async function removeReaction(key: proto.IMessageKey = webMessage.key) {
        return socket.sendMessage(
            webMessage.key.remoteJid,
            {
                react: {
                    text: "",
                    key: key
                }
            }
        )
    }

    const group = await getGroupContext(socket, webMessage.key)

    const {
        messageText,
        isImage,
        isVideo,
        isSticker,
        isAudio,
        isDocument,
        userJid,
        replyJid
    } = extractDataFromWebMessage(webMessage)

    const { command, options } = messageText ? extractCommandAndOptions(messageText.toLowerCase()) :  { command: "", options: [] }
    
    return {
        sendText,
        sendImage,
        sendSticker,
        sendAudio,
        sendDocument,
        replyText,
        addReaction,
        removeReaction,
        group,
        remoteJid,
        userJid,
        replyJid,
        socket,
        webMessage,
        command,
        options,
        isImage,
        isVideo,
        isSticker,
        isAudio,
        isDocument,
    }
}

export default getMessageContext