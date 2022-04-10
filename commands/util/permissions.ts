import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "permissions";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.permissions" ];
    public readonly options = [
        {
            type: 2,
            name: "group",
            description: lang.setLanguage("en").get("OPT_PERMISSIONS_MANAGEGROUP_DESC"),
            options: [{
                type: 1,
                name: "add-permission",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_ADDPERMISSIONSTOGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 3,
                    name: "pex",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_PEX_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "remove-permission",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_REMOVEPERMISSIONSFROMGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 3,
                    name: "pex",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_PEX_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "add-user",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_ADDUSERTOGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 6,
                    name: "user",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_USER_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "remove-user",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_REMOVEUSERFROMGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 6,
                    name: "user",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_USER_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "add-role",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_ADDROLETOGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 8,
                    name: "role",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_ROLE_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "remove-role",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_REMOVEROLEFROMGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }, {
                    type: 6,
                    name: "role",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_ROLE_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "create",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_ADDGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "remove",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_REMOVEGROUP_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "list",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_LIST_DESC"),
                options: [{
                    type: 3,
                    name: "name",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_NAME_DESC"),
                    required: true
                }]
            }]
        }, {
            type: 2,
            name: "user",
            description: lang.setLanguage("en").get("OPT_PERMISSIONS_USERMANAGE_DESC"),
            options: [{
                type: 1,
                name: "add",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_ADDUSER_DESC"),
                options: [{
                    type: 6,
                    name: "user",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_USER_DESC"),
                    required: true
                }, {
                    type: 3,
                    name: "pex",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_PEX_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "remove",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_REMOVEUSER_DESC"),
                options: [{
                    type: 6,
                    name: "user",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_USER_DESC"),
                    required: true
                }, {
                    type: 3,
                    name: "pex",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_PEX_DESC"),
                    required: true
                }]
            }, {
                type: 1,
                name: "get",
                description: lang.setLanguage("en").get("OPT_PERMISSIONS_GETUSER_DESC"),
                options: [{
                    type: 6,
                    name: "user",
                    description: lang.setLanguage("en").get("OPT_PERMISSIONS_USER_DESC"),
                    required: true
                }]
            }]
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        switch (interaction.options.getSubcommandGroup()) {
            case "group": {
                switch (interaction.options.getSubcommand()) {
                    case "add-permission": {
                        const pex = interaction.options.getString("pex")!;
                        const groupName = interaction.options.getString("name")!;

                        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (!client.pexes.includes(pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDPEX"))]
                        });

                        if (await client.database.permissions.addPEXToGroup({ guildId: interaction.guildId!, pex, groupName })) await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_ADDPEXTOGROUP", [{ old: "pex", new: pex }]))]
                        }); else await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_ERROR_ADDPEXTOGROUP", [{ old: "pex", new: pex }]))]
                        });
                        break
                    }
                    case "remove-permission": {
                        const pex = interaction.options.getString("pex")!;
                        const groupName = interaction.options.getString("name")!;

                        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (!client.pexes.includes(pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDPEX"))]
                        });

                        if (await client.database.permissions.removePEXFromGroup({ guildId: interaction.guildId!, pex, groupName })) await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_REMOVEDPEXFROMGROUP", [{ old: "pex", new: pex }]))]
                        }); else await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_ERROR_REMOVEDPEXFROMGROUP", [{ old: "pex", new: pex }]))]
                        });
                        break
                    }
                    case "add-user": {
                        const groupName = interaction.options.getString("name")!;
                        const user = interaction.options.getMember("user")!;

                        if (!await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        if (!user) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDUSER"))]
                        });

                        if (await client.database.permissions.inGroup(user.id, interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INGROUP"))]
                        });

                        await client.database.permissions.addToGroup({
                            userID: user.id,
                            guildId: interaction.guildId!,
                            groupName
                        })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_ADDTOGROUP", [{ old: "name", new: Util.escapeMarkdown(groupName) }]))]
                        });
                        break
                    }
                    case "remove-user": {
                        const groupName = interaction.options.getString("name")!;
                        const user = interaction.options.getMember("user")!;

                        if (!await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        if (!user) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDUSER"))]
                        });

                        if (!await client.database.permissions.inGroup(user.id, interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOTINGROUP"))]
                        });

                        await client.database.permissions.removeFromGroup({
                            userID: user.id,
                            guildId: interaction.guildId!,
                            groupName
                        })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_REMOVEFROMGROUP", [{ old: "name", new: Util.escapeMarkdown(groupName) }]))]
                        });
                        break
                    }
                    case "add-role": {
                        const role = await interaction.guild!.roles.fetch(interaction.options.getRole("role")!.id);
                        const groupName = interaction.options.getString("name")!;

                        if (!await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        if (role!.position >= interaction.member.roles.highest.position) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (await client.database.permissions.addRoleToGroup({ guildId: interaction.guildId!, role: role!.id, groupName })) await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_ADDROLETOGROUP", [{ old: "role", new: Util.escapeMarkdown(role!.name) }]))]
                        }); else await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_ERROR_ADDROLETOGROUP", [{ old: "role", new: Util.escapeMarkdown(role!.name) }]))]
                        });
                        break
                    }
                    case "remove-role": {
                        const role = (await interaction.guild!.roles.fetch(interaction.options.getRole("role")!.id))!;
                        const groupName = interaction.options.getString("name")!;

                        if (!await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        if (role.position >= interaction.member.roles.highest.position) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (await client.database.permissions.removeRoleFromGroup({ guildId: interaction.guildId!, role: role.id, groupName })) await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_REMOVEDROLEFROMGROUP", [{ old: "role", new: Util.escapeMarkdown(role.name) }]))]
                        }); else await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_ERROR_REMOVEDROLEFROMGROUP", [{ old: "role", new: Util.escapeMarkdown(role.name) }]))]
                        });
                        break
                    }
                    case "create": {
                        const groupName = interaction.options.getString("name")!;

                        if (groupName.length > 10) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_TOOLONG_GROUPNAME"))]
                        });

                        if (await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPALREADYEXISTS"))]
                        });

                        await client.database.permissions.addGroup({
                            guildId: interaction.guildId!,
                            groupName
                        })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_CREATEGROUP", [{ old: "name", new: Util.escapeMarkdown(groupName) }]))]
                        });
                        break
                    }
                    case "remove": {
                        const groupName = interaction.options.getString("name")!;

                        if (!await client.database.permissions.groupExists(interaction.guildId!, groupName)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        await client.database.permissions.removeGroup({
                            guildId: interaction.guildId!,
                            groupName
                        })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_REMOVEGROUP", [{ old: "name", new: Util.escapeMarkdown(groupName) }]))]
                        });
                        break
                    }
                    case "list": {
                        const groupData = await client.database.permissions.getGroup(interaction.guildId!, interaction.options.getString("name")!);

                        if (!groupData) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPINVALID"))]
                        });

                        const embeds = [];
                        const formatted = groupData.pexes?.chunk(10) || [];

                        if (!formatted.length) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_GROUPNOPERMISSIONS"))]
                        });

                        let i = 0;

                        for (const part of formatted) {
                            const embed = sender.success("", { text: lang.get("DATA_COMMANDS_PERMISSIONS_ALLOWEDGROUP") })
                            for (const pex of part) {
                                i++;
                                embed.description += `**#${i}.** \`${pex}\`\n`;
                            }
                            embeds.push(embed);
                        }

                        await Paginator(interaction, embeds);
                    }
                }
                break
            }
            case "user": {
                switch (interaction.options.getSubcommand()) {
                    case "add": {
                        const pex = interaction.options.getString("pex")!;
                        const user = interaction.options.getMember("user");

                        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (!user || user === interaction.member) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDUSER"))]
                        });

                        if (await client.database.permissions.has(user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_ALREADYHASPERMISSIONS", [{ old: "pex", new: pex }]))]
                        });

                        if (!client.pexes.includes(pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDPEX"))]
                        });

                        await client.database.permissions.addPEXToUser({ userID: user.id, guildId: interaction.guildId!, pex })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_ADDPEXTOUSER", [{ old: "pex", new: pex }]))]
                        });
                        break
                    }
                    case "remove": {
                        const pex = interaction.options.getString("pex")!;
                        const user = interaction.options.getMember("user");

                        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_NOPERMISSIONS"))]
                        });

                        if (!user || user === interaction.member) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDUSER"))]
                        });

                        if (!await client.database.permissions.has(user.id, interaction.guildId!, pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_DOESNOTHAVEPERMISSIONS", [{ old: "pex", new: pex }]))]
                        });

                        if (!client.pexes.includes(pex)) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_INVALIDPEX"))]
                        });

                        await client.database.permissions.removePEXFromUser({ userID: user.id, guildId: interaction.guildId!, pex })
                        await interaction.followUp({
                            embeds: [sender.success(lang.get("DATA_COMMANDS_PERMISSIONS_SUCCESS_REMOVEDPEXFROMUSER", [{ old: "pex", new: pex }]))]
                        });
                        break
                    }
                    case "get": {
                        const userData = await client.database.permissions.getUser(interaction.options.getUser("user")!.id, interaction.guildId!);
                        const embeds = [];
                        const formatted = userData?.pexes?.chunk(10) || [];
                        console.log(await client.database.permissions.getUser(interaction.options.getUser("user")!.id, interaction.guildId!))

                        if (!formatted.length) return await interaction.followUp({
                            embeds: [sender.error(lang.get("DATA_COMMANDS_PERMISSIONS_USERNOPERMISSIONS"))]
                        });

                        let i = 0;


                        for (const part of formatted) {
                            const embed = sender.success("", { text: lang.get("DATA_COMMANDS_PERMISSIONS_ALLOWEDUSER") })
                            for (const pex of part) {
                                i++;
                                embed.description += `**#${i}.** \`${pex}\`\n`;
                            }
                            embeds.push(embed);
                        }

                        await Paginator(interaction, embeds);
                    }
                }
                break
            }
        }
    }
}