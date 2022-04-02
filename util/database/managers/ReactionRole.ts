import { r, Connection } from "rethinkdb-ts";
import ReactionRoleData from "../types/ReactionRoleData";

export default class ReactionRoleManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(messageID: string, emoji: string): Promise<ReactionRoleData | null> {
        return (await r.table("reaction-roles").getAll([messageID, emoji], { index: "getAll" }).run(this.connection))[0];
    }

    public async create(options: ReactionRoleData): Promise<boolean> {
        const response = await r.table("reaction-roles").insert(options).run(this.connection);
        return response.inserted === 1;
    }

    public async remove(messageID: string, emoji: string): Promise<boolean> {
        const response = await r.table("reaction-roles").getAll([messageID, emoji], { index: "getAll" }).delete().run(this.connection);
        return response.deleted === 1
    }

    public async getAll(guildId: string): Promise<ReactionRoleData[]> {
        return await r.table("reaction-roles").getAll([guildId], { index: "getGuild" }).run(this.connection);
    }
}