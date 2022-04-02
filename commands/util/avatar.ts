import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "avatar";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.avatar" ];
    public readonly options = [
        {
            type: 6,
            name: "user",
            description: "User",
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);
        const user = interaction.options.getUser("user") || interaction.user;
        await interaction.followUp({
            embeds: [
                sender.success().setImage(user.displayAvatarURL({ dynamic: true, size: 4096, format: "png" }))
            ],
        });
    }


}