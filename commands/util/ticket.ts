import { CommandInteraction, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "ticket";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.ticket" ];
    public readonly options = [{
        type: 1,
        name: "text",
        description: lang.setLanguage("en").get("OPT_TICKET_SETTEXT_DESC"),
        options: [{
            type: 3,
            name: "text",
            description: lang.setLanguage("en").get("OPT_TICKET_TEXT_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "message",
        description: lang.setLanguage("en").get("OPT_TICKET_MESSAGE_DESC"),
        options: [{
            type: 3,
            name: "message_id",
            description: lang.setLanguage("en").get("OPT_TICKET_MESSAGEID_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "channel",
        description: lang.setLanguage("en").get("OPT_TICKET_SETCHANNEL_DESC"),
        options: [{
            type: 7,
            name: "channel",
            description: lang.setLanguage("en").get("OPT_TICKET_CHANNEL_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "category",
        description: lang.setLanguage("en").get("OPT_TICKET_SETCATEGORY_DESC"),
        options: [{
            type: 7,
            name: "category",
            description: lang.setLanguage("en").get("OPT_TICKET_CATEGORY_DESC"),
            required: true
        }]
    }, {
        type: 1,
        name: "status",
        description: lang.setLanguage("en").get("OPT_TICKET_SETSTATUS_DESC"),
        options: [{
            type: 5,
            name: "status",
            description: lang.setLanguage("en").get("OPT_TICKET_STATUS_DESC"),
            required: true
        }]
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        
        lang.setLanguage(guildConfig.language!);
        
        switch (interaction.options.getSubcommand()) {
            case "text": {
                const text = interaction.options.getString("text")!;

                if (text.length > 2000) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_INVALIDTEXT"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { ticketText: text }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_TICKET_CHANGED_TEXT", [{ old: "text", new: text.truncate(1000) }]))]
                });

                break
            }
            case "message": {
                const channel = <TextChannel>await interaction.guild!.channels.fetch(guildConfig.ticketChannelID!).catch(() => null);
                const message = await channel.messages.fetch(interaction.options.getString("message_id")!).catch(() => null);
                const category = interaction.guild!.channels.fetch(guildConfig.ticketCategoryID!).catch(() => null);

                if (!channel) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_NOTCONFIGURED_CHANNEL"))]
                });

                if (!category) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_NOTCONFIGURED_CATEGORY"))]
                });

                if (!message || !message.editable || message.channel.id !== guildConfig.ticketChannelID) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_INVALIDMESSAGE"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { ticketMessageID: message.id }
                )
                await message.edit({
                    components: [new MessageActionRow().addComponents([
                        new MessageButton()
                        .setEmoji("📧")
                        .setCustomId("ticket-create")
                        .setLabel(lang.get("DATA_COMMANDS_TICKET_CREATETICKET"))
                        .setStyle("PRIMARY")
                    ])]
                });

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_TICKET_CHANGED_MESSAGE", [{ old: "id", new: message.id }]))]
                });

                break
            }
            case "status": {
                const status = interaction.options.getBoolean("status")!;

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { ticketStatus: status }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_TICKET_CHANGED_STATUS", [{ old: "status", new: status }]))]
                });

                break
            }
            case "channel": {
                const channel = interaction.options.getChannel("channel")!;

                if (channel.type !== "GUILD_TEXT") return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_INVALIDCHANNELTYPE"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { ticketChannelID: channel.id }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_TICKET_CHANGED_CHANNEL", [{ old: "channel", new: channel.name.truncate(50) }]))]
                });

                break
            }
            case "category": {
                const channel = interaction.options.getChannel("category")!;

                if (channel.type as keyof typeof ChannelTypes !== "GUILD_CATEGORY") return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_TICKET_INVALIDCATEGORY"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { ticketCategoryID: channel.id }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_TICKET_CHANGED_CATEGORY", [{ old: "category", new: channel.name.truncate(50) }]))]
                });

                break
            }
        }
    }
}