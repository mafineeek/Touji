import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "unban";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.unban" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_UNBAN_USER_DESC"),
        required: true
    }, {
        type: 3,
        name: "reason",
        description: lang.setLanguage("en").get("OPT_UNBAN_REASON_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || lang.resolveUnknown();

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_UNBAN_INVALIDUSER"))]
        });
        else if (!(await interaction.guild!.bans.fetch()).some((ban) => ban.user.id === user.id)) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_UNBAN_ALREADYUNBANNED"))]
        });
        else if (reason.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_UNBAN_REASONTOOLONG"))]
        });

        const status = await interaction.guild!.members.unban(user, reason).catch(() => false);
        const caseID = await client.database.case.add({
            type: "unban",
            userID: user.id,
            moderatorID: interaction.user.id,
            guildId: interaction.guild!.id,
            expireAt: 0,
            reason: reason
        })

        const dmSent = !!await user.send({
            embeds: [sender.success(lang.get("DATA_COMMANDS_UNBAN_SUCCESSUSER", [
                { old: "guildName", new: interaction.guild!.name },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.getGlobal("STATIC_REASON"), value: reason },
                { name: lang.getGlobal("STATIC_MODERATOR"), value: interaction.user.tag },
                { name: lang.get("DATA_COMMANDS_UNBAN_CASEID"), value: `**#${caseID}**` }
            ])]
        }).catch(() => false)

        await interaction.followUp({
            embeds: [status ? sender.success(lang.get("DATA_COMMANDS_UNBAN_SUCCESS", [
                { old: "user", new: user.tag },
                { old: "reason", new: reason }
            ])).addFields([
                { name: lang.get("DATA_COMMANDS_UNBAN_DMSent"), value: lang.resolveBoolean(dmSent.toString())! },
                { name: lang.get("DATA_COMMANDS_UNBAN_CASEID"), value: `**#${caseID}**` }
            ]) : sender.error(lang.get("DATA_COMMANDS_UNBAN_FAILED"))]
        })
    }
}