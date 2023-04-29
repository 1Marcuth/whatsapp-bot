import { proto, WASocket } from "@adiwajshing/baileys"

import ICommand from "../../command"

import IMessageParseModes from "../parse-modes"
import IGroupContext from "./group"

interface IMessageContext {
    sendText: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo | undefined>

    sendImage: (
        pathOrBuffer: string | Buffer,
        caption?: string,
        isReply?: boolean,
        captionParseMode?: IMessageParseModes
    ) => Promise<proto.WebMessageInfo | undefined>

    sendSticker: (
        pathOrBuffer: string | Buffer,
        isReply?: boolean
    ) => Promise<proto.WebMessageInfo | undefined>

    sendAudio: (
        pathOrBuffer: string | Buffer,
        isReply?: boolean,
        ptt?: boolean
    ) => Promise<proto.WebMessageInfo | undefined>

    sendVideo: (
        pathOrBuffer: string | Buffer,
        caption?: string,
        isReply?: boolean,
        captionParseMode?: IMessageParseModes
    ) => Promise<proto.WebMessageInfo | undefined>

    sendDocument: (
        pathOfFile: string,
        isReply?: boolean,
        mimetype?: string
    ) => Promise<proto.WebMessageInfo | undefined>

    sendPoll: (
        name: string,
        values: string[],
        selectableCount: number,
        isReply?: boolean,
        parseMode?: IMessageParseModes
    ) => Promise<proto.WebMessageInfo | undefined>

    replyText: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo | undefined>

    setReaction: (emoji: string, key?: proto.IMessageKey) => Promise<proto.WebMessageInfo | undefined>

    removeReaction: (key?: proto.IMessageKey) => Promise<proto.WebMessageInfo | undefined>

    sendTextMarkingEveryone: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo | undefined>

    replyTextMarkingEveryone: (text: string, parseMode?: IMessageParseModes) => Promise<proto.WebMessageInfo | undefined>

    group: IGroupContext

    commands?: ICommand[]
    socket: WASocket
    remoteJid: string | null | undefined
    botJid: string
    replyJid: string | null
    webMessage: proto.IWebMessageInfo
    isImage: boolean
    isSticker: boolean
    isAudio: boolean
    isVideo: boolean
    isDocument: boolean
    messageText: string | undefined | null
    userJid: string | undefined
    command: string
    options: string[]
}

export default IMessageContext