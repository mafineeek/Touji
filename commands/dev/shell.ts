import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { execSync } from "child_process";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "shell";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access", "commands.dev.*" ];
    public readonly options = [ {
        type: 3,
        name: "code",
        description: lang.setLanguage("en").get("OPT_SHELL_CODE_DESC"),
        required: true
    } ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "dev";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const code = interaction.options.getString("code")!;

        lang.setLanguage(guildConfig.language!);

        try {
            const evaled = execSync(code)?.toString();
            await interaction.followUp({
                embeds: [ sender.success().addFields([
                    {
                        name: lang.getGlobal("WORDS_INPUT"),
                        value: code!.truncate(500).markdown("bash")
                    },
                    {
                        name: lang.getGlobal("WORDS_OUTPUT"),
                        value: evaled.truncate(500).markdown("bash")
                    }
                ]) ],
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [ sender.error((e.stack ?? e).truncate(500).markdown("bash")) ],
            });
        }
    }
}