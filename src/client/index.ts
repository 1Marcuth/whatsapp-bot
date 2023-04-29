import { WASocket } from "@adiwajshing/baileys"

import SpecialWordsStorage from "./utils/special-word/storage"
import CommandsStorage from "./utils/command/storage"
import connectToWhatsApp from "./connection/index"

import handleSpecialWords from "./handlers/special-words"
import handleCommands from "./handlers/commands"
import handleEvents from "./handlers/events"

import { bot } from "./settings"

function createClient() {
    const commandsStorage = new CommandsStorage()
    const specialWordsStorage = new SpecialWordsStorage()
    let socket: WASocket

    async function connect() {
        socket = await connectToWhatsApp()

        setInterval(async () => {
            stop()

            socket = await connectToWhatsApp()
        }, bot.reconnectEvery)
    }

    async function useCommandHandler() {
        await handleCommands(commandsStorage)
    }

    async function useEventsHandler() {
        await handleEvents(socket, {
            commandsStorage, specialWordsStorage
        })
    }

    async function useSpecialWordsHandler() {
        await handleSpecialWords(specialWordsStorage)
    }

    async function start() {
        console.log("> [client] Starting...")

        await connect()
        await useCommandHandler()
        await useSpecialWordsHandler()
        await useEventsHandler()

        console.log("> [client] Started successfully!")
    }

    function stop() {
        console.log("> [client] Stoping...")

        try {
            socket.end(undefined)
        } catch(error) {}

        console.log("> [client] Stopped successfully!")
    }

    return { start, stop }
}

export default createClient