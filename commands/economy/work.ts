import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "work";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.work" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public readonly cooldown = 3600;
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const answers = lang.get("DATA_COMMANDS_WORK_MESSAGES");
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);

        const moneyAmount = Math.randomInteger(100, 500);
        await client.database.economy.set(
            interaction.user.id,
            interaction.guildId!,
            { cash: userData.cash + moneyAmount }
        )
        await interaction.followUp({
            embeds: [sender.success(answers.randomValue().replace(
                "{{amount}}", moneyAmount
            ))]
        })
    }
}