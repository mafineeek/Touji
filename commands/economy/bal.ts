import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "bal";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.balance" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_BALANCE_USER_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user") || interaction.user;

        if (user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BALANCE_BOT"))]
        });

        const userData = await client.database.economy.getUser(user.id, interaction.guildId!);

        await interaction.followUp({
            embeds: [sender.success().addFields([
                { name: lang.get("DATA_COMMANDS_BALANCE_CASH"), value: `${userData.cash}$` },
                { name: lang.get("DATA_COMMANDS_BALANCE_BANK"), value: `${userData.bank}$` },
                { name: lang.get("DATA_COMMANDS_BALANCE_TOTAL"), value: `${userData.cash + userData.bank}$` }
            ])]
        });
    }
}