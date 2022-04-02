import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "remove-money";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.removemoney" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_REMOVEMONEY_USER_DESC"),
        required: true
    }, {
        type: 10,
        name: "money",
        description: lang.setLanguage("en").get("OPT_REMOVEMONEY_MONEY_DESC"),
        required: true
    }, {
        type: 3,
        name: "type",
        description: lang.setLanguage("en").get("OPT_REMOVEMONEY_TYPE_DESC"),
        choices: [
            { name: "cash", value: "cash" },
            { name: "bank", value: "bank" }
        ],
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const user = interaction.options.getUser("user")!;
        const money = interaction.options.getNumber("money")!;
        const type = interaction.options.getString("type")!;

        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const userData = await client.database.economy.getUser(user.id, interaction.guildId!);

        if (isFloat(money) || money < 1 || money > 1000000) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_REMOVEMONEY_INVALIDAMOUNT"))]
        });

        await client.database.economy.set(
            user.id,
            interaction.guildId!,
            type === "cash" ? { cash: userData.cash - money } : { bank: userData.bank - money }
        )
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_REMOVEMONEY_SUCCESS", [
                { old: "user", new: user.toString() },
                { old: "money", new: money }
            ]))]
        })
    }
}