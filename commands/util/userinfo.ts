import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "userinfo";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.userinfo" ];
    public readonly options = [
        {
            type: 6,
            name: "user",
            description: lang.setLanguage("en").get("OPT_USERINFO_USER_DESC"),
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);

        const user = interaction.options.getUser("user") || interaction.user;
        const guildMember = interaction.options.getMember("user") || interaction.member;
        const birthdayData = await client.database.birthdays.get(user.id);

        const timestamp = birthdayData ? (new Date(new Date().getFullYear() + 1, parseInt(birthdayData.month) - 1, parseInt(birthdayData.day)).getTime() / 1000) : null;
        await interaction.followUp({
            embeds: [
                sender.success().addFields([
                    { name: lang.getGlobal("STATIC_NAME"), value: user.tag },
                    { name: lang.getGlobal("STATIC_ID"), value: user.id },
                    { name: lang.get("DATA_COMMANDS_USERINFO_ACCOUNTCREATED"), value: `<t:${(user.createdAt.getTime() / 1000).toFixed()}:D>` },
                    { name: lang.get("DATA_COMMANDS_USERINFO_ISBOT"), value: lang.resolveBoolean(user.bot.toString())! },
                    { name: lang.get("DATA_COMMANDS_USERINFO_ROLES"), value: guildMember?.roles?.cache?.sort(
                        (a, b) => a.position - b.position
                    ).map((role) => `\`${role.name}\``).join(", ") || lang.resolveUnknown() },
                    { name: lang.get("DATA_COMMANDS_USERINFO_TOPROLE"), value: `\`${guildMember?.roles?.highest.name || lang.resolveUnknown()}\`` },
                    { name: lang.get("DATA_COMMANDS_USERINFO_BIRTHDAYDATE"), value: timestamp ? `<t:${timestamp.toFixed()}:F>` : lang.resolveUnknown() }
                ])
            ]
        });
    }
}