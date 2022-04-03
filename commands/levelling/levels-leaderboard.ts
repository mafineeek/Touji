import { CommandInteraction} from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import { MessageActionRow, MessageButton } from "discord.js";
import Paginator from "../../util/Paginator";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "levels-leaderboard";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.levelling.levelsleaderboard" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`)
    public readonly category = "levelling";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const leaderboard = await client.database.levelling.getAll(interaction.guildId!);

        if (!guildConfig.levellingEnabled) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_LEVELSLEADERBOARD_DISABLED"))]
        });

        if (!leaderboard.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_LEVELSLEADERBOARD_NOLEADERBOARD"))]
        });

        // const embeds = [];
        // const formatted = leaderboard.chunk(10);

        // let i = 0;

        // for (const part of formatted) {
        //     const embed = sender.success("")
        //     for (const { userID, level, xp } of part) {
        //         i++;
        //         embed.description += `**#${i}.** \`${(await client.users.fetch(userID))?.tag || lang.resolveUnknown()}\` - ${level} level (\`${xp}xp\`)\n`;
        //     }
        //     embeds.push(embed);
        // }

        // await Paginator(interaction, embeds);
        interaction.followUp({
          content: lang.get('DATA_COMMANDS_LEVELSLEADERBOARD_ONLINEOUTNOW'),
          components: [
              new MessageActionRow()
              .addComponents(
                  new MessageButton()
                  .setStyle('LINK')
                  .setURL(`https://toujibot.com/leaderboard/${interaction.guildId}`)
                  .setLabel(`Visit the leaderboard`)
              )
          ]
        });
    }
}