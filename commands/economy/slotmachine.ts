import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export const checkWin = (board: [string, string, string]) => { return (board[0] === board[1]) || (board[1] === board[2]) };
export default class Command implements BaseCommand {
    public readonly name = "slot-machine";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.slotmachine" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 600;
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);
        const amount = Math.randomInteger(15, 350);

        lang.setLanguage(guildConfig.language!);

        const slots = "🍊🍎🍐".splitEmojis();
        const board = Array.fill(3, () => slots.random());

        await interaction.followUp({
            embeds: [sender.warning(lang.get("DATA_COMMANDS_SLOTMACHINE_WAITING", [
                { old: "board", new: board.shuffle().join(" ") }
            ]))]
        });

        if (checkWin(board)) {
            await client.database!.economy.set(interaction.user.id, interaction.guildId!, { cash: userData.cash + amount });
            await interaction.editReply({
                embeds: [sender.success(lang.get("DATA_COMMANDS_SLOTMACHINE_WIN", [{ old: "amount", new: amount }, { old: "board", new: board.join(" ") }]))]
            })
        } else {
            await client.database!.economy.set(interaction.user.id, interaction.guildId!, { cash: userData.cash - amount });
            await interaction.editReply({
                embeds: [sender.error(lang.get("DATA_COMMANDS_SLOTMACHINE_LOST", [{ old: "amount", new: amount }, { old: "board", new: board.join(" ") }]), { text: "Uhh..." })]
            })
        }
    }
}