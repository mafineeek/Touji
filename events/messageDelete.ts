import { Message } from "discord.js";
import { Event as BaseEvent } from "../types";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "messageDelete" as const;
    public async run(client: Bot, message: Message) {
        if (!message.guild || message.author?.bot) return;

        const guildConfig = await client.database.guildConfig.get(message.guild.id);
        if (!guildConfig.snipeEnabled) return;
        await client.database.snipe.insert({
            type: "deleted",
            userID: message.author?.id,
            channelId: message.channel.id,
            guildId: message.guild.id,
            content: message.content,
            createdAt: message.createdTimestamp
        })
    }
}