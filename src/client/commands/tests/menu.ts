import ICommand from "../../interfaces/command"
import { botName, botPrefix } from "../../settings"

export const command: ICommand = {
    name: "menu",
    description: "Envia o menu do bot",
    run: async (context) => {
        if (!context.commands) return

        let message = `<b>${botName} menu</b><br><br>`

        for (const command of context.commands) {
            message += `<code>${botPrefix}${command.name}</code> - <b><i>${command.description}</i></b>${command.options ? "<br>" + command.options.map((option, i) => {
                return `    <code>- ${i + 1} : ${option.name}</code> | <i>${option.description}</i><br>`
            }).join("") : "<br>"}`
        }

        await context.replyText(message, "html")
    }
}