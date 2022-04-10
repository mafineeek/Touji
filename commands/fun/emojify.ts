import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");
export const specialCodes: any = {
    '0': ':zero:', '1': ':one:', '2': ':two:', '3': ':three:', '4': ':four:', '5': ':five:',
    '6': ':six:', '7': ':seven:', '8': ':eight:', '9': ':nine:', '#': ':hash:', '*': ':asterisk:',
    '?': ':grey_question:', '!': ':grey_exclamation:', ' ': '   '
}
export default class Command implements BaseCommand {
    public readonly name = "emojify";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.emojify" ];
    public readonly options = [{
        type: 3,
        name: "text",
        description: lang.setLanguage("en").get("OPT_EMOJIFY_TEXT_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const text = interaction.options.getString("text")!;
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        if (text.length > 500) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EMOJIFY_TOOLONG"))]
        })

        await interaction.followUp({
            content: text
                .toLowerCase()
                .normalize("NFD")
                .replaceMany([
                    /[\u0300-\u036f]/g,
                    /ł/g
                ], ["", "l"])
                .split('')
                .map((letter: string) => {
                if(/[a-z]/g.test(letter)) {
                    return `:regional_indicator_${letter}:`
                } else if (specialCodes[letter]) {
                    return specialCodes[letter]
                }
                return letter;
            }).join(' ')
        });
    }
}