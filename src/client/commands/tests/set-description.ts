import { isJidGroup } from "@adiwajshing/baileys"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "set-description",
    description: "Coloca uma descrição no grupo",
    run: async (context) => {
        if (!isJidGroup(context.remoteJid as string)) return await context.replyText("Current chat is not a group")

        const newDescription = context.options.join(" ").trim()

        if (newDescription === "") return await context.replyText("Where is the new description?")

        await context.group.setDescription(newDescription)
    }
}