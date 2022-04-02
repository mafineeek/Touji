import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "ping";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.bot.ping" ];
    public readonly category = "bot";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);

        await interaction.followUp({
            embeds: [ sender.success().addFields([
                {
                    name: lang.getGlobal("STATIC_APILATENCY"),
                    value: `\`${client.ws.ping}\`ms`,
                    inline: true
                }
            ]) ]
        });
    }
}