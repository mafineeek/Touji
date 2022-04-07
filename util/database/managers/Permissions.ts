import { r, Connection, RDatum } from "rethinkdb-ts";
import { GroupData, PEXUserData } from "../types/PEX";
import { client } from "../../../index";
import Config from "../../../data/Config";

export default class PEXManager {
    public constructor(
        private connection: Connection
    ) {}

    public async has(userID: string, guildId: string, pex: string): Promise<boolean> {
        const guild = await client.guilds.fetch(guildId)!
        const defaultResult = (client.helpers.getUserGroup(guild.members.cache.get(userID)!) as any)[pex];

        return (await this.hasGlobal(userID, pex) ?? await this.hasInGroup(
            userID, guildId, pex
        ) ?? await this.hasUser(userID, guildId, pex)) ?? defaultResult ?? true
    }

    public async hasData(userID: string, guildId: string, pex: string): Promise<boolean> {
        const data = (await r.table("pex-permissions").getAll([userID, guildId], { index: "get" }).run(this.connection))[0] as PEXUserData;
        return !!data.pexes?.find((p) => p === pex)
    }

    public async getAll(userID: string, guildId: string): Promise<PEXUserData[]> {
        return await r.table("pex-permissions").getAll([userID, guildId], { index: "getAll" }).run(this.connection);
    }

    public async set(guildId: string, userID: string, pex: string): Promise<boolean> {
        return await this.modifyPermissions({ userID, guildId, pex })
    }

    public async inGroup(userId: string, guildId: string, groupName: string): Promise<boolean> {
        const response = await r.table("pex-groups").getAll([guildId, groupName], { index: "get" }).run(this.connection);
        return response[0].members?.includes(userId)
    }

    public async groupExists(guildId: string, groupName: string): Promise<boolean> {
        return !!(await this.getGroup(guildId, groupName))
    }

    public async getGroup(guildId: string, groupName: string): Promise<GroupData> {
        return (await r.table("pex-groups").getAll([guildId, groupName], { index: "get" }).run(this.connection))[0]
    }

    public async getUser(userID: string, guildId: string): Promise<PEXUserData> {
        return (await r.table("pex-permissions").getAll([userID, guildId], { index: "get" }).run(this.connection))[0]
    }

