import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "trash";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.fun.trash" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_TRASH_USER_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "fun";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);

        lang.setLanguage(guildConfig.language!);

        const user = interaction.options.getUser("user")!;

        const response = await client.helpers.request(
            `https://api.alexflipnote.dev/trash?face=${interaction.user.displayAvatarURL()}&trash=${user.displayAvatarURL()}`,
            { headers: { Authorization: client.helpers.getAPIToken("alexFlipnote") }
        });

        await interaction.followUp({
            embeds: [sender.success().setImage("attachment://image.png")],
            files: [new MessageAttachment(Buffer.from(await response.arrayBuffer()), "image.png")]
        });
    }
}