import { GuildMember, TextChannel } from "discord.js";
import { Event as BaseEvent } from "../types";
import Sender from "../util/custom/Sender";
import Bot from "../util/Bot";

export default class Event implements BaseEvent {
    public readonly name = "guildMemberAdd" as const;
    public async run(client: Bot, member: GuildMember) {
        if (member.user.bot) return;

        const guildConfig = await client.database.guildConfig.get(member.guild.id);
        for (const roleId of guildConfig.joinRoleIds) {
            await member.roles.add(roleId).catch(() => false)
        }

        if (!guildConfig.welcomeChannelID || !guildConfig.welcomeStatus || !guildConfig.welcomeMessage) return;

        const channel = <TextChannel>member.guild.channels.cache.get(guildConfig.welcomeChannelID);
        if (!channel) return;

        await channel.send({
            embeds: [new Sender(channel, guildConfig.language!).success(guildConfig.welcomeMessage.replaceMany([
                "{{user}}",
                "{{user:id}}",
                "{{user:name}}",
                "{{user:tag}}",
                "{{guild:id}}",
                "{{guild:name}}",
                "{{guild:ownerID}}"
            ], [
                member.toString(),
                member.id,
                member.user.username,
                member.user.tag,
                member.guild.id,
                member.guild.name,
                member.guild.ownerId
            ]))]
        })
    }
}