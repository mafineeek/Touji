import { r, Connection } from "rethinkdb-ts";
import ShopItemData from "../types/ShopItemData";

export interface EconomyData {
    id?: string,
    userID: string,
    guildId: string,
    cash: number,
    bank: number
}
export const EconomyDefaults = { cash: 0, bank: 0 };
export default class EconomyManager {
    public constructor(
        private connection: Connection
    ) {}

    public async getUser(userID: string, guildId: string): Promise<EconomyData> {
        return (await r.table("economy").getAll([userID, guildId], { index: "get" }).coerceTo("array").run(this.connection))[0] || await this.insert({
            userID: userID,
            guildId: guildId,
            cash: 0,
            bank: 0
        });
    }

    public async set(userID: string, guildId: string, data: Partial<typeof EconomyDefaults>): Promise<boolean> {
        const response = await r.table("economy").getAll([userID, guildId], { index: "get" }).update(data).run(this.connection);
        return response.replaced < 2
    }

    public async createItem(data: ShopItemData): Promise<string> {
        const id = await this.id(data.guildId);

        await r.table("shops").insert({ itemID: id, ...data }).run(this.connection);
        return id;
    }

    public async updateItem(id: string, guildId: string, toUpdate: Partial<EconomyData>): Promise<boolean> {
        const response = await r.table("shops").getAll([id], { index: "getItem" }).update(toUpdate).run(this.connection);
        return response.replaced === 1
    }

    public async getUserInventory(userId: string, guildId: string): Promise<ShopItemData[]> {
        return await r.table("inventories").getAll([userId, guildId], { index: "get" }).run(this.connection);
    }

    public async makeLeaderboard(guildId: string, mode: string): Promise<EconomyData[]> {
        const response = await r.table("economy").getAll([guildId], { index: "getGuild" }).orderBy(mode).run(this.connection);
        return response.reverse()
    }

    public async getItems(guildId: string): Promise<ShopItemData[]> {
        return await r.table("shops").getAll([guildId], { index: "getGuild" }).run(this.connection);
    }

    public async getItemById(guildId: string, id: string): Promise<ShopItemData> {
        return (await r.table("shops").getAll([guildId, id], { index: "getGuildId" }).run(this.connection))[0];
    }

    public async clearInventory(userId: string, guildId: string): Promise<void> {
        await r.table("inventories").getAll([userId, guildId], { index: "get" }).delete().run(this.connection);
    }

    public async addItemToInventory(userId: string, itemData: ShopItemData): Promise<boolean> {
        const response = await r.table("inventories").insert(itemData).run(this.connection);
        return response.inserted === 1
    }

    public async deleteById(guildId: string, id: string): Promise<boolean> {
        const response = await r.table("shops").getAll([guildId, id], { index: "getGuildId" }).delete().run(this.connection);
        return response.deleted === 1
    }

    private async insert(data: EconomyData): Promise<typeof EconomyDefaults> {
        await r.table("economy").insert(data).run(this.connection).catch(() => false);
        return EconomyDefaults;
    }

    private async id(guildId: string): Promise<string> {
        return ((await this.getItems(guildId)).length + 1).toString()
    }
}