import IMessageContext from "../message/context"

type Run = (context: IMessageContext) => Promise<any>

interface ISpecialWord {
    name: string
    run: Run
}

export default ISpecialWord