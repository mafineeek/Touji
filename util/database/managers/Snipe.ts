import { r, Connection } from "rethinkdb-ts";
import SnipeData, { SnipeAction } from "../types/SnipeData";

export default class SnipeManager {
    public constructor(
        private connection: Connection
    ) {}

    public async getUser(userID: string, type: SnipeAction): Promise<SnipeData[]> {
        return await r.table("snipe").getAll([userID, type], { index: "getUser" }).orderBy("createdAt").run(this.connection);
    }

    public async getAll(guildId: string, type: SnipeAction): Promise<SnipeData[]> {
        const result = await r.table("snipe").getAll([guildId, type], { index: "getGuild" }).orderBy("createdAt").run(this.connection);
        return result.reverse()
    }

    public async getChannel(channelID: string, type: SnipeAction): Promise<SnipeData[]> {
        const result = await r.table("snipe").getAll([channelID, type], { index: "getChannel" }).orderBy("createdAt").run(this.connection);
        return result.reverse()
    }

    public async getUserAndChannel(userID: string, channelID: string, type: SnipeAction): Promise<SnipeData[]> {
        const result = await r.table("snipe").getAll([userID, channelID, type], { index: "getUserAndChannel" }).orderBy("createdAt").run(this.connection);
        return result.reverse()
    }

    public async insert(data: SnipeData): Promise<boolean> {
        const response = await r.table("snipe").insert(data).run(this.connection);
        return response.inserted === 1
    }

    public async deleteUser(userID: string, type: SnipeAction): Promise<boolean> {
        const response = await r.table("snipe").getAll([userID, type], { index: "getUser" }).delete().run(this.connection);
        return response.deleted === 1;
    }

    public async deleteChannel(channelID: string, type: SnipeAction): Promise<boolean> {
        const response = await r.table("snipe").getAll([channelID, type], { index: "getChannel" }).delete().run(this.connection);
        return response.deleted === 1;
    }
}