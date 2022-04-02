import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import ConfirmationPrompt from "../../util/custom/ConfirmationPrompt";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "deletecase";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.deletecase" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_DELETECASE_ID_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const id = interaction.options.getNumber("id")?.toString();
        const caseData = await client.database.case.get(id!)

        lang.setLanguage(guildConfig.language!);

        if (!caseData) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_DELETECASE_INVALID"))]
        });

        if (caseData.userID === interaction.user.id) return await interaction.followUp({
            embeds: [sender.permissionError(
                ["commands.mod.deletecase.deleteown"],
                lang.get("DATA_COMMANDS_DELETECASE_OWN")
            )]
        })

        const prompt = await new ConfirmationPrompt(interaction)
        .setText(lang.get("DATA_COMMANDS_DELETECASE_PROMPTTEXT", [ { old: "id", new: id }]))
        .onlyForUsers([interaction.user.id])
        .ask();

        prompt.on("accepted", async () => {
            await interaction.editReply({
                embeds: [sender.success(lang.get("DATA_COMMANDS_DELETECASE_SUCCESS", [ { old: "id", new: id } ]))],
                components: []
            });
            await client.database.case.remove(id!);
        })
    }
}