export type SnipeAction = "deleted" | "edited";
export default interface SnipeData {
    type: SnipeAction,
    userID: string,
    guildId: string,
    channelId: string,
    oldContent?: string,
    content: string,
    createdAt: number
}