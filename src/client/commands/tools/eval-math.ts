import { errorMessage } from "../../utils/message/message-template"
import { evaluateMathOperation } from "../../../utils/math"

import ICommand from "../../interfaces/command"

export const command: ICommand = {
    name: "eval-math",
    description: "Resolve uma operação matemática.",
    options: [
        {
            name: "math-operation",
            type: "string",
            description: "Operação matemática a ser resolvida.",
            required: true
        }
    ],
    run: async (context, options) => {
        const mathOperation = options?.getParsedValue("math-operation") as string

        let result: any

        try {
            result = evaluateMathOperation(mathOperation)

            if (typeof result !== "number") {
                throw new Error("Sua operação matemática foi rejeitada, pois aparenta ser um código malicioso.")
            }
        } catch(error: any) {
            return await errorMessage(
                context,
                "Erro ao tentar resolver a operação matemática",
                error.message
            )
        }

        await context.replyText(`${mathOperation} = ${result}`, "html")
    }
}