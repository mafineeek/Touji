import { Message } from "discord.js";
import { Event as BaseEvent } from "../types";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "messageUpdate" as const;
    public async run(client: Bot, oldMessage: Message, newMessage: Message) {
        if (!newMessage.guild || newMessage.author?.bot || oldMessage.content === newMessage.content) return;

        const guildConfig = await client.database.guildConfig.get(newMessage.guild.id);
        if (!guildConfig.snipeEnabled) return;
        await client.database.snipe.insert({
            type: "edited",
            userID: newMessage.author?.id,
            channelId: newMessage.channel.id,
            guildId: newMessage.guild.id,
            oldContent: oldMessage.content,
            content: newMessage.content,
            createdAt: newMessage.createdTimestamp
        })
    }
}