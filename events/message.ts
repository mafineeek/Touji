import { GuildChannel, Message, TextChannel } from "discord.js";
import { Event as BaseEvent } from "../types";
import { LevelReward } from "../util/database/types/LevellingData";
import Sender from "../util/custom/Sender";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "messageCreate" as const;
    public async run(client: Bot, message: Message) {
        if (message.channel.type === "DM") {
            const channel = <TextChannel>await client.channels.fetch("881856549780344872").catch(() => null);
            if (channel) await channel.send({
                content: message.cleanContent.markdown()
            })
        }

        if (!message.guild || message.author.bot) return;

        const guildConfig = await client.database.guildConfig.get(message.guild.id);
        const sender = new Sender(message.channel, guildConfig.language!);
        const lang = new LanguageHandler(guildConfig.language!);

        if (guildConfig.suggestionChannelID === message.channel.id) {
            if (message.deletable) await message.delete();

            const webhook = await (<TextChannel>message.channel).createWebhook(
                `${message.author.tag} (${message.author.id})`,
                {
                    avatar: message.author.displayAvatarURL({ dynamic: true, format: "png" }),
                    reason: "New suggestion"
                }
            ).catch(() => null);

            if (!webhook) return await message.author.send({
                embeds: [sender.error(lang.getGlobal("SUGGESTIONS_FAILED"))]
            }).catch(() => false);

            const suggestionMessage = <Message>await webhook?.send({
                content: message.cleanContent
            });

            await webhook?.delete();
            await suggestionMessage?.react("959176562547253278");
            await suggestionMessage?.react("959176501943730216");

            const thread = await (<TextChannel>message.channel).threads.create({
                name: "Comments",
                autoArchiveDuration: 60,
                startMessage: suggestionMessage
            }).catch(() => null);

            if (thread) {
                thread.members.add(message.author);
                await thread.setRateLimitPerUser(5).catch(() => false)
                thread.send(lang.get('COMMANDS_CONFIG_SUGGESTIONSTHREADCREATE'));
            }
        }

        if (guildConfig.levellingEnabled && message.channel.id !== guildConfig.suggestionChannelID) {
            await client.database.levelling.giveXp(message.author.id, message.guild.id);

            const userData = await client.database.levelling.getUser(message.author.id, message.guild.id);
            if (userData.xp >= (guildConfig.levelNeededXP ?? 200)) {
                const channel = <TextChannel>(
                  await client.channels
                    .fetch(guildConfig.levelChannelID!)
                    .catch(() =>
                      (message.channel as unknown as TextChannel).fetch()
                    )
                );
                const roleRewards = await client.database.levelling.getRoleRewards(message.guildId!);
                const reward = roleRewards.find((r: LevelReward) => r.level === (userData.level + 1));

                const embed = sender.success((guildConfig.levelUpdateMessage || lang.getGlobal("LEVELLING_MESSAGE")).replaceMany([
                    "{{user}}",
                    "{{user:id}}",
                    "{{user:name}}",
                    "{{user:tag}}",
                    "{{guild:id}}",
                    "{{guild:name}}",
                    "{{guild:ownerID}}",
                    "{{level}}"
                ], [
                    message.author.toString(),
                    message.author.id,
                    message.author.username,
                    message.author.tag,
                    message.guild.id,
                    message.guild.name,
                    message.guild.ownerId,
                    await client.database.levelling.addLevel(message.author.id, message.guild.id, 1)
                ]), { text: "Level up" });

                if (reward) {
                    await message.member!.roles.add(reward.id).catch(() => false);
                    embed.description += `\n${lang.getGlobal("LEVELLING_RECEIVEDROLE", [
                        { old: "role", new: message.guild!.roles.cache.get(reward.id)?.toString() || lang.resolveUnknown() }
                    ])}`
                }
                await channel.send({
                    embeds: [embed]
                });
            }
        }

        if (message.content.match(new RegExp(`^<@!?${client.user!.id}>( |)$`, "g"))) {
            return await message.reply({
                embeds: [sender.success(lang.get("DATA_ADDONS_MENTIONREPLYTEXT"), { text: "Mention" })],
                allowedMentions: { parse: [], repliedUser: false }
            })
        }
    }
}