import { GroupMetadata, proto } from "@adiwajshing/baileys"
import IGroupContext from "../../../../interfaces/message/context/group/index"
import getMembersContext from "./members"

async function getGroupContext(socket: any, { remoteJid }: proto.IMessageKey): Promise<IGroupContext> {

    const metadata: GroupMetadata = await socket.groupMetadata(remoteJid)

    const id = metadata.id
    const name = metadata.subject
    const description = metadata.desc
    const inviteUrl = metadata.inviteCode
    const creationTimestamp = metadata.creation
    const ephemeralDuration = metadata.ephemeralDuration
    const size = metadata.size
    const isRestrict = metadata.restrict
    const isOfAnnounce = metadata.announce
    const ower = {
        id: metadata.owner,
        name: metadata.subjectOwner,
        note: metadata.descOwner
    }
    const membersList = metadata.participants

    async function create(name: string, membersId: string[]): Promise<GroupMetadata> {
        const group = await socket.groupCreate(name, membersId)

        return group
    }

    async function leave() {
        await socket.groupLeave(remoteJid)
    }

    async function setName(newName: string) {
        await socket.groupUpdateSubject(remoteJid, newName)
    }

    async function setDescription(newDescription: string) {
        await socket.groupUpdateDescription(remoteJid, newDescription)
    }

    const members = getMembersContext(socket, remoteJid)
    
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