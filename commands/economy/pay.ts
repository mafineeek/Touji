import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "pay";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.pay" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_PAY_USER_DESC"),
        required: true
    }, {
        type: 3,
        name: "amount",
        description: lang.setLanguage("en").get("OPT_PAY_AMOUNT_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public readonly cooldown = 15;
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const user = interaction.options.getMember("user");
        const amount = interaction.options.getString("amount")!;

        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);

        if (!user || user.user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_PAY_INVALIDUSER"))]
        });

        if (user === interaction.member) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_PAY_THESAMEUSER"))]
        });

        const providedUserData = await client.database.economy.getUser(user.id, interaction.guildId!);
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);

        if (amount !== "all" && (userData.bank < parseInt(amount) || parseInt(amount) < 0 || isFloat(parseInt(amount)))) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_PAY_INVALIDAMOUNT"))]
        });

        await client.database.economy.set(interaction.user.id, interaction.guildId!, { bank: amount === "all" ? 0 : userData.bank + userData.cash - parseInt(amount) })
        await client.database.economy.set(user.id, interaction.guildId!, { cash: providedUserData.cash + parseInt(amount) })
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_PAY_SUCCESS", [
                { old: "user", new: user.toString() },
                { old: "amount", new: amount === "all" ? userData.bank : amount }
            ]))]
        })
    }
}