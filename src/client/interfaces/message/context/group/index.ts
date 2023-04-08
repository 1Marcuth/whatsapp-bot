import { GroupMetadata, GroupParticipant } from "@adiwajshing/baileys"
import IOwer from "../../../../utils/message/context/group/ower"

import IMembersContext from "./members/index"

interface IGroupContext {
    create: (name: string, members: string[]) => Promise<GroupMetadata>

    leave: () => Promise<void>

    setName: (newName: string) => Promise<void>

    setDescription: (newDescription: string) => Promise<void>

    id?: string
    name?: string
    description?: string
    inviteUrl?: string
    creationTimestamp?: number
    ephemeralDuration?: number
    size?: number
    isRestrict?: boolean
    isOfAnnounce?: boolean
    ower?: IOwer
    membersList?: GroupParticipant[]
    members?: IMembersContext
}

export default IGroupContext