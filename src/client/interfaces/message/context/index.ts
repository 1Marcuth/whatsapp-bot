import { proto } from "@adiwajshing/baileys"

import ICommand from "../../command"

import IMessageParseModes from "../parse-modes"
import IGroupContext from "./group"

interface IMessageContext {
    sendText: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo>

    sendImage: (
        pathOrBuffer: string | Buffer,
        caption?: string,
        isReply?: boolean,
        captionParseMode?: IMessageParseModes
    ) => Promise<proto.WebMessageInfo>

    sendSticker: (
        pathOrBuffer: string | Buffer,
        isReply?: boolean
    ) => Promise<proto.WebMessageInfo>

    sendAudio: (
        pathOrBuffer: string | Buffer,
        isReply?: boolean,
        ptt?: boolean
    ) => Promise<proto.WebMessageInfo>

    sendDocument: (
        pathOfFile: string,
        isReply?: boolean
    ) => Promise<proto.WebMessageInfo>

    replyText: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo>

    addReaction: (emoji: string, key?: proto.IMessageKey) => Promise<proto.WebMessageInfo>

    removeReaction: (key?: proto.IMessageKey) => Promise<proto.WebMessageInfo>

    group: IGroupContext

    commands?: ICommand[]
    socket: any
    remoteJid: string | null | undefined
    replyJid: string | null
    webMessage: proto.IWebMessageInfo
    isImage: boolean
    isSticker: boolean
    isAudio: boolean
    isVideo: boolean
    isDocument: boolean
    userJid: string | undefined
    command: string
    options: string[]
}

export default IMessageContext