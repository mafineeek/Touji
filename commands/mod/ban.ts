import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import ms from "ms";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "ban";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.mod.ban" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_BAN_USER_DESC"),
        required: true
    }, {
        type: 3,
        name: "time",
        description: lang.setLanguage("en").get("OPT_BAN_TIME_DESC")
    }, {
        type: 3,
        name: "reason",
        description: lang.setLanguage("en").get("OPT_BAN_REASON_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user");
        const guildMember = interaction.options.getMember("user");
        const time = interaction.options.getString("time");
        const reason = interaction.options.getString("reason") || lang.resolveUnknown();

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_INVALIDUSER"))]
        });
        else if (guildMember && !guildMember?.bannable || !interaction.guild!.me?.permissions.has(["BAN_MEMBERS"])) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_NOBOTPERMISSIONS"))]
        });
        else if ((await interaction.guild!.bans.fetch()).some((ban) => ban.user.id === user.id)) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_ALREADYBANNED"))]
        });
        else if (guildMember && (interaction.member.roles.highest.position <= guildMember.roles.highest.position)) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_NOUSERPERMISSIONS"))]
        });
        else if (reason.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_REASONTOOLONG"))]
        });
        else if (time && !ms(time)) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BAN_INVALIDTIME"))]
        });

        const caseID = await client.database.case.add({
            type: "ban",
            userID: user.id,
            moderatorID: interaction.user.id,
            guildId: interaction.guild!.id,
            expireAt: time ? Date.now() + ms(time) : 0,
            reason: reason
        });

        const dmSent = !!await user.send({
            embeds: [sender.success(lang.get("DATA_COMMANDS_BAN_SUCCESSUSER", [
                { old: "guildName", new: interaction.guild!.name },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.getGlobal("STATIC_REASON"), value: reason },
                { name: lang.getGlobal("STATIC_MODERATOR"), value: interaction.user.tag },
                { name: lang.get("DATA_COMMANDS_BAN_CASEID"), value: `**#${caseID}**` },
                { name: lang.get("DATA_COMMANDS_BAN_TIME"), value: time ? `<t:${(Date.now() / 1000 + ms(time) / 1000).toFixed()}:F>` : lang.resolveUnknown() }
            ])]
        }).catch(() => false);

        await interaction.guild!.members.ban(user, { reason: reason }).catch(() => false);

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_BAN_SUCCESS", [
                { old: "user", new: user.tag },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.get("DATA_COMMANDS_BAN_DMSent"), value: lang.resolveBoolean(dmSent.toString())! },
                { name: lang.get("DATA_COMMANDS_BAN_CASEID"), value: `**#${caseID}**` },
                { name: lang.get("DATA_COMMANDS_BAN_TIME"), value: time ? `<t:${(Date.now() / 1000 + ms(time) / 1000).toFixed()}:F>` : lang.resolveUnknown() }
            ])]
        })
    }
}