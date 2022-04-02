import { r, Connection } from "rethinkdb-ts";
import LevellingData, { LevelReward } from "../types/LevellingData";

export const LevellingDefaultData = { xp: 0, level: 0 };
export default class LevellingManager {
    public constructor(
        private connection: Connection
    ) {}

    public levelToXp(level: number) {
        return 5 * (Math.pow(level, 2)) + 50 * level + 100;
    }

    public async addRoleReward(data: LevelReward): Promise<boolean> {
        const response = await r.table("role-rewards").insert(data).run(this.connection);
        return response.inserted === 1
    }

    public async removeRoleReward(guildId: string, level: number): Promise<boolean> {
        const response = await r.table("role-rewards").getAll([level, guildId], { index: "getLevel" }).delete().run(this.connection);
        return response.deleted === 1
    }

    public async getRoleRewards(guildId: string): Promise<LevelReward[]> {
        return await r.table("role-rewards").getAll([guildId], { index: "getGuild" }).run(this.connection);
    }

    public async xpToLevel(xp: number) {
        let level = 0;
        while (xp >= this.levelToXp(level)) {
            xp -= this.levelToXp(level);
            level++
        };

        return level;
    }

    public async giveXp(userID: string, guildId: string) {
        const data = await this.getUser(userID, guildId);
        const response = await r.table("levelling").getAll([userID, guildId], { index: "getAll" }).update({
            xp: (data.xp ?? 0) + Math.randomInteger(10, 25)
        }).run(this.connection);

        return response.replaced === 1
    }

    public async addLevel(userID: string, guildId: string, count: number) {
        const data = await this.getUser(userID, guildId);

        await r.table("levelling").getAll([userID, guildId], { index: "getAll" }).update({
            xp: 0,
            level: (data.level ?? 0) + count
        }).run(this.connection);

        return data.level + count;
    }

    public async setXP(userID: string, guildId: string, xp: number) {
        const response = await r.table("levelling").getAll([userID, guildId], { index: "getAll" }).update({
            xp: xp
        }).run(this.connection);

        return response.replaced === 1
    }

    public async setLevel(userID: string, guildId: string, level: number) {
        const response = await r.table("levelling").getAll([userID, guildId], { index: "getAll" }).update({
            level: level
        }).run(this.connection);

        return response.replaced === 1
    }

    public async getUser(userID: string, guildId: string): Promise<LevellingData> {
        const data = (await r.table("levelling").getAll([userID, guildId], { index: "getAll" }).run(this.connection))[0];
        return data ? data : await this.insert(userID, guildId);
    }

    public async getAll(guildId: string): Promise<LevellingData[]> {
        const response = await r.table("levelling").getAll([guildId], { index: "getGuild" }).orderBy("level").run(this.connection);
        return response.reverse();
    }

    private async insert(userID: string, guildId: string) {
        const data = { userID, guildId, ...LevellingDefaultData };
        await r.table("levelling").insert(data).run(this.connection);

        return data
    }
}