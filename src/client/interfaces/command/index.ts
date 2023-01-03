import IValidateResult from "bot-command-options-parser/dist/interfaces/validate-result"
import IOption from "bot-command-options-parser/dist/interfaces/option"
import IMessageContext from "../message/context"

type Run = (context: IMessageContext, options?: IValidateResult[]) => Promise<any>

interface ICommand {
    name: string
    description: string
    options?: IOption[]
    run: Run
}

export default ICommand