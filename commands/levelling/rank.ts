import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { Rank } from "canvacord";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import LevellingData from "../../util/database/types/LevellingData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "rank";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.levelling.rank" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_RANK_USER_DESC")
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "levelling";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getUser("user") || interaction.user;

        if (!guildConfig.levellingEnabled) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_RANK_DISABLED"))]
        });

        if (user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_RANK_BOT"))]
        });

        const userData = await client.database.levelling.getUser(user.id, interaction.guildId!);
        const leaderboard = await client.database.levelling.getAll(interaction.guildId!);
        const position = leaderboard.findIndex((data: LevellingData) => data.userID === user.id);
        const rankCard = await new Rank()
        .setAvatar(user.displayAvatarURL({ format: "png" }))
        .setCurrentXP(userData.xp)
        .setRequiredXP(guildConfig.levelNeededXP ?? 200)
        .setLevel(userData.level, "Level")
        .setUsername(user.username)
        .setDiscriminator(user.discriminator)
        .setProgressBar(["#798fff", "#8c9eff", "#91a3ff"], "GRADIENT", true)
        .setStatus("dnd", true)
        .setRank(position === -1 ? 0 : position + 1, "Position", !(position + 1 === -1))
        .build({})

        await interaction.followUp({
            embeds: [sender.success().setImage("attachment://card.png")],
            files: [new MessageAttachment(rankCard, "card.png")]
        });
    }
}