import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "choose";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.choose" ];
    public readonly options = Array.fill(25, (i: number) => {
        return {
            type: 3,
            name: i.toString(),
            description: `${lang.setLanguage("en").getGlobal("STATIC_OPTION").toLowerCase().capitalize()} ${i}`
        }
    })
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const options = interaction.options.data.map((option) => Util.escapeMarkdown(option.value as string));

        lang.setLanguage(guildConfig.language!);

        if (options.length < 2) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_CHOOSE_NOTENOUGH"))]
        })

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_CHOOSE_CHOOSEN", [{ old: "answer", new: options.random() }]))]
        });
    }
}