import { r, Connection } from "rethinkdb-ts";
import StarboardData from "../types/StarboardData";

export default class StarboardManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(messageID: string): Promise<StarboardData> {
        return (await r.table("starboard").getAll([messageID], { index: "getMessage" }).run(this.connection))[0];
    }

    public async getBest(userID: string): Promise<StarboardData> {
        return (await r.table("starboard").getAll([userID], { index: "getUser" }).orderBy("starCount").run(this.connection))[0];
    }

    public async isBanned(guildId: string, userID: string): Promise<boolean> {
        const response = await r.table("guildConfig").get(guildId).run(this.connection);
        return response.starboardBannedUsers?.includes(userID)
    }

    public async ban(guildId: string, userID: string): Promise<boolean> {
        const response = await r.table("guildConfig").get(guildId).update({
            starboardBannedUsers: r.row("starboardBannedUsers").append(userID)
        }).run(this.connection);
        return response.replaced === 1
    }

    public async unban(guildId: string, userID: string): Promise<boolean> {
        const response = await r.table("guildConfig").get(guildId).update({
            starboardBannedUsers: r.row("starboardBannedUsers").setDifference([userID])
        }).run(this.connection);
        return response.replaced === 1
    }

    public async add(data: StarboardData): Promise<boolean> {
        const response = await r.table("starboard").insert(data).run(this.connection);
        return response.inserted === 1
    }

    public async addOrUpdate(data: StarboardData): Promise<boolean> {
        const response = await this.get(data.messageID)
            ? await r.table("starboard").getAll([data.messageID], { index: "getMessage" }).update(data).run(this.connection)
            : await r.table("starboard").insert(data).run(this.connection)
        return response.inserted === 1 || response.replaced === 1
    }

    public async delete(messageID: string): Promise<boolean> {
        const response = await r.table("starboard").getAll([messageID], { index: "getMessage" }).delete().run(this.connection);
        return response.deleted === 1;
    }
}