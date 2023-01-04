import CommandsStorage from "./utils/command/storage"
import connectToWhatsApp from "./connection/index"
import handleCommands from "./handlers/commands"
import handleEvents from "./handlers/events"

function createClient() {
    let socket: any
    const commands = new CommandsStorage()
    
    async function connect() {
        socket = await connectToWhatsApp()
    }

    async function setCommandHandler() {
        await handleCommands(commands)
    }

    async function setEventsHandler() {
        await handleEvents(socket, { commands })
    }

    async function start() {
        console.log("> [client] Starting...")

        await connect()
        await setCommandHandler()
        await setEventsHandler()

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