import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "snipe";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.snipe" ];
    public readonly options = [
        {
            type: 1,
            name: "deleted",
            description: lang.setLanguage("en").get("OPT_SNIPE_DELETED_DESC"),
            options: [{
                type: 10,
                name: "index",
                description: lang.setLanguage("en").get("OPT_SNIPE_INDEX_DESC")
            }, {
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_SNIPE_USER_DESC")
            }, {
                type: 7,
                name: "channel",
                description: lang.setLanguage("en").get("OPT_SNIPE_CHANNEL_DESC")
            }]
        },
        {
            type: 1,
            name: "edited",
            description: lang.setLanguage("en").get("OPT_SNIPE_EDITED_DESC"),
            options: [{
                type: 10,
                name: "index",
                description: lang.setLanguage("en").get("OPT_SNIPE_INDEX_DESC")
            }, {
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_SNIPE_USER_DESC")
            }, {
                type: 7,
                name: "channel",
                description: lang.setLanguage("en").get("OPT_SNIPE_CHANNEL_DESC")
            }]
        },
        {
            type: 1,
            name: "delete_user",
            description: lang.setLanguage("en").get("OPT_SNIPE_DELETEUSER_DESC"),
            options: [{
                type: 6,
                name: "user",
                description: lang.setLanguage("en").get("OPT_SNIPE_USER_DESC"),
                required: true
            }]
        },
        {
            type: 1,
            name: "delete_channel",
            description: lang.setLanguage("en").get("OPT_SNIPE_DELETECHANNEL_DESC"),
            options: [{
                type: 7,
                name: "channel",
                description: lang.setLanguage("en").get("OPT_SNIPE_CHANNEL_DESC"),
                required: true
            }]
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        
        lang.setLanguage(guildConfig.language!);

        if (!guildConfig.snipeEnabled) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SNIPE_NOTENABLED"))]
        });

        switch (interaction.options.getSubcommand()) {
            case "deleted": {
                const index = (await interaction.options.getNumber("index") ?? 1) - 1;
                const user = await interaction.options.getUser("user");
                const channel = await interaction.options.getChannel("channel");

                if (user && user !== interaction.user && !await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.snipe.seeother")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.snipe.seeother"],
                        lang.get("DATA_COMMANDS_SNIPE_DONTHAVEPERMISSIONS_SEEUSER")
                    )]
                })

                const data = user && channel
                    ? await client.database.snipe.getUserAndChannel(user.id, channel.id, "deleted")
                    : user
                    ? await client.database.snipe.getUser(user.id, "deleted")
                    : channel
                    ? await client.database.snipe.getChannel(channel.id, "deleted")
                    : await client.database.snipe.getAll(interaction.guildId!, "deleted")

                if (!data[index]) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_SNIPE_NONE"))]
                })

                await interaction.followUp({
                    embeds: [sender.success().addFields([
                        { name: lang.get("DATA_COMMANDS_SNIPE_CONTENT"), value: Util.escapeMarkdown(data[index].content || lang.resolveUnknown()) },
                        { name: lang.get("DATA_COMMANDS_SNIPE_AUTHOR"), value: client.users.cache.get(data[index].userID)?.toString() || lang.resolveUnknown() },
                        { name: lang.get("DATA_COMMANDS_SNIPE_TYPE"), value: data[index].type.capitalize() }
                    ])]
                })
                break
            }
            case "edited": {
                const index = (await interaction.options.getNumber("index") ?? 1) - 1;
                const user = await interaction.options.getUser("user");
                const channel = await interaction.options.getChannel("channel");

                if (user && user !== interaction.user && !await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.snipe.seeother")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.snipe.seeother"],
                        lang.get("DATA_COMMANDS_SNIPE_DONTHAVEPERMISSIONS_SEEUSER")
                    )]
                })

                const data = user && channel
                    ? await client.database.snipe.getUserAndChannel(user.id, channel.id, "edited")
                    : user
                    ? await client.database.snipe.getUser(user.id, "edited")
                    : channel
                    ? await client.database.snipe.getChannel(channel.id, "edited")
                    : await client.database.snipe.getAll(interaction.guildId!, "edited")

                if (!data[index]) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_SNIPE_NONE"))]
                })

                await interaction.followUp({
                    embeds: [sender.success().addFields([
                        { name: lang.get("DATA_COMMANDS_SNIPE_OLDCONTENT"), value: Util.escapeMarkdown(data[index].oldContent || lang.resolveUnknown()) },
                        { name: lang.get("DATA_COMMANDS_SNIPE_CONTENT"), value: Util.escapeMarkdown(data[index].content || lang.resolveUnknown()) },
                        { name: lang.get("DATA_COMMANDS_SNIPE_AUTHOR"), value: client.users.cache.get(data[index].userID)?.toString() || lang.resolveUnknown() },
                        { name: lang.get("DATA_COMMANDS_SNIPE_TYPE"), value: data[index].type.capitalize() }
                    ])]
                })
                break
            }
            case "delete_user": {
                const user = interaction.options.getUser("user")!;

                if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.snipe.delete")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.snipe.delete"],
                        lang.get("DATA_COMMANDS_SNIPE_DONTHAVEPERMISSIONS_DELUSER")
                    )]
                })

                await client.database.snipe.deleteUser(user.id, "deleted");
                await client.database.snipe.deleteUser(user.id, "edited");
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_SNIPE_DELETEDBYUSER"))]
                })
                break
            }
            case "delete_channel": {
                const channel = interaction.options.getChannel("channel")!;

                if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.util.snipe.delete")) return await interaction.followUp({
                    embeds: [sender.permissionError(
                        ["commands.util.snipe.delete"],
                        lang.get("DATA_COMMANDS_SNIPE_DONTHAVEPERMISSIONS_DELCHANNEL")
                    )]
                })

                await client.database.snipe.deleteChannel(channel.id, "deleted");
                await client.database.snipe.deleteChannel(channel.id, "edited");
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_SNIPE_DELETEDBYCHANNEL"))]
                })
                break
            }
        }
    }
}