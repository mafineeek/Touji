import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "clear-inventory";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.clearinventory" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_CLEARINVENTORY_USER_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 600;
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_CLEARINVENTORY_INVALIDMEMBER"))]
        })

        await client.database.economy.clearInventory(user.id, interaction.guildId!);
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_CLEARINVENTORY_SUCCESS"))]
        })
    }
}