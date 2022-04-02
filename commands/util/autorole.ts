import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "autorole";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.util.autorole" ];
    public readonly options = [
        {
            type: 1,
            name: "add",
            description: lang.setLanguage("en").get("OPT_AUTOROLE_ADD_DESC"),
            options: [{
                type: 8,
                name: "role",
                description: lang.setLanguage("en").get("OPT_AUTOROLE_ROLE_DESC"),
                required: true
            }]
        }, {
            type: 1,
            name: "remove",
            description: lang.setLanguage("en").get("OPT_AUTOROLE_REMOVE_DESC"),
            options: [{
                type: 8,
                name: "role",
                description: lang.setLanguage("en").get("OPT_AUTOROLE_ROLE_DESC"),
                required: true
            }]
        }, {
            type: 1,
            name: "list",
            description: lang.setLanguage("en").get("OPT_AUTOROLE_LIST_DESC")
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const role = interaction.options.getRole("role");
        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (guildConfig.joinRoleIds?.includes(role!.id)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_ALREADYADDED"))]
                });

                if (role?.managed || interaction.guild!.roles.everyone.id === role!.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_INVALID"))]
                });

                if (role!.position >= interaction.member.roles.highest.position && interaction.guild!.ownerId !== interaction.user.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_DONTHAVEPERMISSIONS"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { joinRoleIds: (guildConfig.joinRoleIds ?? []).concat([role!.id]) }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_AUTOROLE_ADDED", [{ old: "roleName", new: role!.name.truncate(30) }]))]
                });
                break
            }
            case "remove": {
                if (!guildConfig.joinRoleIds?.includes(role!.id)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_NOTADDED"))]
                });

                if (role!.position >= interaction.member.roles.highest.position && interaction.guild!.ownerId !== interaction.user.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_DONTHAVEPERMISSIONS"))]
                });

                await client.database.guildConfig.set(
                    interaction.guildId!,
                    { joinRoleIds: guildConfig.joinRoleIds.removeOne(role!.id) }
                )
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_AUTOROLE_REMOVED", [{ old: "roleName", new: role!.name.truncate(30) }]))]
                });
                break
            }
            case "list": {
                if (!guildConfig.joinRoleIds?.length) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_AUTOROLE_NOAUTOROLES"))]
                });

                const embeds = [];
                const formatted = guildConfig.joinRoleIds?.chunk(10);

                let i = 0;

                for (const part of formatted) {
                    const embed = sender.success("")
                    for (const roleId of part) {
                        i++;
                        embed.description += `**#${i}.** ${interaction.guild!.roles.cache.get(roleId)?.toString() || lang.resolveUnknown()}\n`;
                    }
                    embeds.push(embed);
                }

                await Paginator(interaction, embeds);
                break
            }
        }
    }
}