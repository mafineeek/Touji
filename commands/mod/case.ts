import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "case";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.case" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_CASE_ID_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const caseData = await client.database.case.get(interaction.options.getNumber("id")?.toString()!)

        lang.setLanguage(guildConfig.language!);

        if (!caseData) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_CASE_INVALID"))]
        });

        await interaction.followUp({
            embeds: [sender.success().addFields([
                { name: lang.getGlobal("STATIC_ID"), value: caseData.caseID?.toString() || lang.resolveUnknown() },
                { name: lang.getGlobal("STATIC_TYPE"), value: caseData.type.toLowerCase().capitalize() },
                { name: lang.get("DATA_COMMANDS_CASE_USER"), value: (await client.users.fetch(caseData.userID))?.tag || lang.resolveUnknown() },
                { name: lang.get("DATA_COMMANDS_CASE_MODERATOR"), value: (await client.users.fetch(caseData.moderatorID))?.tag || lang.resolveUnknown() },
                { name: lang.getGlobal("STATIC_REASON"), value: `\`${require("discord.js").Util.escapeMarkdown(caseData.reason || "No reason provided")}\`` }
            ]).setTitle(caseData.deleted ? '**DELETED**' : 'Case')
        ]
        })
    }
}