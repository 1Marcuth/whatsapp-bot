import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys"
import { Boom } from "@hapi/boom"
import path from "path"

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, "..", "..", "..", "cache", "auth-info-multi"))

    const socket = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })
    socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            console.log(`> [client] Connection closed due to ${lastDisconnect?.error} reconnecting ${shouldReconnect}`)

            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === "open") {
            console.log("opened connection")
        }
    })

    socket.ev.on("creds.update", saveCreds)
    
    return socket
}

export default connectToWhatsApp