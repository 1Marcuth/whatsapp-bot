import { botPrefix } from "../../settings"

function isCommand(messageText: string) {
    return messageText.length > 1 && messageText.startsWith(botPrefix)
}

export {
    isCommand
}