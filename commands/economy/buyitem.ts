import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import ShopItemData from "../../util/database/types/ShopItemData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "buy-item";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.economy.buyitem" ];
    public readonly options = [{
        type: 10,
        name: "id",
        description: lang.setLanguage("en").get("OPT_BUYITEM_ID_DESC"),
        required: true
    }];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 15;
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const userData = await client.database.economy.getUser(interaction.user.id, interaction.guildId!);
        const item = (await client.database.economy.getItems(interaction.guildId!)).find(
            (item: ShopItemData) => item.itemID! === interaction.options.getNumber("id")!.toString()
        );

        lang.setLanguage(guildConfig.language!);

        if (!item) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BUYITEM_INVALIDITEM"))]
        });

        if (parseInt(item.price) > userData.cash) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_BUYITEM_NOTENOUGHWALLET", [{ old: "amount", new: (parseInt(item.price) - userData.cash).toString() }]))]
        });

        if (item.givenRoleID && interaction.guild!.roles.cache.has(item.givenRoleID)) await interaction.member.roles.add(item.givenRoleID, "Economy role").catch(() => false);
        if (item.removedRoleID && interaction.guild!.roles.cache.has(item.removedRoleID)) await interaction.member.roles.remove(item.removedRoleID, "Economy role").catch(() => false);

        await client.database.economy.addItemToInventory(interaction.user.id, item);
        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_BUYITEM_SUCCESS"))]
        })
    }
}