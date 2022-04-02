import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";
import CaseData from "../../util/database/types/Case";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "history";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.history" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_HISTORY_USER_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user") || interaction.user;

        if (user !== interaction.user && interaction.member.permissionLevel! < 3) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_HISTORY_CANTSEEOTHER"))]
        });

        const allCases = await client.database.case.getAll(user.id);

        lang.setLanguage(guildConfig.language!);

        if (!allCases.length) return await interaction.followUp({
            embeds: [sender.error(lang.get(`DATA_COMMANDS_HISTORY_NOCASES_${user === interaction.user ? "ME" : "USER"}`))]
        });

        const embeds = [];
        for (const part of allCases.chunk(3)) {
            embeds.push(sender.success().addFields(part.map((data: CaseData) => {
                return {
                    name: `#${data.caseID}`,
                    value: data.reason!
                }
            })))
        }

        await Paginator(interaction, embeds)
    }
}