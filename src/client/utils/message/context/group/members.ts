import IResponsesMembersUpdate from "../../../../interfaces/message/context/group/members/responses-members-update"
import IMembersContext from "../../../../interfaces/message/context/group/members/index"

function getMembersContext(socket: any, remoteJid: string | undefined | null): IMembersContext {

    async function add(membersId: string[]): Promise<IResponsesMembersUpdate> {
        return await socket.groupParticipantsUpdate(
            remoteJid, 
            membersId,
            "add"
        )
    }

    async function promote(membersId: string[]): Promise<IResponsesMembersUpdate> {
        return await socket.groupParticipantsUpdate(
            remoteJid, 
            membersId,
            "promote"
        )
    }

    async function demote(membersId: string[]): Promise<IResponsesMembersUpdate> {
        return await socket.groupParticipantsUpdate(
            remoteJid, 
            membersId,
            "demote"
        )
    }

    async function remove(membersId: string[]): Promise<IResponsesMembersUpdate> {
        return await socket.groupParticipantsUpdate(
            remoteJid, 
            membersId,
            "remove"
        )
    }
    
    return {
        add,
        promote,
        demote,
        remove
    }
}

export default getMembersContext