import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "set-level";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.levelling.setlevel" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_SETLEVEL_USER_DESC"),
        required: true
    }, {
        type: 10,
        name: "new_level",
        description: lang.setLanguage("en").get("OPT_SETLEVEL_NEWLEVEL_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "levelling";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");
        const newLevel = interaction.options.getNumber("new_level")!;

        if (!guildConfig.levellingEnabled) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETLEVEL_DISABLED"))]
        });

        if (!user || user.user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETLEVEL_INVALIDUSER"))]
        });

        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.levelling.setlevel.modify")) return await interaction.followUp({
            embeds: [sender.permissionError(
                ["commands.levelling.setlevel.modify"],
                lang.get("DATA_COMMANDS_SETLEVEL_NOUSERPERMISSIONS")
            )]
        })

        if (isFloat(newLevel) || newLevel < 0 || newLevel > 100) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETLEVEL_INVALIDLEVEL"))]
        });

        await client.database.levelling.setLevel(
            user.id,
            interaction.guildId!,
            newLevel
        );
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_SETLEVEL_SUCCESS", [{ old: "user", new: user.toString() }, { old: "level", new: newLevel }]))]
        })
    }
}