import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "set-xp";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.levelling.setxp" ];
    public readonly options = [{
        type: 6,
        name: "user",
        description: lang.setLanguage("en").get("OPT_SETXP_USER_DESC"),
        required: true
    }, {
        type: 10,
        name: "new_xp",
        description: lang.setLanguage("en").get("OPT_SETXP_NEWXP_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "levelling";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        lang.setLanguage(guildConfig.language!);

        const sender = new Sender(interaction.channel, guildConfig.language!);
        const user = interaction.options.getMember("user");
        const newXP = interaction.options.getNumber("new_xp")!;

        if (!guildConfig.levellingEnabled) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETXP_DISABLED"))]
        });

        if (!user || user.user.bot) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETXP_INVALIDUSER"))]
        });

        if (!await client.database.permissions.has(interaction.user.id, interaction.guildId!, "commands.levelling.setxp.modify")) return await interaction.followUp({
            embeds: [sender.permissionError(
                ["commands.levelling.setxp.modify"],
                lang.get("DATA_COMMANDS_SETXP_NOUSERPERMISSIONS")
            )]
        })

        if (isFloat(newXP) || newXP < 0 || newXP > (guildConfig.levelNeededXP ?? 200)) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SETXP_INVALIDXP", [{ old: "guildRequiredXP", new: (guildConfig.levelNeededXP ?? 200) }]))]
        });

        await client.database.levelling.setXP(
            user.id,
            interaction.guildId!,
            newXP
        );
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_SETXP_SUCCESS", [{ old: "user", new: user.toString() }, { old: "xp", new: newXP }]))]
        })
    }
}