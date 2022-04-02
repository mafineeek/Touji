import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "item-info";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.iteminfo" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_ITEMINFO_ID_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const item = await client.database.economy.getItemById(interaction.guildId!, interaction.options.getNumber("id")!.toString());

        lang.setLanguage(guildConfig.language!);

        if (!item) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_ITEMINFO_NONE"))]
        });

        await interaction.followUp({
            embeds: [sender.success().addFields([
                { name: lang.getGlobal("STATIC_NAME"), value: item.name },
                { name: lang.get("DATA_COMMANDS_ITEMINFO_DESCRIPTION"), value: item.description.truncate(50) },
                { name: lang.get("DATA_COMMANDS_ITEMINFO_PRICE"), value: `${item.price}$` },
                { name: lang.get("DATA_COMMANDS_ITEMINFO_GIVENROLE"), value: interaction.guild!.roles.cache.get(item.givenRoleID!)?.toString() || lang.resolveUnknown() },
                { name: lang.get("DATA_COMMANDS_ITEMINFO_REMOVEDROLE"), value: interaction.guild!.roles.cache.get(item.removedRoleID!)?.toString() || lang.resolveUnknown() }
            ])]
        })
    }
}