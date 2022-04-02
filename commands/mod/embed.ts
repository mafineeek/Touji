import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import Sender from "../../util/custom/Sender";
import ConfirmationPrompt from "../../util/custom/ConfirmationPrompt";
import LanguageHandler from "../../util/language/LanguageHandler";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "embed";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.mod.embed" ];
    public readonly options = [
        { type: 3, name: "description", description: lang.setLanguage("en").get("OPT_EMBED_DESCRIPTION_DESC"), required: true },
        { type: 3, name: "color", description: lang.setLanguage("en").get("OPT_EMBED_COLOR_DESC"), required: true },
        { type: 3, name: "title", description: lang.setLanguage("en").get("OPT_EMBED_TITLE_DESC") },
        { type: 3, name: "footer", description: lang.setLanguage("en").get("OPT_EMBED_FOOTER_DESC") },
        { type: 3, name: "image_url", description: lang.setLanguage("en").get("OPT_EMBED_IMAGEURL_DESC") },
        { type: 3, name: "thumbnail_url", description: lang.setLanguage("en").get("OPT_EMBED_THUMBNAILURL_DESC") },
        { type: 3, name: "url", description: lang.setLanguage("en").get("OPT_EMBED_URL_DESC") }
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const data: any = {};

        lang.setLanguage(guildConfig.language!);

        for (const part of interaction.options.data) {
            switch (part.name) {
                case "color": {
                    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(part.value as string)) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_INVALIDHEX"))] })
                    data[part.name] = part.value;
                    break
                }
                case "image_url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(part.value as string)) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_INVALIDURL"))] })
                    data["image"] = { url: part.value};
                    break
                }
                case "thumbnail_url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(part.value as string)) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_INVALIDURL"))] })
                    data["thumbnail"] = { url: part.value };
                    break
                }
                case "url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(part.value as string)) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_INVALIDURL"))] })
                    data[part.name] = part.value;
                    break
                }
                default: {
                    switch (part.name) {
                        case "title": {
                            if ((part.value as string).length > 256) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_TITLETOOLONG"))] })
                            break
                        }
                        case "description": {
                            if ((part.value as string).length > 2048) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_DESCTOOLONG"))] })
                            break
                        }
                        case "footer": {
                            if ((part.value as string).length > 2048) return await interaction.followUp({ embeds: [sender.error(lang.get("DATA_COMMANDS_EMBED_FOOTERTOOLONG"))] })
                            break
                        }
                    }
                    data[part.name] = part.value;
                    break
                }
            }
        }

        const baseMessage = await interaction.channel!.send({ embeds: [new MessageEmbed({ ...data, footer: { text: data.footer }})] })

        const prompt = await new ConfirmationPrompt(interaction)
        .setText(lang.get("DATA_COMMANDS_EMBED_ASK"))
        .emitRejected()
        .onlyForUsers([interaction.user.id])
        .ask();

        prompt.on("accepted", () => {
            return interaction.deleteReply();
        })

        prompt.on("rejected", () => {
            if (baseMessage.deletable) baseMessage.delete();
            return interaction.deleteReply().catch(() => false);
        })
    }
}