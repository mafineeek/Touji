import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";
import fetch from "node-fetch";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "meme";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.fun.meme" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const memeData = await (await fetch("https://meme-api.herokuapp.com/gimme")).json();

        await interaction.followUp({
            embeds: [
                sender
                .success(`\`r/${memeData.subreddit}\`\n\n**Upvotes:** ${memeData.ups}`)
                .setURL(memeData.postLink)
                .setImage("attachment://meme.png")
            ],
            files: [new MessageAttachment(memeData.url, "meme.png")],
        });
    }
}