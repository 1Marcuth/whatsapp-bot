import { isJidGroup, isJidUser } from "@adiwajshing/baileys"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "remove-member",
    description: "Adiciona uma reação",
    options: [
        {
            name: "member-mention",
            type: "string",
            description: "Menção do membro",
            required: true
        }
    ],
    run: async (context, options) => {
        if (!isJidGroup(context.remoteJid as string)) return await context.replyText("Current chat is not a group")

        const memberMention = options?.getParsedValue("member-mention")
        console.log(memberMention)

        const jidUser = `${memberMention.replace("@", "")}@s.whatsapp.net`

        if (!isJidUser(jidUser)) return await context.replyText(`${jidUser} not is valid`)

        await context.group.members.remove([ jidUser ])
    }
}