import { DownloadableMessage, downloadContentFromMessage, proto } from "@adiwajshing/baileys"
import path from "path"
import fs from "fs"

async function downloadImage(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const content = (webMessage?.message?.imageMessage ||
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.imageMessage) as DownloadableMessage

    if (!content) return null

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

    const filePath = path.resolve(...directory, `${fileName}.jpg`)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

async function downloadVideo(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const content = (webMessage?.message?.videoMessage ||
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage) as DownloadableMessage

    if (!content) return null

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

    if (subFolders.length) {
        directory = [...directory, ...subFolders]
    }

    const filePath = path.resolve(...directory, `${fileName}.mp4`)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

async function downloadSticker(
    webMessage: proto.IWebMessageInfo,
    fileName: string,
    folder: string | null = null,
    ...subFolders: string[]
) {
    const content = (webMessage?.message?.stickerMessage ||
        webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.stickerMessage) as DownloadableMessage

    if (!content) return null

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

    const filePath = path.resolve(...directory, `${fileName}.webp`)

    await fs.promises.writeFile(filePath, buffer)

    return filePath
}

export {
    downloadImage,
    downloadVideo,
    downloadSticker
}