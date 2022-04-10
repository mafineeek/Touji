import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "economy-leaderboard";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.economyleaderboard" ];
    public readonly options = [{
        type: 3,
        name: "mode",
        description: lang.setLanguage("en").get("OPT_ECONOMYLEADERBOARD_MODE_DESC"),
        choices: [
            { name: lang.setLanguage("en").get("DATA_COMMANDS_ECONOMYLEADERBOARD_MODE_BYWALLET"), value: "cash" },
            { name: lang.setLanguage("en").get("DATA_COMMANDS_ECONOMYLEADERBOARD_MODE_BYBANK"), value: "bank" }
        ],
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const leaderboard = await client.database.economy.makeLeaderboard(interaction.guildId!, interaction.options.getString("mode")!);

        if (!leaderboard.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ECONOMYLEADERBOARD_NOLEADERBOARD"))]
        });

        const embeds = [];
        const formatted = leaderboard.chunk(10);

        let i = 0;

        for (const part of formatted) {
            const embed = sender.success("")
            for (const { userID } of part) {
                i++;
                embed.description += `**#${i}.** \`${(await client.users.fetch(userID))?.tag || lang.resolveUnknown()}\`\n`;
            }
            embeds.push(embed);
        }

        await Paginator(interaction, embeds);
    }
}