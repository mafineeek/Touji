import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";
import ShopItemData from "../../util/database/types/ShopItemData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "inventory";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.inventory" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const inventoryItems = await client.database.economy.getUserInventory(interaction.user.id, interaction.guildId!);

        lang.setLanguage(guildConfig.language!);

        if (!inventoryItems.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_INVENTORY_NONE"))]
        });

        const embeds = [];
        for (const part of inventoryItems.chunk(10)) {
            embeds.push(sender.success().addFields(part.map((data: ShopItemData) => {
                return {
                    name: `${data.name} - ${data.price}$`,
                    value: data.description.truncate(50)
                }
            })))
        }

        await Paginator(interaction, embeds);
    }
}