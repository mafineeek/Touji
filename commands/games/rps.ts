import { CommandInteraction, Message } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";
import createRPS from "../../util/games/RPS";
import ConfirmationPrompt from "../../util/custom/ConfirmationPrompt";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
  public readonly name = "rps";
  public readonly description = lang.getStatic(
    `DESC_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly pexes = [ "commands.games.rps"];
  public readonly options = [
    {
      type: 6,
      name: "user",
      description: lang.setLanguage("en").get("OPT_RPS_USER_DESC"),
      required: true,
    },
  ];
  public readonly usage = lang.getStatic(
    `USAGE_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly category = "games";
  public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
    const sender = new Sender(interaction.channel, guildConfig.language!);
    lang.setLanguage(guildConfig.language!);

    const user = interaction.options.getMember("user");
    if (!user || user.user.bot)
      return await interaction.followUp({
        embeds: [sender.error(lang.get("DATA_COMMANDS_RPS_INVALIDUSER"))],
      });
    else if (interaction.member === user)
      return await interaction.followUp({
        embeds: [sender.error(lang.get("DATA_COMMANDS_RPS_WITHUS"))],
      });
    else if (
      ["offline", "invisible"].includes((await user.fetch()).presence?.status!)
    )
      return await interaction.followUp({
        embeds: [sender.error(lang.get("DATA_COMMANDS_RPS_CANNOTPLAY"))],
      });

    await interaction.channel
      .send({ content: `<@${user.id}>` })
      .then((msg: Message) => {
        setTimeout(() => {
          msg.delete();
        }, 500);
      });

    const prompt = await new ConfirmationPrompt(interaction)
      .setText(
        lang.get("DATA_COMMANDS_RPS_WAITING", [
          { old: "user", new: user.toString() },
        ])
      )
      .onlyForUsers([user.id])
      .ask();

    prompt.on("accepted", () => createRPS(interaction, user));
  }
}
