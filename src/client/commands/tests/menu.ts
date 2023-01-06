import { bot} from "../../settings"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "menu",
    description: "Envia o menu do bot",
    run: async (context) => {
        if (!context.commands) return
              
        let message = `<b>${bot.name} menu</b><br><br>`

        for (const command of context.commands) {
            message += `<code>${bot.prefix}${command.name}</code> - <b><i>${command.description}</i></b><br>${command.options ? command.options.map((option, i) => {
                return `    <code>- ${i + 1} : ${option.name}</code> | <i>${option.description}</i><br>`
            }).join("") : ""}`
        }

        await context.replyText(message, "html")
    }
}