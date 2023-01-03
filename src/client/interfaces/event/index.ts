enum EventTypes { on }
type IEventTypes = keyof typeof EventTypes
type IRun = (socket: any, eventContext: any, ...args: any) => Promise<any>

interface IEvent {
    name: string
    type: IEventTypes,
    run: IRun
}

export default IEvent