import { r, Connection } from "rethinkdb-ts";
import AutoMessage from "../types/AutoMessageData";

export default class AutoMessagesManager {
    public constructor(
        private connection: Connection
    ) {}

    private async getAll(guildId: string): Promise<AutoMessage[]> {
        return await r.table("automessages").between(
            [1, guildId], [Date.now(), guildId], { index: "getAll" }
        ).run(this.connection);
    }

    public async create(options: AutoMessage): Promise<string> {
        const id = await this.id(options.guildId);

        await r.table("automessages").insert({ id: id, ...options }).run(this.connection);

        return id;
    }

    public async remove(id: string): Promise<boolean> {
        const response = await r.table("automessages").get(id).delete().run(this.connection);
        return response.deleted === 1
    }

    private async id(guildId: string) {
        return ((await this.getAll(guildId)).length + 1).toString()
    }
}