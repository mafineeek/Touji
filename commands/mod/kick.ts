import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "kick";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.kick" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_KICK_USER_DESC"),
        required: true
    }, {
        type: 3,
        name: "reason",
        description: lang.setLanguage("en").get("OPT_KICK_REASON_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || lang.resolveUnknown();

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_KICK_INVALIDUSER"))]
        });
        else if (!user.kickable || !interaction.guild!.me?.permissions.has(["KICK_MEMBERS"])) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_KICK_NOBOTPERMISSIONS"))]
        });
        else if (interaction.member.roles.highest.position <= user.roles.highest.position) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_KICK_NOUSERPERMISSIONS"))]
        });
        else if (reason.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_KICK_REASONTOOLONG"))]
        });

        const caseID = await client.database.case.add({
            type: "kick",
            userID: user.id,
            moderatorID: interaction.user.id,
            guildId: interaction.guild!.id,
            reason: reason
        })

        const dmSent = !!await user.send({
            embeds: [sender.success(lang.get("DATA_COMMANDS_KICK_SUCCESSUSER", [
                { old: "guildName", new: interaction.guild!.name },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.getGlobal("STATIC_REASON"), value: reason },
                { name: lang.getGlobal("STATIC_MODERATOR"), value: interaction.user.tag },
                { name: lang.get("DATA_COMMANDS_KICK_CASEID"), value: `**#${caseID}**` }
            ])]
        }).catch(() => false);

        await user.kick(reason);

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_KICK_SUCCESS", [
                { old: "user", new: user.user.tag },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.get("DATA_COMMANDS_KICK_DMSent"), value: lang.resolveBoolean(dmSent.toString())! },
                { name: lang.get("DATA_COMMANDS_KICK_CASEID"), value: `**#${caseID}**` }
            ])]
        })
    }
}