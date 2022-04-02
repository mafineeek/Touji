export type CaseType = "warn" | "kick" | "ban" | "tempban" | "voicekick" | "voiceban" | "unban"
export default interface CaseData {
    type: CaseType,
    caseID?: number,
    userID: string,
    moderatorID: string,
    guildId: string,
    reason?: string,
    expireAt?: number,
    deleted?: boolean
}