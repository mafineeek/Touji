import { r, Connection } from "rethinkdb-ts";
import BirthdayData from "../types/Birthday";

export default class BirthdaysManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(userID: string): Promise<BirthdayData | null> {
        return (await r.table("birthdays").getAll([userID], { index: "getUser" }).coerceTo("array").run(this.connection))[0] as BirthdayData;
    }

    public async getAll(): Promise<BirthdayData[]> {
        return await r.table("birthdays").run(this.connection);
    }

    public async next(): Promise<BirthdayData[]> {
        return await r.table("birthdays").filter({ month: (new Date().getMonth() + 1).toString() }).run(this.connection);
    }

    public async today(): Promise<BirthdayData[]> {
        return await r.table("birthdays").getAll([new Date().getDate().toString(), (new Date().getMonth() + 1).toString()], { index: "getAll" }).run(this.connection);
    }

    public async delivered(userID: string, year: string): Promise<boolean> {
        const response = await r.table("birthdays").getAll([userID], { index: "getUser" }).update({
            delivered: year
        }).run(this.connection);
        return response.inserted === 1
    }

    public async insert(data: BirthdayData): Promise<boolean> {
        const response = await r.table("birthdays").insert(data).run(this.connection);
        return response.inserted === 1
    }

    public async remove(userID: string): Promise<boolean> {
        const response = await r.table("birthdays").getAll([userID], { index: "getUser" }).delete().run(this.connection);
        return response.deleted === 1
    }
}