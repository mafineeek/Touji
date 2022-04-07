import {
    ButtonInteraction, CommandInteraction, GuildMember,
    MessageActionRow, MessageButton, Message
} from "discord.js";
import Sender from "../custom/Sender";

export const checkResult = function (playerChoice: string, opponentChoice: string) {
    switch (playerChoice) {
        case "rock": {
            switch (opponentChoice) {
                case "scissors": return true;
                case "rock": return "tie";
                case "paper": return false;
            }
            break
        }
        case "paper": {
            switch (opponentChoice) {
                case "scissors": return false;
                case "rock": return true;
                case "paper": return "tie";
            }
            break
        }
        case "scissors": {
            switch (opponentChoice) {
                case "scissors": return "tie";
                case "rock": return false;
                case "paper": return true;
            }
            break
        }
    }
}

export default async function createRPS(interaction: CommandInteraction, opponent: GuildMember) {
    let actualTurn = interaction.member;

    const sender = new Sender(interaction.channel, interaction.guild!.config.language!);
    const filter = (i: ButtonInteraction) => { return ["rock", "paper", "scissors"].includes(i.customId) }

    const baseMessage = <Message>await interaction.editReply({
        embeds: [sender.success(LanguageHandler.get(
            "DATA_COMMANDS_RPS_MOVE",
            [{ old: "user", new: interaction.user.toString() }],
            interaction.guild!.config.language!
        ))],
        components: [new MessageActionRow().addComponents([
            new MessageButton().setStyle("DANGER").setCustomId("rock").setEmoji("🪨"),
            new MessageButton().setStyle("DANGER").setCustomId("paper").setEmoji("📰"),
            new MessageButton().setStyle("DANGER").setCustomId("scissors").setEmoji("✂")
        ])],
    });

    const collector = baseMessage.createMessageComponentCollector({ filter, time: 90000, componentType: 'BUTTON' });
    collector.on("collect", async (collected: ButtonInteraction) => {
        if (collected.user.id !== actualTurn.id) return await collected.deferUpdate();
        if (actualTurn === opponent) return collector.stop();

        await collected.deferUpdate();
        await interaction.editReply({
            embeds: [baseMessage.embeds[0].setDescription(LanguageHandler.get(
                "DATA_COMMANDS_RPS_MOVE",
                [{old: "user", new: opponent.toString()}],
                interaction.guild!.config.language!
            ))], components: baseMessage.components
        }); actualTurn = opponent;
    });

    collector.on("end", async (collected) => {
        if (collected.size !== 2) return;

        const results = checkResult(collected.toArray()[0].customId, collected.toArray()[1].customId)
        await interaction.editReply({
            embeds: [baseMessage.embeds[0].setDescription(results === "tie" ? LanguageHandler.get(
                "DATA_COMMANDS_RPS_TIE",
                [],
                interaction.guild!.config.language!
            ) : LanguageHandler.get(
                "DATA_COMMANDS_RPS_RESULTS",
                [
                    {
                        old: "loser", new: results ? interaction.user : opponent
                    },
                    {
                        old: "winner", new: results ? opponent : interaction.user
                    }
                ],
                interaction.guild!.config.language!
            ))], components: []
        });
    })
}