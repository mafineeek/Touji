import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "deposit";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.deposit" ];
    public readonly options = [{
        type: 3,
        name: "amount",
        description: lang.setLanguage("en").get("OPT_DEPOSIT_AMOUNT_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const amount = interaction.options.getString("amount")!;

        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);

        if (amount === "all" ? userData.cash < 1 : (userData.cash < parseInt(amount) || parseInt(amount) < 0 || isFloat(parseInt(amount)))) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_DEPOSIT_INVALIDAMOUNT"))]
        });

        await client.database.economy.set(
            interaction.user.id,
            interaction.guildId!,
            { cash: amount === "all" ? 0 : userData.cash - parseInt(amount), bank: amount === "all" ? userData.bank + userData.cash : userData.bank + parseInt(amount) }
        )
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_DEPOSIT_SUCCESS", [
                { old: "money", new: amount === "all" ? userData.cash : amount }
            ]))]
        })
    }
}