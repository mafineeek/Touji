import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { client } from "../../index";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "help";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly options = [{
        type: 3,
        name: "command",
        description: lang.setLanguage("en").get("OPT_HELP_COMMAND_DESC")
    }];
    public readonly pexes = [ "global.access", "commands.bot.help" ];
    public readonly category = "bot";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        lang.setLanguage(guildConfig.language!);

        if (interaction.options.data.length) {
            const command = client.commands.get(interaction.options.getString("command")!)!;

            if (!command) return await interaction.followUp({
                embeds: [sender.error(lang.get("DATA_COMMANDS_HELP_INVALID"))]
            })

            await interaction.followUp({
                embeds: [
                    sender.success(lang.get("DATA_COMMANDS_HELP_COMMANDINFO", [ {
                        old: "commandName",
                        new: command.name
                    } ])).addFields([
                        {
                            name: lang.getGlobal("STATIC_NAME"),
                            value: command.name.codeBlock()
                        },
                        {
                            name: lang.getGlobal("STATIC_DESC"),
                            value: command.description[guildConfig.language!].codeBlock()
                        },
                        {
                            name: lang.getGlobal("STATIC_USAGE"),
                            value: command.usage[guildConfig.language!].replace("[]", "/").codeBlock()
                        },
                        {
                            name: lang.getGlobal("STATIC_OPTIONS"),
                            value: command.options?.map((option: ApplicationCommandOptionData) => option.name.codeBlock()).join(", ") || lang.resolveUnknown()
                        },
                        {
                            name: lang.get("DATA_COMMANDS_HELP_REQUIREDPERMISSIONS"),
                            value: command.pexes?.map((pex: string) => pex.codeBlock()).join("\n") || "N/A"
                        }
                    ])
                ],
            });
        } else {
            return await interaction.followUp({
                embeds: [
                    sender.success(lang.get("DATA_ADDONS_BOTWELCOMETEXT", [{ old: "commandsSize", new: client.commands.size }])).addFields(readdirSync("./commands").map((dir: string) => {
                        const filtered = client.commands.filter((cmd: BaseCommand) => cmd.category.toLowerCase() === dir.toLowerCase());
                        return {
                            name: `${dir.toUpperCase()} (${filtered.size})`,
                            value: filtered.map((cmd: BaseCommand) => cmd.name.codeBlock()).join(" | ") || lang.resolveUnknown()
                        };
                    }))
                ],
            });
        }
    }
}