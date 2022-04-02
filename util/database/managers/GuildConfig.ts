import { r, Connection } from "rethinkdb-ts";
import GuildConfig from "../types/GuildConfig";
import Config from "../../../data/Config";

export type GuildConfigParameterType = string | number | boolean | (string | number | boolean)[]
export type UnknownType<K extends string | number, V = GuildConfigParameterType> = { [key in K]?: V }
export default class GuildConfigManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(guildId: string): Promise<GuildConfig> {
        const response = await r.table("guildConfig").get(guildId).run(this.connection);

        return response ? response as GuildConfig : await this.insert(guildId, Config.DEFAULTS)
    }

    public async set(guildId: string, toChange: UnknownType<keyof GuildConfig, any>): Promise<boolean> {
        const response = await r.table("guildConfig").get(guildId).update(toChange).run(this.connection);
        return response.replaced === 1
    }

    private async insert(guildId: string, properties: any): Promise<GuildConfig> {
        await r.table("guildConfig").insert({ id: guildId, ...properties }).run(this.connection);
        return properties;
    }
}