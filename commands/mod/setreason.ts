import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "setreason";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.mod.setreason" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_SETREASON_ID_DESC"),
        required: true
    }, {
        type: 3,
        name: "reason",
        description: lang.setLanguage("en").get("OPT_SETREASON_REASON_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const caseID = interaction.options.getNumber("id")?.toString();
        const caseData = await client.database.case.get(caseID!)
        const reason = require("discord.js").Util.escapeMarkdown(interaction.options.getString("reason") || "No reason provided");

        lang.setLanguage(guildConfig.language!);

        if (!caseData) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETREASON_INVALID"))]
        });
        else if (reason.length > 100) await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETREASON_TOOBIG"))]
        });

        await client.database.case.setReason(caseID!, reason);

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_SETREASON_CHANGED", [ { old: "case", new: caseID }, { old: "reason", new: reason } ]))]
        })
    }
}