import CommandOptionsParser from "bot-command-options-parser/dist"
import CommandOptionsStorage from "./options/sorage"

import IValidateResult from "bot-command-options-parser/dist/interfaces/validate-result"
import IMessageContext from "../../interfaces/message/context"
import ICommand from "../../interfaces/command"

class CommandWrapper {
    public command: ICommand

    constructor(command: ICommand) {
        this.command = command
    }

    public async run(context: IMessageContext) {
        if (this.command.options) {
            const optionsParser = new CommandOptionsParser(this.command.options)
            let optionsValidateResult: IValidateResult[]
            
            if (context.options.length > 0) {
                optionsValidateResult = optionsParser.validateOptions(context.options)

                let optionsError: any[] = []
                
                optionsValidateResult.forEach((option, i) => {
                    if (!option.isValid.value) optionsError.push({ i, ...option })
                })

                if (optionsError.length > 0) {
                    const optionsErrorMessage = "<code>Erro de argumentos:</code><br><br>" + optionsError.map((option) => {
                        const commandOption = this.command.options?.find(opt => opt.name === option.name)
                        return `<code>- ${option.i + 1} : ${option.name} [${option.type}]</code> | <b><i>${commandOption?.description}</i></b><br>`
                    }).join("")

                    return await context.replyText(optionsErrorMessage, "html")
                }

                const optionsStorage = new CommandOptionsStorage(optionsValidateResult)

                return await this.command.run(context, optionsStorage)
            } else {
                const optionsMenu = this.command.options.map((option, i) => `- ${i + 1} : <code>${option.name} [${option.type}]</code> | <b><i>${option.description}</i></b><br>`).join("")

                return await context.replyText(`<code>Envie os argumentos:</code><br><br>${optionsMenu}`, "html")
            }
        }
        
        return await this.command.run(context)
    }
}

export default CommandWrapper