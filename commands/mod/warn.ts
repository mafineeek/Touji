import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "warn";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.warn" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_WARN_USER_DESC"),
        required: true
    }, {
        type: 3,
        name: "reason",
        description: lang.setLanguage("en").get("OPT_WARN_REASON_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || lang.resolveUnknown();

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_WARN_INVALIDUSER"))]
        });
        if (user === interaction.member) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_WARN_YOURSELF"))]
        });
        else if (user.roles.highest.position >= interaction.member.roles.highest.position) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_WARN_NOUSERPERMISSIONS"))]
        });
        else if (reason.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_WARN_REASONTOOLONG"))]
        });

        const caseID = await client.database.case.add({
            type: "warn",
            userID: user.id,
            moderatorID: interaction.user.id,
            guildId: interaction.guild!.id,
            reason: reason
        })

        const dmSent = !!await user.send({
            embeds: [sender.success(lang.get("DATA_COMMANDS_WARN_SUCCESSUSER", [
                { old: "guildName", new: interaction.guild!.name },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.getGlobal("STATIC_REASON"), value: reason },
                { name: lang.getGlobal("STATIC_MODERATOR"), value: interaction.user.tag },
                { name: lang.get("DATA_COMMANDS_WARN_CASEID"), value: `**#${caseID}**` }
            ])]
        }).catch(() => false)

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_WARN_SUCCESS", [
                { old: "user", new: user.user.tag },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.get("DATA_COMMANDS_WARN_DMSent"), value: lang.resolveBoolean(dmSent.toString())! },
                { name: lang.get("DATA_COMMANDS_WARN_CASEID"), value: `**#${caseID}**` }
            ])]
        })
    }
}