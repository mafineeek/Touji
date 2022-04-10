import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { readdirSync } from "fs";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";
import Config from "../../data/Config";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "reload";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access"];
    public readonly options = [ {
        type: 3,
        name: "command_name",
        description: lang.setLanguage("en").get("OPT_RELOAD_COMMANDNAME_DESC"),
        required: true
    } ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "dev";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        if (!Config.PERMISSIONS.developer.includes(interaction.user.id)) return;
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const commandName = interaction.options.getString("command_name")!;
        const command = client.commands.get(commandName);

        lang.setLanguage(guildConfig.language!);

        if (commandName !== "*" && !command) return await interaction.followUp({
            embeds: [sender.error(lang.get("DATA_COMMANDS_RELOAD_INVALID"))]
        });

        if (commandName === "*") {
            await interaction.followUp({
                embeds: [sender.success(lang.get("DATA_COMMANDS_RELOAD_SUCCESS_ALL"))]
            });
            readdirSync("./commands/").forEach((directory: string) => {
                readdirSync(`./commands/${directory}`).forEach(async (file: string) => {
                    delete require.cache[require.resolve(`../${directory}/${file}`)];

                    const { default: commandFile } = require(`../${directory}/${file}`);
                    const importedCommand = new commandFile();

                    client.commands.delete(importedCommand.name);
                    client.commands.set(importedCommand.name, importedCommand);
                })
            });
        } else {
            delete require.cache[require.resolve(`../${command!.category}/${command!.name}`)];

            await interaction.followUp({
                embeds: [sender.success(lang.get("DATA_COMMANDS_RELOAD_SUCCESS_COMMAND"))]
            });

            const { default: commandFile } = require(`../${command!.category}/${command!.name}`);
            const importedCommand = new commandFile();

            client.commands.delete(commandName);
            client.commands.set(command!.name, importedCommand);
        }
    }
}