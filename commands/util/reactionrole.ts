import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "reaction-role";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.reactionrole" ];
    public readonly options = [
        {
            type: 1,
            name: "add",
            description: lang.setLanguage("en").get("OPT_REACTIONROLE_ADD_DESC"),
            options: [
                { type: 7, name: "channel", description: lang.setLanguage("en").get("OPT_REACTIONROLE_CHANNEL_DESC"), required: true },
                { type: 3, name: "message_id", description: lang.setLanguage("en").get("OPT_REACTIONROLE_MESSAGEID_DESC"), required: true },
                { type: 8, name: "role", description: lang.setLanguage("en").get("OPT_REACTIONROLE_ROLE_DESC"), required: true },
                { type: 3, name: "emoji", description: lang.setLanguage("en").get("OPT_REACTIONROLE_EMOJI_DESC"), required: true }
            ]
        },
        {
            type: 1,
            name: "remove",
            description: lang.setLanguage("en").get("OPT_REACTIONROLE_REMOVE_DESC"),
            options: [
                { type: 3, name: "message_id", description: lang.setLanguage("en").get("OPT_REACTIONROLE_MESSAGEID_DESC"), required: true },
                { type: 3, name: "emoji", description: lang.setLanguage("en").get("OPT_REACTIONROLE_EMOJI_DESC"), required: true }
            ]
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 20;
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        switch (interaction.options.getSubcommand()) {
            case "add": {
                const channel = interaction.options.getChannel("channel")!;
                const message = await channel.messages?.fetch(interaction.options.getString("message_id")!).catch(() => null);
                const role = interaction.options.getRole("role")!;
                const emoji = interaction.options.getString("emoji")!;

                if (!message) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REACTIONROLE_INVALIDMESSAGE"))]
                });

                if (role.managed || interaction.guild!.roles.everyone.id === role.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REACTIONROLE_INVALIDROLE"))]
                });

                if (await client.database.reactionroles.get(message.id, emoji)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REACTIONROLE_ALREADYEXISTS"))]
                });

                await message.react(emoji).catch(async (e) => {
                    return await interaction.followUp({
                        embeds: [sender.error(
                            lang.get(e.stack?.toLowerCase()?.includes("unknown emoji") ? "DATA_COMMANDS_REACTIONROLE_INVALIDEMOJI" : "DATA_COMMANDS_REACTIONROLE_FAILED")
                        )]
                    })
                });

                await client.database.reactionroles.create({
                    guildId: interaction.guildId!,
                    emoji: emoji,
                    messageID: message.id,
                    roleID: role.id
                });

                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_REACTIONROLE_SUCCESSADD"))]
                });
                break
            }
            case "remove": {
                const reactionRoleData = await client.database.reactionroles.get(
                    interaction.options.getString("message_id")!,
                    interaction.options.getString("emoji")!
                );

                if (!reactionRoleData) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_REACTIONROLE_INVALIDRR"))]
                });

                await client.database.reactionroles.remove(interaction.options.getString("message_id")!, interaction.options.getString("emoji")!);
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_REACTIONROLE_SUCCESSREMOVE"))]
                });
                break
            }
        }
    }
}