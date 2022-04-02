import { CommandInteraction, GuildChannel } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "lock";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.lock" ];
    public readonly options = [
        { type: 5, name: "server", description: lang.setLanguage("en").get("OPT_LOCK_SERVER_DESC") }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public readonly cooldown = 10;
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);

        if (interaction.options.getBoolean("server")) {
            for (const channel of interaction.guild!.channels.cache.values()) {
                const overwrites = (<GuildChannel>channel)?.permissionOverwrites;
                const permissions = (<GuildChannel>channel)?.permissionsFor(interaction.guild!.roles.everyone);

                if (overwrites && permissions) await overwrites.edit(
                    interaction.guild!.roles.everyone,
                    { SEND_MESSAGES: !permissions.has(["SEND_MESSAGES"]), SEND_TTS_MESSAGES: !permissions.has(["SEND_TTS_MESSAGES"]) }
                ).catch(() => false);
            }

            await interaction.followUp({
                embeds: [sender.success(lang.get("DATA_COMMANDS_LOCK_SUCCESS_SERVER"))]
            })
        } else {
            const overwrites = (<GuildChannel>interaction.channel)?.permissionOverwrites;
            const permissions = (<GuildChannel>interaction.channel)?.permissionsFor(interaction.guild!.roles.everyone);

            if (["GUILD_NEWS_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(interaction.channel!.type)) return await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_LOCK_THREAD"))]
            })

            if (overwrites && permissions) await overwrites.edit(
                interaction.guild!.roles.everyone,
                { SEND_MESSAGES: !permissions.has(["SEND_MESSAGES"]), SEND_TTS_MESSAGES: !permissions.has(["SEND_TTS_MESSAGES"]) }
            ).catch(async () => {
                return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_LOCK_ERROR"))]
                })
            });

            await interaction.followUp({
                embeds: [sender.success(lang.get("DATA_COMMANDS_LOCK_SUCCESS_*"))]
            })
        }
    }
}