import { CommandInteraction, Role } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Modifier from "../../util/Modifier";
import ShopItemData from "../../util/database/types/ShopItemData";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "create-item";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.economy.createitem" ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "economy";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const shopData = await client.database.economy.getItems(interaction.guildId!);

        lang.setLanguage(guildConfig.language!);

        /* [ title, description, price, givenrole ] */
        const modifier = new Modifier(interaction)
        .addStep({ name: "name", text: lang.get("DATA_COMMANDS_CREATEITEM_STEPS_1"), maxLength: 50 })
        .addStep({ name: "description", text: lang.get("DATA_COMMANDS_CREATEITEM_STEPS_2"), minLength: 1, maxLength: 150 })
        .addStep({ name: "price", text: lang.get("DATA_COMMANDS_CREATEITEM_STEPS_3") })
        .addStep({ name: "given-role", text: lang.get("DATA_COMMANDS_CREATEITEM_STEPS_4") })
        .addStep({ name: "removed-role", text: lang.get("DATA_COMMANDS_CREATEITEM_STEPS_5") })
        .onChange(async (s: string, a: string) => {
            switch (s) {
                case "name": {
                    if (shopData.some((item: ShopItemData) => item.name.trim() === a.trim())) {
                        await interaction.editReply({
                            content: null,
                            embeds: [sender.error(lang.get("DATA_COMMANDS_CREATEITEM_INVALIDNAME"))]
                        });
                        return false;
                    }
                    break
                }
                case "price": {
                    if (!parseInt(a) || parseInt(a) < 0 || parseInt(a) > 1000000) {
                        await interaction.editReply({
                            content: null,
                            embeds: [sender.error(lang.get("DATA_COMMANDS_CREATEITEM_INVALIDPRICE"))]
                        });
                        return false;
                    }
                    break
                }
                case "given-role":
                case "removed-role": {
                    const role = interaction.guild!.roles.cache.find(
                        (role: Role) => role.name.trim() === a.trim() || role.id === a.trim() || role.toString() === a.trim()
                    )
                    if (a !== "none" && (!role || role.managed || role.position >= interaction.guild!.me!.roles.highest.position)) {
                        await interaction.editReply({
                            content: null,
                            embeds: [sender.error(lang.get("DATA_COMMANDS_CREATEITEM_INVALIDROLE"))]
                        });
                        return false;
                    }
                    break
                }
            }
            return true;
        })
        .ask()

        modifier.on("end", async (answers: string[]) => {
            const id = await client.database.economy.createItem({
                name: answers[0],
                description: answers[1],
                price: answers[2],
                givenRoleID: answers[3] === "none" ? null : client.helpers.parseRawMention(answers[3]),
                removedRoleID: answers[4] === "none" ? null : client.helpers.parseRawMention(answers[4]),
                userID: interaction.user.id,
                guildId: interaction.guildId!
            });
            await interaction.editReply({
                content: null,
                embeds: [sender.success(lang.get("DATA_COMMANDS_CREATEITEM_SUCCESS", [{ old: "id", new: id }]))]
            })
        })
    }
}