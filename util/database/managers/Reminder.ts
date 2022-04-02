import { r, Connection } from "rethinkdb-ts";
import ReminderData from "../types/ReminderData";

export default class ReminderManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(id: string): Promise<ReminderData | null> {
        return await r.table("reminders").get(id).run(this.connection) as ReminderData;
    }

    public async getAll(userID: string): Promise<ReminderData[]> {
        return await r.table("reminders").getAll([userID], { index: "getUser" }).coerceTo("array").run(this.connection);
    }

    public async create(options: ReminderData): Promise<string> {
        const id = await this.id(options.userID);

        await r.table("reminders").insert({ id: id, ...options }).run(this.connection);

        return id;
    }

    public async remove(id: string): Promise<boolean> {
        const response = await r.table("reminders").get(id).delete().run(this.connection);
        return response.deleted === 1
    }

    private async id(userID: string) {
        return ((await this.getAll(userID)).length + 1).toString()
    }
}