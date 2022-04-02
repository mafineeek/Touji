import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "edit-item";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.edititem" ];
    public readonly options = [
        { type: 10, name: "id", description: lang.setLanguage("en").get("OPT_EDITITEM_ID_DESC"), required: true },
        { type: 3, name: "name", description: lang.setLanguage("en").get("OPT_EDITITEM_NAME_DESC") },
        { type: 3, name: "description", description: lang.setLanguage("en").get("OPT_EDITITEM_DESCRIPTION_DESC") },
        { type: 10, name: "price", description: lang.setLanguage("en").get("OPT_EDITITEM_PRICE_DESC") }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const toUpdate: [string, string | number | boolean][] = [];
        const errors: string[] = [];
        
        lang.setLanguage(guildConfig.language!);

        if (interaction.options.data.length < 2) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITITEM_NONEPROVIDED"))]
        });

        if (!await client.database.economy.getItemById(interaction.guildId!, interaction.options.getNumber("id")!.toString())) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITITEM_INVALIDITEM"))]
        });

        interaction.options.data.forEach((option) => {
            switch (option.name) {
                case "name": {
                    if ((<string>option.value!).length > 50) return errors.push(lang.get("DATA_COMMANDS_EDITITEM_INVALID_NAME"));
                    
                    toUpdate.push([option.name, option.value!]);
                    break
                }
                case "description": {
                    if ((<string>option.value!).length > 150) return errors.push(lang.get("DATA_COMMANDS_EDITITEM_INVALID_DESCRIPTION"));

                    toUpdate.push([option.name, option.value!]);
                    break
                }
                case "price": {
                    if (isFloat(<number>option.value!) || option.value! < 0 || option.value! > 1000000)
                    return errors.push(lang.get("DATA_COMMANDS_EDITITEM_INVALID_PRICE"));

                    toUpdate.push([option.name, option.value!]);
                    break
                }
            }
        });

        if (errors.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITITEM_ERRORS", [{ old: "errors", new: errors.join("\n") }]))]
        });

        await client.database.economy.updateItem(
            interaction.options.getNumber("id")!.toString(),
            interaction.guildId!,
            Object.fromEntries(toUpdate)
        );
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_EDITITEM_SUCCESS", [{ old: "replaced", new: toUpdate.map((i) => `\`${i[0]}\``).join(", ") }]))]
        });
    }
}