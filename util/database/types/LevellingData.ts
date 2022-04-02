export default interface LevellingData {
    userID: string,
    guildId: string,
    xp: number,
    level: number
}

export interface LevelReward {
    id: string,
    guildId: string,
    level: number
}