import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "cat";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.cat" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const response = await client.helpers.request(
            "https://api.alexflipnote.dev/cats",
            { headers: { Authorization: client.helpers.getAPIToken("alexFlipnote") }},
            { json: true }
        )

        await interaction.followUp({
            embeds: [sender.success().setImage("attachment://image.png")],
            files: [new MessageAttachment(response?.file, "image.png")]
        });
    }
}