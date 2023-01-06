import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "say",
    description: "Faz o bot falar alguma coisa",
    options: [
        {
            name: "input-text",
            type: "string",
            description: "O que o bot vai dizer",
            required: true
        },
        {
            name: "input-quantity",
            type: "integer",
            description: "Quantas vezes o bot vai repetir",
            required: true
        }
    ],
    run: async (context, options) => {
        const inputText = options?.getParsedValue("input-text")
        const inputQuantity = options?.getParsedValue("input-quantity")
        
        if (inputQuantity > 10) {
            return await context.replyText("<code>ERROR:</code> <b>YOU WANT ME TO SEND TOO MANY MESSAGES!</b>", "html")
        }

        for (let i = 0; i < inputQuantity; i++) {
            await context.sendText(inputText)
        }
    }
}