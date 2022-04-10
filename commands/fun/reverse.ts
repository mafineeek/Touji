import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "reverse";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.reverse" ];
    public readonly options = [{
        type: 3,
        name: "text",
        description: lang.setLanguage("en").get("OPT_REVERSE_TEXT_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const text = Util.escapeMarkdown(interaction.options.getString("text")!);
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);

        if (text.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_REVERSE_TOOLONG"))]
        })

        await interaction.followUp({
            embeds: [sender.success(text.split("").reverse().join("").markdown())]
        });
    }
}