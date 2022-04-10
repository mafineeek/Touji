import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "starboard";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.starboard" ];
    public readonly options = [
        {
            type: 1,
            name: "ban",
            description: lang.setLanguage("en").get("OPT_STARBOARD_BAN_DESC"),
            options: [{
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_STARBOARD_BANUSER_DESC"),
                required: true
            }]
        },
        {
            type: 1,
            name: "unban",
            description: lang.setLanguage("en").get("OPT_STARBOARD_UNBAN_DESC"),
            options: [{
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_STARBOARD_UNBANUSER_DESC"),
                required: true
            }]
        },
        {
            type: 1,
            name: "best",
            description: lang.setLanguage("en").get("OPT_STARBOARD_BEST_DESC"),
            options: [{
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_STARBOARD_BESTUSER_DESC")
            }]
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user");

        lang.setLanguage(guildConfig.language!);

        switch (interaction.options.getSubcommand()) {
            case "ban": {
                if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.starboard.ban")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.starboard.ban"],
                        lang.get("DATA_COMMANDS_SETLEVEL_NOUSERPERMISSIONS")
                    )]
                })

                if (user === interaction.user) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_STARBOARD_BANSOMEONE"))]
                })

                if (await client.database.starboard.isBanned(interaction.guildId!, user?.id!)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_STARBOARD_USERALREADYBANNED"))]
                })

                await client.database.starboard.ban(interaction.guildId!, user?.id!);
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_STARBOARD_BANNED", [{ old: "user", new: user?.tag }]))]
                })

                break
            }
            case "unban": {
                if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.starboard.unban")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.starboard.unban"],
                        lang.get("DATA_COMMANDS_STARBOARD_NOPERMISSIONS", [{ old: "to", new: "unban" }])
                    )]
                })

                if (!await client.database.starboard.isBanned(interaction.guildId!, user?.id!)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_STARBOARD_NOTBANNED"))]
                })

                await client.database.starboard.unban(interaction.guildId!, user?.id!);
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_STARBOARD_UNBANNED", [{ old: "user", new: user?.tag }]))]
                })

                break
            }
            case "best": {
                const bestMessage = await client.database.starboard.getBest(user?.id! || interaction.user.id);
                if (!bestMessage) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_STARBOARD_NOBEST", [{ old: "user", new: (user || interaction.user).tag }]))]
                })

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_STARBOARD_BESTMESSAGE", [
                        { old: "url", new: `https://discord.com/channels/${interaction.guildId}/${guildConfig.starboardChannelID}/${bestMessage.starboardMessageID}` },
                        { old: "user", new: user?.tag || interaction.user.tag },
                        { old: "guild", new: interaction.guild!.name },
                        { old: "starCount", new: bestMessage.starCount }
                    ]))]
                })
                break
            }
        }
    }
}