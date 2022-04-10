import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import ConfirmationPrompt from "../../util/custom/ConfirmationPrompt";
import fetch from "node-fetch";
import Config from "../../data/Config";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
  public readonly name = "mee6";
  public readonly description = lang.getStatic(
    `DESC_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly pexes = [ "commands.mod.mee6migrate"];
  public readonly usage = lang.getStatic(
    `USAGE_${this.name.split("-").join("").toUpperCase()}`
  );
  public readonly options = [
    {
      type: 1,
      name: "levels",
      description: lang.setLanguage("en").get("OPT_MEE6_LEVELS_DESC"),
    },
  ];
  public readonly category = "mod";
  public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
    const sender = new Sender(interaction.channel, guildConfig.language!);
    lang.setLanguage(guildConfig?.language!)
    switch(interaction.options.getSubcommand()){
        case "levels":
                const prompt = await new ConfirmationPrompt(interaction)
                  .setText(
                    lang.get("DATA_COMMANDS_MEE6_WARNING_OVERWRITE")
                  )
                  .onlyForUsers([interaction.user.id])
                  .ask();
                  prompt.on('accepted', async() => {
                      let request = await fetch(
                        `https://mee6.xyz/api/plugins/levels/leaderboard/${interaction.guildId}`, {
                            headers: {
                                'Authorization': Config.KEYS.mee6
                            }
                        }
                      );
                      const data = await request.json();
                      if((data as any).status_code == Number(401)){
                          interaction.followUp({embeds: [sender.error(lang.get("DATA_COMMANDS_MEE6_ERROR_401"))]});
                          return;
                      }
                      for(const player of (data as any).players){
                          client.database.levelling.setLevel(player.id!, interaction.guildId!, player.level);
                          client.database.levelling.setXP(player.id!, interaction.guildId!, player.xp);
                      }
                      interaction.followUp({
                        embeds: [
                          sender.success(
                            lang.get("DATA_COMMANDS_MEE6_FULLFILLED")
                          ),
                        ],
                      });
                  })
            break;
    }
  }
}
