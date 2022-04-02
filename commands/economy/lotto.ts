import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "lotto";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.lotto" ];
    public readonly options = Array.fill(6, (i: number) => i).map((i: number) => {
        return {
            type: 10,
            name: `number_${i}`,
            description: lang.setLanguage("en").get("OPT_LOTTO_NUMBER_DESC", [{ old: "number", new: i }]),
            required: true
        }
    });
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 1800;
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);
        const providedNumbers = interaction.options.data.map((option) => option.value as number);

        lang.setLanguage(guildConfig.language!);

        if (providedNumbers.some((number: number) => number < 0 || number > 100 || isFloat(number))) {
            await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_LOTTO_INVALIDNUMBER"))]
            });
            return await client.database.cooldowns.delete(interaction.user.id, this.name);
        }

        if (!providedNumbers.isUnique()) {
            await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_LOTTO_REPEATING"))]
            });
            return await client.database.cooldowns.delete(interaction.user.id, this.name);
        }

        const numbers = Array.fill(69, (i: number) => i).shuffle().slice(0, 6);
        const matching = providedNumbers.filter((number: number) => numbers.some((i: number) => i === number));

        if (matching.length) {
            await client.database.economy.set(interaction.user.id, interaction.guildId!, { bank: userData.bank + (39 * matching.length) })
            await interaction.followUp({
                embeds: [sender.warning(lang.get("DATA_COMMANDS_LOTTO_SUCCESS", [
                    { old: "matching", new: matching.length },
                    { old: "numbers", new: numbers.join(", ") },
                    { old: "amount", new: 39 * matching.length }
                ]))]
            })
        } else {
            const amount = Math.randomInteger(25, 455);

            await client.database.economy.set(interaction.user.id, interaction.guildId!, { bank: userData.bank - amount })
            await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_LOTTO_LOST", [
                    { old: "matching", new: matching.length },
                    { old: "numbers", new: numbers.join(", ") },
                    { old: "amount", new: amount }
                ]), { text: "Uhh..." })]
            });
        }
    }
}