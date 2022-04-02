import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import ConfirmationPrompt from "../../util/custom/ConfirmationPrompt";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "delete-item";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.deleteitem" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_DELETEITEM_ID_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const id = interaction.options.getNumber("id")!.toString();
        const item = await client.database.economy.getItemById(interaction.guildId!, id);

        lang.setLanguage(guildConfig.language!);

        if (!item) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_DELETEITEM_NONE"))]
        });

        const prompt = await new ConfirmationPrompt(interaction)
        .setText(lang.get("DATA_COMMANDS_DELETEITEM_AREYOUSURE", [{ old: "id", new: id }]))
        .onlyForUsers([interaction.user.id])
        .ask();

        prompt.on("accepted", async () => {
            await client.database.economy.deleteById(interaction.guildId!, id);
            await interaction.editReply({
                embeds: [sender.success(lang.get("DATA_COMMANDS_DELETEITEM_SUCCESS", [{ old: "id", new: id }]))],
                components: []
            })
        })
    }
}