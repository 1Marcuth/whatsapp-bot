import { DownloadableMessage, downloadContentFromMessage, proto } from "@adiwajshing/baileys"
import path from "path"
import fs from "fs"

async function downloadImage(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const message = webMessage.message
    const content = (
        message?.imageMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
        message?.viewOnceMessage?.message?.imageMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.imageMessage ||
        message?.viewOnceMessageV2?.message?.imageMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.imageMessage ||
        message?.viewOnceMessageV2Extension?.message?.imageMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.imageMessage
    ) as DownloadableMessage

    if (!content) {
        throw new Error("Message without image!")
    }

    const stream = await downloadContentFromMessage(content, "image")

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    let directory = [__dirname, "..", "..", "..", "..", ".."]

    if (!folder) {
        directory = [...directory, ".tmp"]
    }

    if (folder) {
        directory = [...directory, folder]
    }

    if (subFolders.length) {
        directory = [...directory, ...subFolders]
    }

    const filePath = path.resolve(...directory, fileName)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

async function downloadVideo(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const message = webMessage.message
    const content = (
        message?.videoMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ||
        message?.viewOnceMessage?.message?.videoMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessage?.message?.videoMessage ||
        message?.viewOnceMessageV2?.message?.videoMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2?.message?.videoMessage ||
        message?.viewOnceMessageV2Extension?.message?.videoMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2Extension?.message?.videoMessage
    ) as DownloadableMessage

    if (!content) {
        throw new Error("Message without video!")
    }

    const stream = await downloadContentFromMessage(content, "video")

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    let directory = [__dirname, "..", "..", "..", "..", ".."]

    if (!folder) {
        directory = [...directory, ".tmp"]
    }

    if (folder) {
        directory = [...directory, folder]
    }

    if (subFolders.length > 0) {
        directory = [...directory, ...subFolders]
    }

    const filePath = path.resolve(...directory, fileName)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

async function downloadSticker(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const content = (
        webMessage?.message?.stickerMessage ||
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage
    ) as DownloadableMessage

    if (!content) {
        throw new Error("Message without sticker!")
    }

    const stream = await downloadContentFromMessage(content, "sticker")

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    let directory = [__dirname, "..", "..", "..", "..", ".."]

    if (!folder) {
        directory = [...directory, ".tmp"]
    }

    if (folder) {
        directory = [...directory, folder]
    }

    if (subFolders.length) {
        directory = [...directory, ...subFolders]
    }

    const filePath = path.resolve(...directory, fileName)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

async function downloadDocument(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const message = webMessage?.message

    const content = (
        message?.documentMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage ||
        message?.documentWithCaptionMessage ||
        message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentWithCaptionMessage
    ) as DownloadableMessage

    if (!content) {
        throw new Error("Message without document!")
    }

    const stream = await downloadContentFromMessage(content, "document")

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    let directory = [__dirname, "..", "..", "..", "..", ".."]

    if (!folder) {
        directory = [...directory, ".tmp"]
    }

    if (folder) {
        directory = [...directory, folder]
    }

    if (subFolders.length) {
        directory = [...directory, ...subFolders]
    }

    const filePath = path.resolve(...directory, fileName)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

export {
    downloadImage,
    downloadVideo,
    downloadSticker,
    downloadDocument
}