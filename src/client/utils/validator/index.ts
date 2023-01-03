import { GroupParticipant, isJidGroup } from "@adiwajshing/baileys"
import IMessageContext from "../../interfaces/message/context"

async function isSuperAdmin(botData: IMessageContext) {
    return await validate("superadmin", botData)
}

async function isAdmin(botData: IMessageContext) {
    return (
        (await validate("admin", botData)) ||
        (await validate("superadmin", botData))
    )
}

async function validate(
    type: string,
    { remoteJid, socket, userJid }: IMessageContext
){
    if (remoteJid &&!isJidGroup(remoteJid)) return true

    const { participants } = await socket.groupMetadata(remoteJid)

    const participant = participants.find(
        (participant: GroupParticipant) => participant.id === userJid
    )

    return participant && participant.admin === type
}

export { isAdmin, isSuperAdmin }