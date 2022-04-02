import { r, Connection } from "rethinkdb-ts";

export interface CooldownData {
    userID: string,
    commandName: string,
    endAt: number
}
export default class CooldownManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(userID: string, commandName: string): Promise<CooldownData> {
        return (await r.table("cooldowns").getAll([userID, commandName], { index: "get" }).coerceTo("array").run(this.connection))[0]
    }

    public async set(data: CooldownData): Promise<boolean> {
        const response = await r.table("cooldowns").insert(data).run(this.connection);
        return response.inserted === 1
    }

    public async delete(userID: string, commandName: string): Promise<boolean> {
        const response = await r.table("cooldowns").getAll([userID, commandName], { index: "get" }).delete().run(this.connection);
        return response.deleted === 1;
    }
}