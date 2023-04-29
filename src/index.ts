import createClient from "./client"

async function start(): Promise<void> {
    const client = createClient()

    try {
        await client.start()
    } catch(error: any) {
        return start()
    }
}

start()