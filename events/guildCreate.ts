import { Guild } from "discord.js";
import { Command, Event as BaseEvent } from "../types";
import { readdirSync } from "fs";
import { resolve } from "path";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "guildCreate" as const;
    public async run(client: Bot, guild: Guild) {
        const guildConfig = await client.database.guildConfig.get(guild.id);
    }
}