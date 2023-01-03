import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "ping",
    description: "Envia o ping do bot",
    run: async (context) => {
        await context.replyText("Pong!")
    }
}