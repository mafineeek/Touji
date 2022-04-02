export default interface PEX {
    pex: string,
    userID: string, 
    guildId: string,
    allowed: boolean
}

export interface GroupData {
    guildId: string,
    groupName: string,
    members?: Array<string>,
    roles?: Array<string>,
    pexes?: Array<string>
}

export interface PEXUserData {
    userID: string,
    guildId: string,
    pexes?: Array<string>
}