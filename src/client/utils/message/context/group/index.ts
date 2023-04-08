import { GroupMetadata, GroupParticipant, isJidGroup, proto } from "@adiwajshing/baileys"

import IGroupContext from "../../../../interfaces/message/context/group/index"
import IMembersContext from "../../../../interfaces/message/context/group/members"
import getMembersContext from "./members"
import IOwer from "./ower"

async function getGroupContext(socket: any, { remoteJid }: proto.IMessageKey): Promise<IGroupContext> {
    async function create(name: string, membersId: string[]): Promise<GroupMetadata> {
        const group = await socket.groupCreate(name, membersId)
        return group
    }

    async function leave(jid = remoteJid) {
        await socket.groupLeave(jid)
    }

    async function setName(newName: string, jid = remoteJid) {
        await socket.groupUpdateSubject(jid, newName)
    }

    async function setDescription(newDescription: string, jid = remoteJid) {
        await socket.groupUpdateDescription(remoteJid, newDescription)
    }

    let id: string | undefined
    let name: string | undefined
    let description: string | undefined
    let inviteUrl: string | undefined
    let creationTimestamp: number | undefined
    let ephemeralDuration: number | undefined
    let size: number | undefined
    let isRestrict: boolean | undefined
    let isOfAnnounce: boolean | undefined
    let ower: IOwer | undefined
    let membersList: GroupParticipant[] | undefined
    let members: IMembersContext | undefined

    if (isJidGroup(remoteJid as string)) {
        const metadata: GroupMetadata = await socket.groupMetadata(remoteJid)

        id = metadata.id
        name = metadata.subject
        description = metadata.desc
        inviteUrl = metadata.inviteCode
        creationTimestamp = metadata.creation
        ephemeralDuration = metadata.ephemeralDuration
        size = metadata.size
        isRestrict = metadata.restrict
        isOfAnnounce = metadata.announce
        ower = {
            id: metadata.owner,
            name: metadata.subjectOwner,
            note: metadata.descOwner
        }
        membersList = metadata.participants
        members = getMembersContext(socket, remoteJid)
    }

    return {
        create,
        leave,
        setName,
        setDescription,
        id,
        name,
        description,
        inviteUrl,
        creationTimestamp,
        ephemeralDuration,
        size,
        isRestrict,
        isOfAnnounce,
        ower,
        membersList,
        members
    }  
}

export default getGroupContext