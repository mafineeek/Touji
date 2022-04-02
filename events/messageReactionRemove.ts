import { MessageReaction, TextChannel, User } from "discord.js";
import { Event as BaseEvent } from "../types";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "messageReactionRemove" as const;
    public async run(client: Bot, reaction: MessageReaction, user: User) {
        if (reaction.partial) reaction = await reaction.fetch();

        const guildConfig = await client.database.guildConfig.get(reaction.message.guild!.id);
        const member = await reaction.message.guild!.members.fetch(user)!;
        const rrData = await client.database.reactionroles.get(reaction.message.id, reaction.emoji.name!);

        if (rrData) await member.roles.remove(rrData.roleID).catch(() => false);
        if (reaction.emoji.name !== "⭐" || (!guildConfig.starboardChannelID || !guildConfig.starboardStatus)) return;

        const channel = <TextChannel>await reaction.message.guild!.channels.fetch(guildConfig.starboardChannelID);
        const starboardData = await client.database.starboard.get(reaction.message.id);
        const starboardMessage = await channel.messages.fetch(starboardData?.starboardMessageID).catch(() => null);

        if (reaction.count < starboardData?.starCount && typeof starboardMessage?.edit === "function") await starboardMessage?.edit({
            content: `:star: ${reaction.count}`,
            embeds: starboardMessage.embeds
        })

        if (reaction.count < (guildConfig.starboardStars ?? 1) && starboardMessage?.deletable) {
            await starboardMessage.delete();
            await client.database.starboard.delete(starboardMessage.id);
        }
    }
}