export interface IBotState {
    profile: IProfile
}

export interface IProfile {
    lastUpdate: IProfileLastUpdate
}

export interface IProfileLastUpdate {
    name: string
    description: string
    timestamp: number
}