import { BaileysEventMap, WASocket } from "@adiwajshing/baileys"
import path from "path"
import fs from "fs"

import IEvent from "../interfaces/event"

export default async (socket: WASocket, kwargs: any) => {
    const eventsDirPath = path.join(__dirname, "../events")
    const fileExtension = path.extname(__filename)

    fs.readdirSync(eventsDirPath)
        .filter(file => file.endsWith(fileExtension))
        .forEach(async (file) => {
            const eventFilePath = path.join(eventsDirPath, file)
            const event = await importEvent(eventFilePath)

            if (event.type === "on") {
                loadOnEvent(event)
    
            } else {
                console.error(`> [client-error] The value '${event.type}' that informed for the type of the event is invalid.`)
            }

            function loadOnEvent(event: IEvent) {
                if (event.name !== "messages.upsert") {
                    socket.ev.on(event.name as keyof BaileysEventMap, (context: any) => event.run(socket, context)) 
                } else {
                    socket.ev.on(event.name, (context: any) => event.run(socket, context, kwargs))
                }

                console.log(`> [client] Event '${event.name}' loaded.`)
            }
        })

    async function importEvent(eventFilePath: string) {
        const event: IEvent  = (await import(eventFilePath)).event
        return event
    }
}