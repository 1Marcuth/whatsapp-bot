import { isJidGroup, isJidUser } from "@adiwajshing/baileys"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "add-member",
    description: "Adiciona uma reação",
    options: [
        {
            name: "phone-number",
            type: "string",
            description: "Número de telefone",
            required: true
        }
    ],
    run: async (context, options) => {
        if (!isJidGroup(context.remoteJid as string)) return await context.replyText("Current chat is not a group")

        const phoneNumber = options?.getParsedValue("phone-number")
        console.log(phoneNumber)
        const jidUser = `${phoneNumber}@s.whatsapp.net`

        if (!isJidUser(jidUser)) return await context.replyText(`${phoneNumber} not is valid`)

        await context.group.members.add([ jidUser ])
    }
}