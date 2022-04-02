import { r, Connection } from "rethinkdb-ts";
import CaseData from "../types/Case";

export default class CaseManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(id: string): Promise<CaseData | null> {
        return (await r.table("punishments").getAll([id], { index: "getID" }).run(this.connection))[0] as CaseData;
    }

    public async getAll(userID: string): Promise<CaseData[]> {
        return await r.table("punishments").getAll([userID], { index: "getUser" }).coerceTo("array").run(this.connection);
    }

    public async getAllGuild(guildId: string): Promise<CaseData[]> {
        return await r.table("punishments").getAll([guildId], { index: "getGuild" }).coerceTo("array").run(this.connection);
    }

    public async add(options: CaseData): Promise<string> {
        const id = await this.id(options.guildId);

        await r.table("punishments").insert({ caseID: id, ...options }).run(this.connection);

        return id;
    }

    public async remove(id: string): Promise<boolean> {
        await r.table("punishments").getAll([id], { index: "getID" }).update({deleted: true}).run(this.connection);
        return true;
    }

    public async setReason(id: string, reason: string): Promise<boolean> {
        const response = await r.table("punishments").getAll([id], { index: "getID" }).update({ reason: reason }).run(this.connection);
        return response.replaced === 1
    }

    private async id(guildId: string) {
        return ((await this.getAllGuild(guildId)).length + 1).toString()
    }
}