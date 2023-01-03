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
        const inputTextOption = options?.find(option => option.name === "input-text")
        const inputQuantityOption = options?.find(option => option.name === "input-quantity")

        if (!inputTextOption?.isValid.value) {
            console.log("2 - input text option: ", inputTextOption)
            return await context.sendText("A opção texto tem um valor inválido")
        } else if (!inputTextOption.isValid.type) {
            return await context.sendText("A opção texto tem um tipo inválido")
        }

        if (!inputQuantityOption?.isValid.value) {
            return await context.sendText("A opção quantidade tem um valor inválido")
        } else if (!inputQuantityOption.isValid.type) {
            return await context.sendText("A opção quantidade tem um tipo inválido")
        }

        const inputText: string = inputTextOption.values.parsed
        const inputQuantity: number = inputQuantityOption.values.parsed

        for (let i = 0; i < inputQuantity; i++) {
            await context.sendText(`${inputText} - ${i}`)
        }
    }
}