    public async addToGroup(data: GroupData & { userID: string }): Promise<boolean> {
        const groupData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).update({
            members: (groupData?.members || []).push(data.userID)
        }).run(this.connection)).replaced === 1;
    }

    public async addGroup(data: Exclude<GroupData, "userID">): Promise<boolean> {
        const response = await r.table("pex-groups").insert(data).run(this.connection);
        return response.inserted === 1;
    }
    
    public async removeGroup(data: { guildId: string, groupName: string }): Promise<boolean> {
        const response = await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).delete().run(this.connection);
        return response.deleted === 1;
    }

    public async removeFromGroup(data: Partial<GroupData> & { userID: string }): Promise<boolean> {
        const groupData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).update({
            members: (groupData?.members || []).removeOne(data.userID)
        }).run(this.connection)).replaced === 1;
    }

    public async addPEXToGroup(data: GroupData & { pex: string }): Promise<boolean> {
        const groupData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];

        if (groupData?.pexes?.includes(data.pex)) return false;

        return (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).update({
            pexes: (groupData?.pexes || []).removeOne(`-${data.pex}`).concat(data.pex)
        }).run(this.connection)).replaced === 1;
    }

    public async removePEXFromGroup(data: GroupData & { pex: string }): Promise<boolean> {
        const groupData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).update({
            pexes: (groupData?.pexes || []).removeOne(data.pex).concat(`-${data.pex}`)
        }).run(this.connection)).replaced === 1;
    }

    public async addPEXToUser(data: PEXUserData & { pex: string }): Promise<boolean> {
        await this.ensure(data.userID, data.guildId);

        const userData = (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).update({
            pexes: (userData?.pexes || []).removeOne(`-${data.pex}`).concat(data.pex)
        }).run(this.connection)).replaced === 1;
    }

    public async removePEXFromUser(data: PEXUserData & { pex: string }): Promise<boolean> {
        await this.ensure(data.userID, data.guildId);

        const userData = (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).update({
            pexes: (userData?.pexes || []).removeOne(data.pex).concat(`-${data.pex}`)
        }).run(this.connection)).replaced === 1;
    }

    public async addGlobal(pex: string): Promise<boolean> {
        await r.table("pex-global-permissions").get(`-${pex}`).delete().run(this.connection);

        const nextResponse = await r.table("pex-global-permissions").insert({ id: pex }).run(this.connection);

        return nextResponse.inserted === 1
    }

    public async removeGlobal(pex: string): Promise<boolean> {
        await r.table("pex-global-permissions").get(pex).delete().run(this.connection);

        const nextResponse = await r.table("pex-global-permissions").insert({ id: `-${pex}` }).run(this.connection);

        return nextResponse.inserted === 1
    }

    public async addRoleToGroup(data: GroupData & { role: string }): Promise<boolean> {
        const groupData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];

        if (groupData?.roles?.includes(data.role)) return false;

        return (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).update({
            roles: (groupData?.roles || []).concat(data.role)
        }).run(this.connection)).replaced === 1;
    }

    public async removeRoleFromGroup(data: GroupData & { role: string }): Promise<boolean> {
        const userData = (await r.table("pex-groups").getAll([data.guildId, data.groupName], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-permissions").getAll([data.guildId, data.groupName], { index: "get" }).update({
            roles: (userData?.roles || []).removeOne(data.role)
        }).run(this.connection)).replaced === 1;
    }

    public async addPEXesToUser(data: PEXUserData & { pexes: string[] }): Promise<boolean> {
        await this.ensure(data.userID, data.guildId);

        const userData = (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).run(this.connection))[0];
        return (await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" }).update({
            pexes: (userData?.pexes || []).concat(data.pexes)
        }).run(this.connection)).replaced === 1;
    }

    private async modifyPermissions(data: Partial<PEXUserData> & { pex: string }): Promise<boolean> {
        const response = await this.hasData(data.userID!, data.guildId!, data.pex!)
            ? await r.table("pex-permissions").getAll([data.userID, data.guildId], { index: "get" })
                .filter(r.row("pexes").contains(data.pex!))
                .update(data).run(this.connection)
            : await r.table("pex-permissions").insert(data).run(this.connection)
        return response.inserted === 1 || response.replaced === 1
    }

    private async hasUser(userID: string, guildId: string, pex: string): Promise<boolean | undefined> {
        const response = await r.table("pex-permissions").getAll([userID, guildId], { index: "get" }).filter(function (row: RDatum<string>) {
            return row("pexes").contains(pex).or(row("pexes").contains(`-${pex}`))
        }).run(this.connection);

        return typeof response[0] === "undefined" ? undefined : (!response[0].pexes?.includes(`-${pex}`) || response[0].pexes?.includes(pex));
    }

    private async hasGlobal(userID: string, pex: string): Promise<boolean | undefined> {
        const response = (await r.table("pex-global-permissions").filter(function (row: RDatum<string>) {
            return row("id").eq(pex).or(row("id").eq(`-${pex}`))
        }).run(this.connection))[0];

        return Config.PERMISSIONS.developer.includes(userID) ? true : false
    }

    private async hasInGroup(userID: string, guildId: string, pex: string): Promise<boolean | undefined> {
        const guild = await client.guilds.fetch(guildId)!;
        const user = await guild.members.fetch(userID)!;

        const response = await r.table("pex-groups").filter(function (row: RDatum<string>) {
            return row("guildId").eq(guildId).and(row("pexes").contains(pex).or(row("pexes").contains(`-${pex}`)))
        }).run(this.connection);

        return ((response[0]?.pexes?.includes(`-${pex}`) ? false : response[0]?.pexes?.includes(pex)) && response[0]?.roles?.some((rId: string) => user.roles.cache.has(rId)) ||
            response[0]?.members?.some((mId: string) => user.id === mId) ||
            undefined)
    }

    private async ensure(userID: string, guildId: string) {
        if (await this.getUser(userID, guildId)) return false;

        return await r.table("pex-permissions").insert({
            userID,
            guildId,
            pexes: []
        }).run(this.connection).catch(() => false);
    }
}