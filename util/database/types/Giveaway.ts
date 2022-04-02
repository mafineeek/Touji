export default interface Giveaway {
    guildId: string,
    messageID: string,
    channelID: string,
    endAt: number,
    ended: boolean,
    winnerCount: number,
    prize: string
}