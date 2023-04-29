import fs from "fs"

import { IBotState, IProfileLastUpdate } from "./interfaces"

class BotState {
    private state: IBotState

    public constructor(state: IBotState) {
        this.state = state
    }

    public static async load(filePath: string) {
        const jsonString = await fs.promises.readFile(filePath, { encoding: "utf-8" })
        const json = JSON.parse(jsonString) as IBotState
        return new BotState(json)
    }

    public async save(filePath: string) {
        const jsonString = JSON.stringify(this.state)
        await fs.promises.writeFile(filePath, jsonString)
    }

    public getProfileLastUpdate() {
        return this.state.profile.lastUpdate
    }

    public setProfileLastUpdate(lastUpdateData: IProfileLastUpdate) {
        this.state.profile.lastUpdate = lastUpdateData
    }
}

export { BotState }