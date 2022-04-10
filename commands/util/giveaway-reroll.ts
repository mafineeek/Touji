import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "giveaway-reroll";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.giveaway.reroll" ];
    public readonly options = [
        {
            type: 3,
            name: "message_id",
            description: lang.setLanguage("en").get("OPT_GREROLL_MESSAGEID_DESC"),
            required: true
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const giveaway = await client.database.giveaways.get(interaction.options.getString("message_id")!);

        if (!giveaway || !giveaway.ended) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_GREROLL_INVALIDGIVEAWAY"))]
        })

        await client.database.giveaways.reroll(giveaway);
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_GREROLL_SUCCESS"))]
        })
    }
}