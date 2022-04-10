import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import fetch from "node-fetch";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "app-info";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.appinfo" ];
    public readonly options = [ {
        type: 3,
        name: "app_id",
        description: lang.setLanguage("en").get("OPT_APPINFO_APPID_DESC"),
        required: true
    } ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const body = await fetch(
            `https://discord.com/api/oauth2/authorize?client_id=${interaction.options.data[0].value}&permissions=8&scope=bot%20identify%20guilds`,
            {
                headers: {
                    Authorization: "NjI4ODI5MDQ5NTAyMDQwMDY1.YRE8_g.CPqUJNwkT_H7XNpazZBrwrzTQjo"
                }
            }
        ).then((data: any) => data.json());

        if (!body.hasOwnProperty("application")) return await interaction.followUp({
            embeds: [ sender.error(lang.get("DATA_COMMANDS_APPINFO_INVALIDAPP")) ],
            ephemeral: true
        });

        await interaction.followUp({
            embeds: [ sender.success().addFields([
                {
                    name: lang.getGlobal("STATIC_NAME"),
                    value: `\`${body.application.name}\``
                },
                {
                    name: "ID",
                    value: `\`${body.application.id}\``
                },
                {
                    name: lang.getGlobal("STATIC_DESC"),
                    value: `\`\`\`${Util.escapeMarkdown(body.application.description || lang.resolveUnknown()).truncate(1000)}\`\`\``
                },
                {
                    name: lang.getGlobal("STATIC_PRIVACYPOLICY"),
                    value: `[\`\*click\*\`](${body.application.privacy_policy_url || "https://discord.com/guidelines"})`
                },
                {
                    name: "TOS",
                    value: `[\`\*click\*\`](${body.application.terms_of_service_url || "https://discord.com/tos"})`
                },
                {
                    name: lang.getGlobal("STATIC_PUBLIC"),
                    value: `\`${lang.setLanguage(guildConfig.language!).resolveBoolean(body.application.bot_public.toString())}\``
                },
                {
                    name: lang.get("DATA_COMMANDS_APPINFO_GUILDCOUNT"),
                    value: `\`${body.bot.approximate_guild_count}\``
                },
                {
                    name: `${lang.getGlobal("STATIC_INVITELINK")} (Administrator)`,
                    value: `[\`\*klik\*\`](https://discord.com/api/oauth2/authorize?client_id=${body.application.id}&scope=bot&permissions=8)`
                }
            ]) ],
        });
    }
}