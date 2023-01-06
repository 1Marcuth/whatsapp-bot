import { bot } from "../../settings"

function isCommand(mesasgeContet: string) {
    if (!mesasgeContet.startsWith(bot.prefix)) return false
    if (mesasgeContet[bot.prefix.length + 1] === " ") return false
    if (mesasgeContet.trim().length < bot.prefix.length) return false
    
    return true
}

export { isCommand }