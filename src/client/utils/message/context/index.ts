import { proto, WASocket } from "@adiwajshing/baileys"
import path from "path"
import fs from "fs"

import { extractCommandAndOptions, formatHtmlToMarkdown } from "../content"
import extractDataFromWebMessage from "../data"
import getGroupContext from "./group/index"

import IMessageParseModes from "../../../interfaces/message/parse-modes"
import IMessageContext from "../../../interfaces/message/context/index"

async function getMessageContext(
    socket: WASocket,
    webMessage: proto.IWebMessageInfo
): Promise<IMessageContext> {
    const remoteJid = webMessage.key.remoteJid as string
    const botJid = "@" + (socket.user?.id as string).replace(":2", "")

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

    async function sendVideo(
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
    
        const video =
            pathOrBuffer instanceof Buffer
                ? pathOrBuffer
                : fs.readFileSync(pathOrBuffer)
    
        const params = caption
            ? {
                video,
                caption: caption,
            }
            : { video }
    
        return await socket.sendMessage(remoteJid, params, options)
    }

    async function sendDocument(
        pathOfFile: string,
        isReply = true,
        mimetype: string = ""
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
                mimetype,
                document: { url: pathOfFile },
                fileName
            },
            options
        )
    }

    async function sendPoll(
        name: string,
        values: string[],
        selectableCount: number,
        isReply = true,
        parseMode: IMessageParseModes = "markdown"
    ) {
        if (parseMode === "html") {
            name = formatHtmlToMarkdown(name)
            values = values.map(value => formatHtmlToMarkdown(value))
        }

        let options = {}

        if (isReply) {
            options = {
                quoted: webMessage
            }
        }

        return await socket.sendMessage(
            remoteJid,
            {
                poll: {
                    name,
                    values,
                    selectableCount
                }
            },
            options
        )
    }

    async function replyText(text: string, parseMode: IMessageParseModes = "markdown") {
        if (parseMode === "html") {
            text = formatHtmlToMarkdown(text)
        }

        return await socket.sendMessage(
            remoteJid,
            { text: text },
            { quoted: webMessage }
        )
    }

    async function setReaction(emoji: string, key: proto.IMessageKey = webMessage.key) {
        return await socket.sendMessage(
            remoteJid,
            {
                react: {
                    text: emoji,
                    key: key
                }
            }
        )
    }

    async function removeReaction(key: proto.IMessageKey = webMessage.key) {
        return await setReaction("", key)
    }

    async function sendTextMarkingEveryone(text: string, parseMode: IMessageParseModes = "markdown") {
        if (parseMode === "html") {
            text = formatHtmlToMarkdown(text)
        }

        return await socket.sendMessage(remoteJid, {
            text: `${text}`,
            mentions: group.membersList?.map(member => member.id)
        })
    }

    async function replyTextMarkingEveryone(text: string, parseMode: IMessageParseModes = "markdown") {
        if (parseMode === "html") {
            text = formatHtmlToMarkdown(text)
        }

        return await socket.sendMessage(
            remoteJid,
            {
                text: text,
                mentions: group.membersList?.map(member => member.id)
            },
            { quoted: webMessage },
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

    const { command, options } = messageText ? extractCommandAndOptions(messageText) : { command: "", options: [] }
    
    return {
        sendText,
        sendImage,
        sendSticker,
        sendAudio,
        sendVideo,
        sendDocument,
        sendPoll,
        replyText,
        setReaction,
        removeReaction,
        sendTextMarkingEveryone,
        replyTextMarkingEveryone,
        group,
        remoteJid,
        userJid,
        botJid,
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
        messageText
    }
}

export default getMessageContext