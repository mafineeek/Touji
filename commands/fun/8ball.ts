import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "8ball";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.fun.8ball" ];
    public readonly options = [{
        type: 3,
        name: "question",
        description: lang.setLanguage("en").get("OPT_EIGHTBALL_QUESTION_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const question = Util.escapeMarkdown(interaction.options.getString("question")!);
        lang.setLanguage(guildConfig.language!);

        const answers = lang.get("DATA_COMMANDS_EIGHTBALL_ANSWERS");

        if (!question!.endsWith("?")) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EIGHTBALL_INVALID"))]
        })

        await interaction.followUp({
            embeds: [sender.success().addFields([
                { name: lang.get("DATA_COMMANDS_EIGHTBALL_QUESTION"), value: question! },
                { name: lang.get("DATA_COMMANDS_EIGHTBALL_ANSWER"), value: answers.randomValue() }
            ])]
        });
    }
}