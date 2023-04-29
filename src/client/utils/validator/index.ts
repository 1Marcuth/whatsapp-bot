import IMessageContext from "../../interfaces/message/context"
import { bot } from "../../settings"

function isBotOwer(jid: string) {
    return bot.owers.includes(jid)
}

function isAdmin(
    context: IMessageContext,
    jid: string
) {
    if (jid.startsWith("@")) {
        jid = jid.slice(1, jid.length)
    }

    const adminIds = context.group.membersList
        ?.filter(member => member.admin)
        .map(member => member.id)

    const isAdmin = adminIds ? adminIds?.includes(jid) : false

    return isAdmin
}

function isSuperAdmin(
    context: IMessageContext,
    jid: string
) {
    if (jid.startsWith("@")) {
        jid = jid.slice(1, jid.length)
    }

    const adminIds = context.group.membersList
        ?.filter(member => member.admin)
        .map(member => member.id)

    const isSuperAdmin = (adminIds ?
        context.group.membersList
            ?.find(member => member.id === jid)
            ?.admin === "superadmin"
        : false
    )

    return isSuperAdmin
}

export {
    isAdmin,
    isSuperAdmin,
    isBotOwer 
}