import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";
import {LevelReward} from "../../util/database/types/LevellingData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "role-rewards";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.levelling.rolerewards" ];
    public readonly options = [
        {
            type: 1,
            name: "add",
            description: lang.setLanguage("en").get("OPT_ROLEREWARDS_ADD_DESC"),
            options: [{
                type: 8,
                name: "role",
                description: lang.setLanguage("en").get("OPT_ROLEREWARDS_ROLE_DESC"),
                required: true
            }, {
                type: 10,
                name: "level",
                description: lang.setLanguage("en").get("OPT_ROLEREWARDS_LEVEL_DESC"),
                required: true
            }]
        }, {
            type: 1,
            name: "remove",
            description: lang.setLanguage("en").get("OPT_ROLEREWARDS_REMOVE_DESC"),
            options: [{
                type: 10,
                name: "level",
                description: lang.setLanguage("en").get("OPT_ROLEREWARDS_LEVEL_DESC"),
                required: true
            }]
        }, {
            type: 1,
            name: "list",
            description: lang.setLanguage("en").get("OPT_ROLEREWARDS_LIST_DESC")
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "levelling";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const role = interaction.options.getRole("role");
        const rewards = await client.database.levelling.getRoleRewards(interaction.guildId!);
        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (!guildConfig.levellingEnabled) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_DISABLED"))]
                });

                const level = interaction.options.getNumber("level")!;

                if (rewards.some((r: LevelReward) => r.level === level)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_ALREADYADDED"))]
                });

                if (isFloat(level) || level < 1 || level > 100) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_INVALIDLEVEL"))]
                });

                if (role?.managed || interaction.guild!.roles.everyone.id === role!.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_INVALIDROLE"))]
                });

                if (role!.position >= interaction.member.roles.highest.position && interaction.guild!.ownerId !== interaction.user.id) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_DONTHAVEPERMISSIONS"))]
                });

                await client.database.levelling.addRoleReward({
                    id: role!.id,
                    guildId: interaction.guildId!,
                    level: level
                })
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_ROLEREWARDS_ADDED", [{ old: "roleName", new: role!.name.truncate(30) }, { old: "level", new: level }]))]
                });
                break
            }
            case "remove": {
                if (!guildConfig.levellingEnabled) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_DISABLED"))]
                });

                const level = interaction.options.getNumber("level")!;

                if (!rewards.some((r: LevelReward) => r.level === level)) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_NOTADDED"))]
                });

                await client.database.levelling.removeRoleReward(interaction.guildId!, level)
                await interaction.followUp({
                    embeds: [sender.success(lang.get("DATA_COMMANDS_ROLEREWARDS_REMOVED", [{ old: "level", new: level }]))]
                });
                break
            }
            case "list": {
                if (!rewards.length) return await interaction.followUp({
                    embeds: [sender.error(lang.get("DATA_COMMANDS_ROLEREWARDS_NOROLES"))]
                });

                const embeds = [];
                const formatted = rewards.chunk(10);

                let i = 0;

                for (const part of formatted) {
                    const embed = sender.success("")
                    for (const { id, level } of part) {
                        i++;
                        embed.description += `**#${i}.** ${interaction.guild!.roles.cache.get(id)?.toString() || lang.resolveUnknown()} - ${level} level\n`;
                    }
                    embeds.push(embed);
                }

                await Paginator(interaction, embeds);
                break
            }
        }
    }
}