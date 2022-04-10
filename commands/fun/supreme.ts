import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "supreme";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.supreme" ];
    public readonly options = [{
        type: 3,
        name: "text",
        description: lang.setLanguage("en").get("OPT_SUPREME_TEXT_DESC"),
        required: true
    }, {
        type: 3,
        name: "mode",
        description: lang.setLanguage("en").get("OPT_SUPREME_MODE_DESC"),
        choices: [
            { name: "dark", value: "dark" },
            { name: "light", value: "light" }
        ]
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const text = interaction.options.getString("text")!;

        if (text.length > 100) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SUPREME_TOOLONG"))]
        });

        const response = await client.helpers.request(
            `https://api.alexflipnote.dev/supreme?text=${encodeURIComponent(text)}&${interaction.options.getString("mode") || "red"}=true`,
            { headers: { Authorization: client.helpers.getAPIToken("alexFlipnote") }
        });

        await interaction.followUp({
            embeds: [sender.success().setImage("attachment://image.png")],
            files: [new MessageAttachment(Buffer.from(await response.arrayBuffer()), "image.png")]
        });
    }
}