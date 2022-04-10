import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "pornhub";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.fun.pornhub" ];
    public readonly options = [{
        type: 3,
        name: "text_one",
        description: lang.setLanguage("en").get("OPT_PORNHUB_TEXTONE_DESC"),
        required: true
    }, {
        type: 3,
        name: "text_two",
        description: lang.setLanguage("en").get("OPT_PORNHUB_TEXTTWO_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const textOne = interaction.options.getString("text_one")!;
        const textTwo = interaction.options.getString("text_two")!;

        if (textOne.length > 100 || textTwo.length > 100) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_PORNHUB_TOOLONG"))]
        });

        const response = await client.helpers.request(
            `https://api.alexflipnote.dev/pornhub?text=${encodeURIComponent(textOne)}&text2=${encodeURIComponent(textTwo)}`,
            { headers: { Authorization: client.helpers.getAPIToken("alexFlipnote") }
        });

        await interaction.followUp({
            embeds: [sender.success().setImage("attachment://image.png")],
            files: [new MessageAttachment(Buffer.from(await response.arrayBuffer()), "image.png")]
        });
    }
}