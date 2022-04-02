import { MessageReaction, TextChannel, User, Util } from "discord.js";
import { Event as BaseEvent } from "../types";
import Sender from "../util/custom/Sender";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "messageReactionAdd" as const;
    public async run(client: Bot, reaction: MessageReaction, user: User) {
        if (reaction.partial) reaction = await reaction.fetch();

        const guildConfig = await client.database.guildConfig.get(reaction.message.guild!.id);
        const member = await reaction.message.guild!.members.fetch(user)!;
        const rrData = await client.database.reactionroles.get(reaction.message.id, reaction.emoji.name!);

        if (rrData) await member.roles.add(rrData.roleID).catch(() => false);

        if (reaction.emoji.name !== "⭐" || (!guildConfig.starboardChannelID || !guildConfig.starboardStatus) || reaction.message.author?.bot) return;
        if (guildConfig.starboardBannedUsers?.includes(user.id)) return await reaction.users.remove(user);

        const channel = <TextChannel>await reaction.message.guild!.channels.fetch(guildConfig.starboardChannelID);
        const starboardData = await client.database.starboard.get(reaction.message.id);
        const starboardMessage = await channel.messages.fetch(starboardData?.starboardMessageID).catch(() => null);

        if (reaction.count > starboardData?.starCount && typeof starboardMessage?.edit === "function") await starboardMessage?.edit({
            content: `:star: ${reaction.count}`,
            embeds: starboardMessage.embeds
        })

        if (reaction.count >= (guildConfig.starboardStars ?? 1)) {
            const message = typeof starboardMessage?.edit === "function" ? await starboardMessage.edit({
                content: `:star: ${reaction.count}`,
                embeds: [new Sender(reaction.message.channel!, guildConfig.language!).success(
                    Util.escapeMarkdown(reaction.message.content!) || "N/A"
                ).addField("Link", reaction.message.url)]
            }) : await channel.send({
                content: `:star: ${reaction.count}`,
                embeds: [new Sender(reaction.message.channel!, guildConfig.language!).success(
                    Util.escapeMarkdown(reaction.message.content!) || "N/A"
                ).addField("Link", reaction.message.url)]
            });

            await client.database.starboard.addOrUpdate({
                messageID: reaction.message.id,
                starboardMessageID: message.id,
                guildId: message.guild!.id,
                userID: reaction.message.author?.id!,
                starCount: reaction.count
            })
        }
    }
}