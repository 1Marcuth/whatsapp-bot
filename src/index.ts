import createClient from "./client"

(async () => {
    const client = createClient()

    await client.start()
})()