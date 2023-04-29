import { BaileysEventMap, WASocket } from "@adiwajshing/baileys"

enum EventTypes { on }
type IEventTypes = keyof typeof EventTypes
type IRun = (socket: WASocket, eventContext: any, ...args: any) => Promise<any>

interface IEvent {
    name: keyof BaileysEventMap
    type: IEventTypes
    run: IRun
}

export default IEvent