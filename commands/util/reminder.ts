import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";
import ms from "ms";
import ReminderData from "../../util/database/types/ReminderData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "reminder";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.reminder" ];
    public readonly options = [{
        type: 1,
        name: "add",
        description: lang.setLanguage("en").get("OPT_REMINDER_ADD_DESC"),
        options: [{
            type: 3,
            name: "time",
            description: lang.setLanguage("en").get("OPT_REMINDER_TIME_DESC"),
            required: true
        }, {
            type: 3,
            name: "content",
            description: lang.setLanguage("en").get("OPT_REMINDER_CONTENT_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "revoke",
        description: lang.setLanguage("en").get("OPT_REMINDER_REVOKE_DESC"),
        options: [{
            type: 10,
            name: "id",
            description: lang.setLanguage("en").get("OPT_REMINDER_ID_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "list",
        description: lang.setLanguage("en").get("OPT_REMINDER_LIST_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        
        lang.setLanguage(guildConfig.language!);
        
        const time = interaction.options.getString("time")!;
        const id = interaction.options.getNumber("id")?.toString()!
        const content = interaction.options.getString("content");
        
        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (!ms(time) || ms(time) < 300000 || ms(time) > 1210000000) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REMINDER_INVALIDTIME"))]
                });
                else if (!content || content?.length > 200) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REMINDER_INVALIDCONTENT"))]
                });

                const reminderID = await client.database.reminders.create({
                    userID: interaction.user.id,
                    createdAt: Date.now(),
                    expireAt: Date.now() + ms(time),
                    content: Util.escapeMarkdown(content)
                })

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_REMINDER_CREATED", [{ old: "id", new: reminderID }]))]
                })
                break
            }
            case "revoke": {
                if (!await client.database.reminders.get(id)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REMINDER_INVALIDID"))]
                });

                await client.database.reminders.remove(id);
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_REMINDER_REVOKED", [{ old: "id", new: id }]))]
                })
                break
            }
            case "list": {
                const reminders = await client.database.reminders.getAll(interaction.user.id);

                if (!reminders.length) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REMINDER_NONE"))]
                });

                const embeds = [];
                for (const part of reminders.chunk(3)) {
                    embeds.push(sender.success().addFields(part.map((data: ReminderData) => {
                        return {
                            name: `#${data.id}`,
                            value: data.content
                        }
                    })))
                }

                await Paginator(interaction, embeds);
                break
            }
        }
    }
}