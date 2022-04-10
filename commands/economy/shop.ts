import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Paginator from "../../util/Paginator";
import ShopItemData from "../../util/database/types/ShopItemData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "shop";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.shop" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const shopData = await client.database.economy.getItems(interaction.guildId!);

        lang.setLanguage(guildConfig.language!);

        if (!shopData.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_SHOP_NONE"))]
        });

        const embeds = [];
        for (const part of shopData.chunk(10)) {
            embeds.push(sender.success().addFields(part.map((data: ShopItemData) => {
                return {
                    name: `[${data.itemID!}] ${data.name} - ${data.price}$`,
                    value: data.description.truncate(50)
                }
            })))
        }

        await Paginator(interaction, embeds);
    }
}