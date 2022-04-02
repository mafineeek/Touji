import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "birthday";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.birthday" ];
    public readonly options = [
        {
            type: 1,
            name: "set",
            description: lang.setLanguage("en").get("OPT_BIRTHDAY_SET_DESC"),
            options: [{
                type: 10,
                name: "day",
                description: lang.setLanguage("en").get("OPT_BIRTHDAY_DAY_DESC"),
                required: true
            }, {
                type: 10,
                name: "month",
                description: lang.setLanguage("en").get("OPT_BIRTHDAY_MONTH_DESC"),
                required: true
            }]
        },
        {
            type: 1,
            name: "next",
            description: lang.setLanguage("en").get("OPT_BIRTHDAY_NEXT_DESC")
        },
        {
            type: 1,
            name: "today",
            description: lang.setLanguage("en").get("OPT_BIRTHDAY_TODAY_DESC")
        },
        {
            type: 1,
            name: "user",
            description: lang.setLanguage("en").get("OPT_BIRTHDAY_SHOWUSER_DESC"),
            options: [{
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_BIRTHDAY_USER_DESC")
            }]
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const data = await client.database.birthdays.get(interaction.user.id);

        lang.setLanguage(guildConfig.language!);

        switch (interaction.options.getSubcommand()) {
            case "next": {
                const next = await client.database.birthdays.next();

                if (!next.length) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_BIRTHDAY_NONENEXT"))]
                })

                const embeds = [];
                const formatted = next.chunk(10);

                let i = 0;

                for (const part of formatted) {
                    const embed = sender.success("")
                    for (const { userID } of part) {
                        i++;
                        embed.description += `**#${i}.** \`${(await client.users.fetch(userID).catch(() => null))?.tag || lang.resolveUnknown()}\`\n`;
                    }
                    embeds.push(embed);
                }

                await Paginator(interaction, embeds);
                break
            }
            case "today": {
                const today = await client.database.birthdays.today();

                if (!today.length) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_BIRTHDAY_NONETODAY"))]
                })

                const embeds = [];
                const formatted = today.chunk(10);

                let i = 0;

                for (const part of formatted) {
                    const embed = sender.success("")
                    for (const { userID } of part) {
                        i++;
                        embed.description += `**#${i}.** \`${(await client.users.fetch(userID).catch(() => null))?.tag || lang.resolveUnknown()}\`\n`;
                    }
                    embeds.push(embed);
                }

                await Paginator(interaction, embeds);
                break
            }
            case "set": {
                const day = interaction.options.getNumber("day")!;
                const month = interaction.options.getNumber("month")!;
                if (data) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_BIRTHDAY_ALREADYSETTED", [
                        { old: "day", new: data.day.length === 1 ? `0${data.day}` : data.day },
                        { old: "month", new: data.month.length === 1 ? `0${data.month}` : data.month }
                    ]))]
                })

                if (month < 1 || month > 12 || day > Date.daysOfMonth(month) || day < 1) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_BIRTHDAY_INVALIDDATE"))]
                })

                await client.database.birthdays.insert({
                    userID: interaction.user.id,
                    guildId: interaction.guild!.id,
                    day: day.toString(),
                    month: month.toString(),
                    delivered: null
                });

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_BIRTHDAY_UPDATED", [
                        { old: "day", new: day.toString().length === 1 ? `0${day}` : day },
                        { old: "month", new: month.toString().length === 1 ? `0${month}` : month }
                    ]))]
                });
                break
            }
            case "user": {
                const user = interaction.options.getUser("user") || interaction.user;
                const birthdayData = await client.database.birthdays.get(user.id);

                if (!birthdayData) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_BIRTHDAY_NODATA", [{ old: "user", new: user.username }]))]
                });

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_BIRTHDAY_DATE", [
                        { old: "user", new: user.username },
                        { old: "time", new: (new Date(new Date().getFullYear() + 1, parseInt(birthdayData.month) - 1, parseInt(birthdayData.day)).getTime() / 1000).toFixed() }
                    ]))]
                })
            }
        }
    }
}