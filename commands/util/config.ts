//@ts-nocheck

import { CommandInteraction, Util } from "discord.js";
import { Command as BaseCommand, GuildConfig, Language } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
  public readonly name = "config";
  public readonly description = lang.getStatic(
    `DESC_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly pexes = ["global.access", "commands.util.config"];
  public readonly options = [
    {
      type: 2,
      name: "modify",
      description: lang.setLanguage("en").get("OPT_CONFIG_MODIFY_DESC"),
      options: [
        {
          type: 1,
          name: "language",
          description: lang.setLanguage("en").get("OPT_CONFIG_LANGUAGE_DESC"),
          options: [
            {
              type: 3,
              name: "language",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_LANGUAGE_DESC"),
              choices: [
                { name: "PL", value: "pl" },
                { name: "EN", value: "en" },
              ],
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "mod_log_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_MODLOGCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          type: 1,
          name: "birthday_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_BIRTHDAYCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          type: 1,
          name: "welcome_status",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_WELCOMESTATUS_DESC"),
          options: [
            {
              type: 5,
              name: "status",
              description: lang.setLanguage("en").get("OPT_CONFIG_STATUS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "welcome_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_WELCOMECHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          type: 1,
          name: "welcome_message",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_WELCOMEMESSAGE_DESC"),
          options: [
            {
              type: 3,
              name: "content",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_MESSAGE_DESC"),
            },
          ],
        },
        {
          type: 1,
          name: "goodbye_status",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_GOODBYESTATUS_DESC"),
          options: [
            {
              type: 5,
              name: "status",
              description: lang.setLanguage("en").get("OPT_CONFIG_STATUS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "goodbye_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_GOODBYECHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          type: 1,
          name: "goodbye_message",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_GOODBYEMESSAGE_DESC"),
          options: [
            {
              type: 3,
              name: "content",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_MESSAGE_DESC"),
            },
          ],
        },
        {
          type: 1,
          name: "starboard_status",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_STARBOARDSTATUS_DESC"),
          options: [
            {
              type: 5,
              name: "status",
              description: lang.setLanguage("en").get("OPT_CONFIG_STATUS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "starboard_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_STARBOARDCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              required: true,
              channel_types: [0, 5],
            },
          ],
        },
        {
          type: 1,
          name: 'ghostping_alert',
          description: lang.setLanguage("en").get("OPT_CONFIG_GHOSTPING_DESC"),
        },
        {
          type: 1,
          name: "starboard_stars",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_STARBOARDSTARS_DESC"),
          options: [
            {
              type: 10,
              name: "stars",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_STARBOARDSTARS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "snipe_status",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_SNIPESTATUS_DESC"),
          options: [
            {
              type: 5,
              name: "status",
              description: lang.setLanguage("en").get("OPT_CONFIG_STATUS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "levelling_status",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_LEVELLINGSTATUS_DESC"),
          options: [
            {
              type: 5,
              name: "status",
              description: lang.setLanguage("en").get("OPT_CONFIG_STATUS_DESC"),
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "levelling_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_LEVELLINGCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
            },
          ],
          channel_types: [0, 5],
        },
        {
          type: 1,
          name: "levelling_message",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_LEVELLINGMESSAGE_DESC"),
          options: [
            {
              type: 3,
              name: "content",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_MESSAGE_DESC"),
            },
          ],
        },
        {
          type: 1,
          name: "levelling_needed_xp",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_LEVELLINGNEEDEDXP_DESC"),
          options: [
            {
              type: 10,
              name: "xp",
              description: lang.setLanguage("en").get("OPT_CONFIG_XP_DESC"),
            },
          ],
        },
        {
          type: 1,
          name: "levelling_blocked_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_LEVELLINGBLOCKEDCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: 'Configure channels where XP can not be earned',
            },
          ],
        },
        {
          type: 1,
          name: "suggestions_channel",
          description: lang
            .setLanguage("en")
            .get("OPT_CONFIG_SUGGESTIONSCHANNEL_DESC"),
          options: [
            {
              type: 7,
              name: "channel",
              description: lang
                .setLanguage("en")
                .get("OPT_CONFIG_CHANNEL_DESC"),
              channel_types: [0, 5],
            },
          ],
        },
      ],
    },
    {
      type: 1,
      name: "display",
      description: lang.setLanguage("en").get("OPT_CONFIG_DISPLAY_DESC"),
    },
    {
      type: 1,
      name: "variables",
      description: lang.setLanguage("en").get("OPT_CONFIG_VARIABLES_DESC"),
    },
  ];
  public readonly usage = lang.getStatic(
    `USAGE_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly category = "util";
  public readonly cooldown = 10;
  public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
    const sender = new Sender(interaction.channel, guildConfig.language!);

    lang.setLanguage(guildConfig.language!);

    switch (
      interaction.options.getSubcommandGroup(false) ||
      interaction.options.getSubcommand(false)
    ) {
      case "modify": {
        switch (interaction.options.getSubcommand(false)) {

          case "ghostping_alert": {
            const data = await client.database.guildConfig.get(interaction.guildId);
            await client.database.guildConfig.set(interaction.guildId, {
              ghostpingAlert: !data.ghostpingAlert,
            });
            await interaction.followUp({
              embeds: [
                sender.success(lang.get('DATA_COMMANDS_CONFIG_UPDATEDSTATUS', [
                  {
                    old: 'changed',
                    new: data.ghostping_alert ? 'Disabled' : 'Enabled',
                  }
                ]
                ))
              ]
            })
            break;
          }

          case "language": {
            const language = interaction.options.getString("language")!;
            if (guildConfig?.language === language)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_THESAMELANGUAGE")
                  ),
                ],
              });

            sender.setLanguage(language as Language);
            lang.setLanguage(language as Language);

            await client.database.guildConfig.set(interaction.guild!.id, {
              language: language,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_LANGUAGE")
                        .toLowerCase(),
                    },
                    { old: "new", new: language.toUpperCase() },
                  ])
                ),
              ],
            });
            break;
          }
          case "suggestions_channel": {
            const channel = interaction.options.getChannel("channel");
            if (
              channel &&
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!)
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              suggestionChannelID: channel?.id || null,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_SUGGESTIONSCHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel?.toString() || "N/A" },
                  ])
                ),
              ],
            });
            break;
          }
          case "levelling_status": {
            await client.database.guildConfig.set(interaction.guild!.id, {
              levellingEnabled: interaction.options.getBoolean("status")!,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_LEVELLINGSTATUS")
                        .toLowerCase(),
                    },
                    {
                      old: "new",
                      new: interaction.options.getBoolean("status")!,
                    },
                  ])
                ),
              ],
            });
            break;
          }
          case "levelling_blocked_channel": {
            const channel = interaction.options.getChannel("channel");
            if (
              channel &&
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!)
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });
              let data = await client.database.guildConfig.get(interaction.guild!.id)
              data.levelIgnoreChannels = data.levelIgnoreChannels ?? []
              await interaction.followUp({
                embeds: [
                  sender.success(
                    lang.get("DATA_COMMANDS_CONFIG_NOLEVELLINGCHANNEL", [
                      {
                        old: "action",
                        new: data.levelIgnoreChannels.includes(channel?.id) ? "Removed" : "Added",
                      },
                      { old: "channel", new: channel?.toString() || "N/A" },
                    ])
                  ),
                ],
              });
              if(data.levelIgnoreChannels?.includes(channel?.id)) {
                await client.database.guildConfig.set(interaction.guild!.id, {
                  levelIgnoreChannels: (data.levelIgnoreChannels||[]).filter(
                    (c) => c !== channel?.id
                  ),
                });
              }else{
                (data.levelIgnoreChannels || []).push(channel?.id)
                await client.database.guildConfig.set(interaction.guild!.id, {
                  levelIgnoreChannels: data.levelIgnoreChannels,
                })
              }
            break;
          }
          case "levelling_channel": {
            const channel = interaction.options.getChannel("channel");
            if (
              channel &&
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!)
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              levelChannelID: channel?.id || null,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_LEVELLINGCHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel?.toString() || "N/A" },
                  ])
                ),
              ],
            });
            break;
          }
          case "levelling_message": {
            const message =
              interaction.options.getString("content") ||
              "{{user}} reached new level {{level}}";
            if (message.length > 300)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_INVALIDLEVELLINGMESSAGE")
                  ),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              levelUpdateMessage: message,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_LEVELLINGMESSAGE")
                        .toLowerCase(),
                    },
                    { old: "new", new: message },
                  ])
                ),
              ],
            });
            break;
          }
          case "levelling_needed_xp": {
            const xp = interaction.options.getNumber("xp")!;
            if (isFloat(xp) || xp < 10 || xp > 1000)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_INVALIDLEVELLINGNEEDEDXP")
                  ),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              levelNeededXP: xp,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_LEVELLINGNEEDEDXP")
                        .toLowerCase(),
                    },
                    { old: "new", new: xp },
                  ])
                ),
              ],
            });
            break;
          }
          case "snipe_status": {
            await client.database.guildConfig.set(interaction.guild!.id, {
              snipeEnabled: interaction.options.getBoolean("status")!,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_SNIPESTATUS")
                        .toLowerCase(),
                    },
                    {
                      old: "new",
                      new: interaction.options.getBoolean("status")!,
                    },
                  ])
                ),
              ],
            });
            break;
          }
          case "starboard_status": {
            await client.database.guildConfig.set(interaction.guild!.id, {
              starboardStatus: interaction.options.getBoolean("status")!,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_STARBOARDSTATUS")
                        .toLowerCase(),
                    },
                    {
                      old: "new",
                      new: interaction.options.getBoolean("status")!,
                    },
                  ])
                ),
              ],
            });
            break;
          }
          case "starboard_channel": {
            const channel = interaction.options.getChannel("channel")!;
            if (
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!) ||
              channel.guildId !== interaction.guildId
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              starboardChannelID: channel.id,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_STARBOARDCHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel.toString() },
                  ])
                ),
              ],
            });
            break;
          }
          case "starboard_stars": {
            const stars = interaction.options.getNumber("stars")!;
            if (stars < 1 || stars > interaction.guild!.memberCount)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_INVALIDSTARCOUNT", [
                      { old: "members", new: interaction.guild!.memberCount },
                    ])
                  ),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              starboardStars: stars,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_STARBOARDSTARCOUNT")
                        .toLowerCase(),
                    },
                    { old: "new", new: stars },
                  ])
                ),
              ],
            });
            break;
          }
          case "welcome_status": {
            await client.database.guildConfig.set(interaction.guild!.id, {
              welcomeStatus: interaction.options.getBoolean("status")!,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_WELCOMESTATUS")
                        .toLowerCase(),
                    },
                    {
                      old: "new",
                      new: interaction.options.getBoolean("status")!,
                    },
                  ])
                ),
              ],
            });
            break;
          }
          case "welcome_channel": {
            const channel = interaction.options.getChannel("channel")!;
            if (
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!) ||
              channel.guildId !== interaction.guildId
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              welcomeChannelID: channel.id,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_WELCOMECHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel.toString() },
                  ])
                ),
              ],
            });
            break;
          }
          case "welcome_message": {
            const message =
              interaction.options.getString("content") ||
              "Hello {{user}}! Welcome on {{guild:name}}!";
            if (message.length > 300)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_INVALIDWELCOMEMESSAGE")
                  ),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              welcomeMessage: message,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_WELCOMEMESSAGE")
                        .toLowerCase(),
                    },
                    { old: "new", new: message },
                  ])
                ),
              ],
            });
            break;
          }
          case "goodbye_status": {
            await client.database.guildConfig.set(interaction.guild!.id, {
              goodbyeStatus: interaction.options.getBoolean("status")!,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_GOODBYESTATUS")
                        .toLowerCase(),
                    },
                    {
                      old: "new",
                      new: interaction.options.getBoolean("status")!,
                    },
                  ])
                ),
              ],
            });
            break;
          }
          case "goodbye_channel": {
            const channel = interaction.options.getChannel("channel")!;
            if (
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!) ||
              channel.guildId !== interaction.guildId
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              goodbyeChannelID: channel.id,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_GOODBYECHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel.toString() },
                  ])
                ),
              ],
            });
            break;
          }
          case "goodbye_message": {
            const message =
              interaction.options.getString("content") ||
              "{{user}} left {{guild:name}}...";
            if (message.length > 300)
              return await interaction.followUp({
                embeds: [
                  sender.error(
                    lang.get("DATA_COMMANDS_CONFIG_INVALIDGOODBYEMESSAGE")
                  ),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              goodbyeMessage: message,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_GOODBYEMESSAGE")
                        .toLowerCase(),
                    },
                    { old: "new", new: message },
                  ])
                ),
              ],
            });
            break;
          }
          case "mod_log_channel": {
            const channel = interaction.options.getChannel("channel")!;
            if (
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!) ||
              channel.guildId !== interaction.guildId
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              modLogChannelID: channel.id,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_MODLOGCHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel.toString() },
                  ])
                ),
              ],
            });
            break;
          }
          case "birthday_channel": {
            const channel = interaction.options.getChannel("channel")!;
            if (
              !["GUILD_TEXT", "GUILD_NEWS"].includes(channel?.type!) ||
              channel.guildId !== interaction.guildId
            )
              return await interaction.followUp({
                embeds: [
                  sender.error(lang.get("DATA_COMMANDS_CONFIG_INVALIDCHANNEL")),
                ],
              });

            await client.database.guildConfig.set(interaction.guild!.id, {
              birthdayChannelID: channel.id,
            });
            await interaction.followUp({
              embeds: [
                sender.success(
                  lang.get("DATA_COMMANDS_CONFIG_CHANGED", [
                    {
                      old: "changed",
                      new: lang
                        .get("DATA_COMMANDS_CONFIG_BIRTHDAYSCHANNEL")
                        .toLowerCase(),
                    },
                    { old: "new", new: channel.toString() },
                  ])
                ),
              ],
            });
            break;
          }
        }
        break;
      }
      case "display": {
        await interaction.followUp({
          embeds: [
            sender.success().addFields([
              {
                name: lang.get("DATA_COMMANDS_CONFIG_LANGUAGE"),
                value: guildConfig.language!.toUpperCase(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_WELCOMESTATUS"),
                value: lang.resolveEnabled(
                  guildConfig.welcomeStatus?.toString()
                ),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_WELCOMECHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.welcomeChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_WELCOMEMESSAGE"),
                value:
                  Util.escapeMarkdown(
                    guildConfig.welcomeMessage || ""
                  ).truncate(100) || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_GOODBYESTATUS"),
                value: lang.resolveEnabled(
                  guildConfig.goodbyeStatus?.toString()
                ),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_GOODBYECHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.goodbyeChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_GOODBYEMESSAGE"),
                value:
                  Util.escapeMarkdown(
                    guildConfig.goodbyeMessage || ""
                  ).truncate(100) || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_MODLOGCHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.modLogChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_STARBOARDCHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.starboardChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_STARBOARDSTARCOUNT"),
                value: guildConfig.starboardStars?.toString() || "1",
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_BIRTHDAYSCHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.birthdayChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_SNIPESTATUS"),
                value: lang.resolveEnabled(
                  guildConfig.snipeEnabled?.toString()
                ),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_STARBOARDBANS"),
                value:
                  (
                    await guildConfig.starboardBannedUsers?.mapAsync(
                      async (id: string) =>
                        `\`${(await client.users.fetch(id))?.tag}\``
                    )
                  )?.join(", ") || lang.resolveUnknown(),
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_AUTOROLES"),
                value: "**` /autorole list `**",
              },
              {
                name: lang.get("DATA_COMMANDS_CONFIG_SUGGESTIONSCHANNEL"),
                value:
                  interaction
                    .guild!.channels.cache.get(guildConfig.suggestionChannelID!)
                    ?.toString() || lang.resolveUnknown(),
              },
            ]),
          ],
        });
        break;
      }
      case "variables": {
        await interaction.followUp({
          embeds: [sender.success(lang.get("DATA_COMMANDS_CONFIG_VARIABLES"))],
        });
        break;
      }
    }
  }
}
