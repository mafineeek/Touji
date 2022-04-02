import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "serverinfo";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.serverinfo" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        
        lang.setLanguage(guildConfig.language!);

        const embed = sender.success().addFields([
            { name: lang.getGlobal("STATIC_NAME"), value: interaction.guild!.name },
            { name: lang.getGlobal("STATIC_ID"), value: interaction.guild!.id },
            { name: lang.get("DATA_COMMANDS_SERVERINFO_CREATEDAT"), value: `<t:${(interaction.guild!.createdAt.getTime() / 1000).toFixed()}:D>` },
            { name: lang.get("DATA_COMMANDS_SERVERINFO_BOOSTS"), value: `${interaction.guild!.premiumSubscriptionCount} (level ${interaction.guild!.premiumTier === "NONE" ? 0 : interaction.guild!.premiumTier.slice(5)})` },
            { name: lang.get("DATA_COMMANDS_SERVERINFO_MEMBERCOUNT"), value: interaction.guild!.memberCount.toString() },
            { name: lang.get("DATA_COMMANDS_SERVERINFO_FEATURES"), value: interaction.guild!.features.map(
                (feature) => lang.get(`DATA_COMMANDS_SERVERINFO_GUILDFEATURES_${feature.split("_").join("")}`)
            ).join(", ") || lang.resolveUnknown() }
        ]);

        if (interaction.guild!.bannerURL()) embed.setImage(interaction.guild!.bannerURL()!)
        await interaction.followUp({
            embeds: [ embed ]
        });
    }


}