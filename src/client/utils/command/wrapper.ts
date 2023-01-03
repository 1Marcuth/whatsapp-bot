import CommandOptionsParser from "bot-command-options-parser/dist"

import IValidateResult from "bot-command-options-parser/dist/interfaces/validate-result"
import ICommand from "../../interfaces/command"
import IMessageContext from "../../interfaces/message/context"

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
                return await this.command.run(context, optionsValidateResult)
            } else {
                const optionsMenu = this.command.options.map((option, i) => `- <code>${i} : ${option.name} [${option.type}]</code> | <b><i>${option.description}</i></b><br>`)
                    .join("")
                    .trim()
                return await context.replyText(`<code>Send the options:</code><br><br>${optionsMenu}`, "html")
            }
        }
        
        return await this.command.run(context)
    }
}

export default CommandWrapper