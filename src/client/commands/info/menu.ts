import { bot} from "../../settings"

import ICommand from "../../interfaces/command"

// for (const command of context.commands) {
//     message += `<code>${bot.prefix}${command.name}</code> - <b><i>${command.description}</i></b><br>${command.options ? command.options.map((option, i) => {
//         return `    <code>- ${i + 1} : ${option.name}</code> | <i>${option.description}</i><br>`
//     }).join("") : ""}`
// }

export const command: ICommand = {
    name: "menu",
    description: "Envia o menu do bot",
    run: async (context) => {
        if (!context.commands) return

        const date = new Date()
              
        let message = `╭━━⪩ BEM VINDO! ⪨━━<br>`

        message += `▢<br>▢ • ${bot.name}<br>▢ • Data: ${date.toLocaleDateString("pt-br")}<br>▢ • Hora: ${date.toLocaleTimeString("pt-br")}<br>▢ • Prefixo: ${bot.prefix}<br>▢<br>╰━━─「🪐」─━━<br>╭━━⪩ MENU ⪨━━<br>▢<br>`

        for (const command of context.commands) {
            message += `▢ • <code>${bot.prefix}${command.name}</code><br>`
        }

        message += `▢<br>╰━━─「🚀」─━━`

        await context.replyText(message, "html")
    }
}