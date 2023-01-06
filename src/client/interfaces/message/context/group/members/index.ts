import IResponsesMembersUpdate from "./responses-members-update"

interface IMembersContext {
    add: (membersId: string[]) => Promise<IResponsesMembersUpdate>
    demote: (membersId: string[]) => Promise<IResponsesMembersUpdate>
    promote: (membersId: string[]) => Promise<IResponsesMembersUpdate>
    remove: (membersId: string[]) => Promise<IResponsesMembersUpdate>
}

export default  IMembersContext