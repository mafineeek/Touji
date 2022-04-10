import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import ms from "ms";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "giveaway";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.util.giveaway" ];
    public readonly options = [
        {
            type: 3,
            name: "time",
            description: lang.setLanguage("en").get("OPT_GIVEAWAY_TIME_DESC"),
            required: true
        },
        {
            type: 7,
            name: "channel",
            description: lang.setLanguage("en").get("OPT_GIVEAWAY_CHANNEL_DESC"),
            required: true,
            channel_types: [
              0, 5
            ]
        },
        {
            type: 10,
            name: "winner_count",
            description: lang.setLanguage("en").get("OPT_GIVEAWAY_WINNERCOUNT_DESC"),
            required: true
        },
        {
            type: 3,
            name: "prize",
            description: lang.setLanguage("en").get("OPT_GIVEAWAY_PRIZE_DESC")
        }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "util";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const prize = require("discord.js").Util.escapeMarkdown(
            interaction.options.getString("prize") || lang.get("DATA_COMMANDS_GIVEAWAY_PRIZES").randomValue()
        );
        const channel = interaction.options.getChannel("channel");
        const time = interaction.options.getString("time")!;
        const winnerCount = interaction.options.getNumber("winner_count")!;
        if (typeof ms(time)  !== 'number' || ms(time) < 300000 || ms(time) > 1210000000)
          return await interaction.followUp({
            embeds: [
              sender.error(lang.get("DATA_COMMANDS_GIVEAWAY_INVALIDTIME")),
            ],
          });
        else if (channel?.type !== "GUILD_TEXT")
          return await interaction.followUp({
            embeds: [
              sender.error(lang.get("DATA_COMMANDS_GIVEAWAY_INVALIDCHANNEL")),
            ],
          });
        else if (prize.length > 200)
          return await interaction.followUp({
            embeds: [
              sender.error(lang.get("DATA_COMMANDS_GIVEAWAY_TOOLONGPRIZE")),
            ],
          });
        else if (winnerCount > 100)
          return await interaction.followUp({
            embeds: [
              sender.error(
                lang.get("DATA_COMMANDS_GIVEAWAY_TOOLONGWINNERCOUNT")
              ),
            ],
          });

        const message = await channel.send({
            embeds: [sender.success(lang.get("DATA_COMMANDS_GIVEAWAY_STARTED")).addFields([
                { name: lang.get("DATA_COMMANDS_GIVEAWAY_PRIZE"), value: prize },
                { name: lang.get("DATA_COMMANDS_GIVEAWAY_HOST"), value: interaction.user.toString() },
                { name: lang.get("DATA_COMMANDS_GIVEAWAY_TIME"), value: `<t:${(Date.now() / 1000 + ms(time) / 1000).toFixed()}:F>` },
                { name: lang.get("DATA_COMMANDS_GIVEAWAY_WINNERS"), value: winnerCount.toString() }
            ])]
        });

        await message.react("🎉");

        await client.database.giveaways.create({
            guildId: interaction.guild!.id,
            messageID: message.id,
            channelID: channel.id,
            prize: prize,
            ended: false,
            winnerCount: winnerCount,
            endAt: Date.now() + ms(time)
        })

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_GIVEAWAY_CREATEDIN", [{ old: "channel", new: channel.toString() }]))]
        })
    }
}