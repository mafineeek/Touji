import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "edit-embed";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [  "commands.mod.editembed" ];
    public readonly options = [
        { type: 7, name: "channel", description: lang.setLanguage("en").get("OPT_EDITEMBED_CHANNEL_DESC"), required: true },
        { type: 3, name: "message_id", description: lang.setLanguage("en").get("OPT_EDITEMBED_MESSAGEID_DESC"), required: true },
        ...["title", "description", "color", "footer", "image_url", "thumbnail_url", "url"].map((i: string) => {
            return {
                type: 3,
                name: i,
                description: lang.setLanguage("en").get(`OPT_EDITEMBED_${i.toUpperCase().replace(/_/g, "")}_DESC`)
            }
        })
    ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly cooldown = 10;
    public readonly category = "mod";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const toUpdate: [string, any][] = [];
        const errors: string[] = [];
        
        lang.setLanguage(guildConfig.language!);

        if (interaction.options.data.length < 3) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITEMBED_NONEPROVIDED"))]
        });

        const channel = interaction.options.getChannel("channel")!;
        const message = await channel.messages.fetch(interaction.options.getString("message_id")!).catch(() => null);

        if (!message) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITEMBED_INVALIDMESSAGE"))]
        });

        if (message.author !== client.user) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITEMBED_INVALIDMESSAGEAUTHOR"))]
        });

        interaction.options.data.forEach((option) => {
            switch (option.name) {
                case "title": {
                    if ((<string>option.value!).length > 256) return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_TITLE"));
                    
                    toUpdate.push([option.name, option.value!]);
                    break
                }
                case "description": {
                    if ((<string>option.value!).length > 2048) return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_DESCRIPTION"));

                    toUpdate.push([option.name, option.value!]);
                    break
                }
                case "footer": {
                    if ((<string>option.value!).length > 2048) return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_FOOTER"));

                    toUpdate.push([option.name, { text: option.value! }]);
                    break
                }
                case "color": {
                    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(<string>option.value))
                    return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_COLOR"));

                    toUpdate.push([option.name, option.value!]);
                    break
                }
                case "image_url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(<string>option.value))
                    return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_IMAGEURL"));

                    toUpdate.push(["image", { url: option.value!}]);
                    break
                }
                case "thumbnail_url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(<string>option.value))
                    return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_THUMBNAILURL"));

                    toUpdate.push(["thumbnail", { url: option.value! }]);
                    break
                }
                case "url": {
                    if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g.test(<string>option.value))
                    return errors.push(lang.get("DATA_COMMANDS_EDITEMBED_INVALID_URL"));

                    toUpdate.push([option.name, option.value!]);
                    break
                }
            }
        });

        if (errors.length) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_EDITEMBED_ERRORS", [{ old: "errors", new: errors.join("\n") }]))]
        });

        await message.edit({
            embeds: message.embeds.map((e) => new MessageEmbed({ ...e, ...Object.fromEntries(toUpdate) }))
        })

        await interaction.followUp({
            embeds: [sender.success(lang.get("DATA_COMMANDS_EDITEMBED_SUCCESS", [{ old: "replaced", new: toUpdate.map((i) => `\`${i[0]}\``).join(", ") }]))]
        });
    }
}