import CommandsStorage from "./utils/command/storage"
import connectToWhatsApp from "./connection/index"
import handleCommands from "./handlers/commands"
import handleEvents from "./handlers/events"

function createClient() {
    const commands = new CommandsStorage()
    let socket: any

    async function connect() {
        socket = await connectToWhatsApp()
    }

    async function useCommandHandler() {
        await handleCommands(commands)
    }

    async function useEventsHandler() {
        await handleEvents(socket, { commands })
    }

    async function start() {
        console.log("> [client] Starting...")

        await connect()
        await useCommandHandler()
        await useEventsHandler()

        console.log("> [client] Started successfully!")
    }

    function stop() {
        console.log("> [client] Stoping...")

        socket.end(null)

        console.log("> [client] Stopped successfully!")
    }

    return { start, stop }
}

export default createClient