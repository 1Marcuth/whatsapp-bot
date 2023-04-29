import { Boom } from "@hapi/boom"
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    WASocket
} from "@adiwajshing/baileys"
import path from "path"

import { BotState } from "../../utils/bot-state"
import { sleep } from "../../utils/time"
import { bot } from "../settings"

async function updateProfileInfo(socket: WASocket, type: string[]) {
    console.log("> [client] Updating bot profile information...")

    if (type.includes("name")) {
        await socket.updateProfileName(bot.name)
    }

    if (type.includes("description")) {
        await socket.updateProfileStatus(bot.description)
    }
}

async function connectToWhatsApp() {
    const authStateFilePath = path.resolve(__dirname, "..", "..", "..", ".cache", "auth-info-multi")
    const { state, saveCreds } = await useMultiFileAuthState(authStateFilePath)

    const socket = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            console.log(`> [client] Connection closed due to ${lastDisconnect?.error} reconnecting ${shouldReconnect}.`)

            if (shouldReconnect) await connectToWhatsApp()

        } else if (connection === "open") {
            console.log("> [client] Opened connection.")

            await sleep(5000)

            const stateFilePath = path.resolve(__dirname, "..", "..", "..", "state", "bot-state.json")
            const state = await BotState.load(stateFilePath)

            const profileLastUpdate = state.getProfileLastUpdate()
            const currentTimestamp = new Date().getTime()

            async function updatedProfileThen(_: void) {
                console.log(`> [client] Profile successfully updated!\nNew name: ${bot.name}\nNew description: ${bot.description}`)
            
                state.setProfileLastUpdate({
                    name: bot.name,
                    description: bot.description,
                    timestamp: currentTimestamp
                })
            
                await state.save(stateFilePath)
            }
            
            async function updatedPofileCatch(error: any) {
                console.log("> [client] There was an error trying to update the profile information, I will try to update on the next bot launch.")
                console.error(error)

                state.save(stateFilePath)
            }

            if (bot.name !== profileLastUpdate.name) {
                if (bot.description !== profileLastUpdate.description) {
                    updateProfileInfo(socket, ["name", "description"])
                        .then(updatedProfileThen)
                        .catch(updatedPofileCatch)
                }

                updateProfileInfo(socket, ["name"])
                    .then(updatedProfileThen)
                    .catch(updatedPofileCatch)

            } else if (bot.description !== profileLastUpdate.description) {
                updateProfileInfo(socket, ["description"])
                    .then(updatedProfileThen)
                    .catch(updatedPofileCatch)
            }
        }
    })

    socket.ev.on("creds.update", saveCreds)
    
    return socket
}

export default connectToWhatsApp