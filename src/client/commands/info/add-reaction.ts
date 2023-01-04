import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "add-reaction",
    description: "Adiciona uma reação",
    run: async (context) => {
        console.log("Adding reaction")
        await context.addReaction("😃")

        setTimeout(async () => {
            console.log("Changing reaction")
            await context.addReaction("🤓")
        }, 5000)

        setTimeout(async () => {
            console.log("Removing reaction")
            await context.removeReaction()
        }, 10000)
    }
}