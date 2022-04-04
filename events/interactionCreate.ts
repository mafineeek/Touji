import { CommandInteraction, GuildChannel, Interaction, MessageActionRow, MessageButton } from "discord.js";
import { Event as BaseEvent } from "../types";
import Sender from "../util/custom/Sender";
import Bot from "../util/Bot";
import Config from "../data/Config";

export default class Event implements BaseEvent {
    public readonly name = "interactionCreate" as const;
    public async run(client: Bot, interaction: Interaction) {
        const guildConfig = interaction.guild!.config = await client.database.guildConfig.get(interaction.guild!.id);
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const lang = new LanguageHandler(guildConfig.language!);

        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;
            await interaction.deferReply();

            if (!(<GuildChannel>interaction.channel).permissionsFor(interaction.guild!.me!).has(["SEND_MESSAGES"])) return await interaction.followUp({
                embeds: [sender.error(lang.getGlobal("NOPERMISSIONS_SENDMESSAGES"))]
            });

            const cooldownData = await client.database.cooldowns.get(interaction.user.id, command.name);
            if (cooldownData && cooldownData.endAt >= Date.now() && !Config.PERMISSIONS.developer.includes(interaction.user.id)) return await interaction.followUp({
                embeds: [sender.warning(lang.getGlobal("COOLDOWN_MESSAGE", [
                    { old: "time", new: require("dayjs")(cooldownData.endAt - Date.now()).format("mm:ss") }
                ]))]
            });

            const required = [];
            for (const pex of command.pexes) {
                if (await client.database.permissions.has(interaction.user.id, interaction.guildId!, pex) === false) required.push(pex)
            }

            if (
              required.length &&
              !(await client.database.permissions.has(
                interaction.user.id,
                interaction.guildId!,
                '*'
              ))
            )
              return await interaction.followUp({
                embeds: [
                  sender
                    .error(lang.getGlobal("PERMISSIONERROR_TEXT"))
                    .addFields([
                      {
                        name: lang.getGlobal("PERMISSIONERROR_NEEDED"),
                        value: required.join(", "),
                      },
                    ]),
                ],
                ephemeral: true,
              });

            client.logger.warning(`${interaction.user.tag} used command ${command.name}`);

            if (!cooldownData) await client.database.cooldowns.set({
                userID: interaction.user.id,
                commandName: command.name,
                endAt: Date.now() + (command.cooldown ?? 7) * 1000
            })

            setTimeout(() => {
                client.database.cooldowns.delete(interaction.user.id, command.name)
            }, (command.cooldown ?? 7) * 1000)

            await command.run(<CommandInteraction>interaction, await client.database.guildConfig.get(interaction.guildId!)).catch(async (error) => {
                await interaction.followUp({
                    content: `**\` ERROR \`**\n\n${error.stack ?? error}`
                })
            });
        } else if (interaction.isButton() && interaction.customId.startsWith("ticket-")) {
            await interaction.deferUpdate();

            if (
                !interaction.guild!.me?.permissions.has(["MANAGE_CHANNELS"]) ||
                !guildConfig.ticketStatus ||
                (!interaction.customId.startsWith("ticket-close-") &&
                (interaction.guild!.channels.cache.some((channel) => channel.name === `ticket-${interaction.user.id}`) || guildConfig.ticketMessageID !== interaction.message.id))
            ) return;

            switch (interaction.customId.startsWith("ticket-close-")) {
                case true: {
                    const channel = await client.channels.fetch(interaction.customId.split("-")[2]).catch(() => null);

                    if (!channel) return;

                    await channel.delete().catch(() => null);
                    break
                }
                case false: {
                    const ticketChannel = await interaction.guild!.channels.create(`ticket-${interaction.user.id}`, {
                        type: "GUILD_TEXT",
                        parent: guildConfig.ticketCategoryID,
                        permissionOverwrites: [
                            {
                                id: interaction.guild!.roles.everyone,
                                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                            },
                            {
                                id: interaction.user.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                            }
                        ]
                    });

                    ticketChannel.send({
                        content: interaction.user.toString(),
                        embeds: [sender.success(lang.getGlobal("TICKETS_CREATED", [{ old: "user", new: interaction.user.toString() }]))],
                        components: [new MessageActionRow().addComponents([
                            new MessageButton()
                            .setCustomId(`ticket-close-${ticketChannel.id}`)
                            .setEmoji("🔐")
                            .setStyle("DANGER")
                            .setLabel(lang.getGlobal("TICKETS_CLOSE"))
                        ])]
                    });

                    break
                }
            }
        }
    }
}