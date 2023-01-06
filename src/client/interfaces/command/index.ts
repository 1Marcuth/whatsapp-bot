import IOption from "bot-command-options-parser/dist/interfaces/option"
import IMessageContext from "../message/context"
import CommandOptionsStorage from "../../utils/command/options/sorage"

type Run = (context: IMessageContext, options?: CommandOptionsStorage) => Promise<any>

interface ICommand {
    name: string
    description: string
    options?: IOption[]
    run: Run
}

export default ICommand