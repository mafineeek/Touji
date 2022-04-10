import { ContextMenuInteraction } from "discord.js";
import { ContextMenuCommand as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly type = 2;
    public readonly name = "rob";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.rob" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: ContextMenuInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");

        lang.setLanguage(guildConfig.language!);

        if (!user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ROB_UNKNOWNUSER"))]
        })

        else if (user === interaction.member) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ROB_WITHUS"))]
        })

        else if (user.user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ROB_BOT"))]
        })

        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);
        const providedUserData = await client.database.economy.getUser(user.id, interaction.guildId!);

        if (providedUserData.cash < 10) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ROB_NOTENOUGHMONEY"))]
        })

        const percentage = Math.random();
        const amount = Math.randomInteger(1, providedUserData.cash);

        if (percentage < 0.5) {
            await client.database.economy.set(
                interaction.user.id, interaction.guildId!,
                { cash: userData.cash - amount }
            );
            await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_ROB_FAIL", [
                    { old: "user", new: user.toString() },
                    { old: "change", new: amount.toString() }
                ]))]
            })
        } else {
            await client.database.economy.set(
                user.id, interaction.guildId!,
                { cash: providedUserData.cash - amount }
            );
            await client.database.economy.set(
                interaction.user.id, interaction.guildId!,
                { cash: userData.cash + amount }
            );
            await interaction.followUp({
                embeds: [sender.success(lang.get("DATA_COMMANDS_ROB_SUCCESS", [
                    { old: "user", new: user.toString() },
                    { old: "change", new: amount.toString() }
                ]))]
            })
        }
    }
}