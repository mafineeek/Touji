import { CommandInteraction } from "discord.js";
import { Command as BaseCommand, GuildConfig } from "../../types";
import { transpileEval } from "ts-eval";
import { inspect } from "util";
import Sender from "../../util/custom/Sender";

const lang = new LanguageHandler("en");

export default class Command implements BaseCommand {
    public readonly name = "eval";
    public readonly description = lang.getStatic(`DESC_${this.name.split("-").join("").toUpperCase()}`);
    public readonly pexes = [ "global.access" ];
    public readonly options = [ {
        type: 3,
        name: "code",
        description: lang.setLanguage("en").get("OPT_EVAL_CODE_DESC"),
        required: true
    }, {
        type: 5,
        name: "async",
        description: lang.setLanguage("en").get("OPT_EVAL_ASYNC_DESC")
    } ];
    public readonly usage = lang.getStatic(`USAGE_${this.name.split("-").join("").toUpperCase()}`);
    public readonly category = "dev";
    public async run(interaction: CommandInteraction, guildConfig: GuildConfig) {
        const sender = new Sender(interaction.channel, guildConfig.language!);
        const code = interaction.options.getString("code");
        lang.setLanguage(guildConfig.language!);

        const asyncEval = async (code: string) => {
            return await eval(transpileEval(`
                (async () => {
                    const { client } = require("../../index")
                    ${code}
                })()
            `));
        };
        try {
            const evaled = interaction.options.getBoolean("async") ? await asyncEval(code!) : await eval(transpileEval(code));
            await interaction.followUp({
                embeds: [ sender.success().addFields([
                    {
                        name: lang.getGlobal("WORDS_INPUT"),
                        value: code!.markdown("ts")
                    },
                    {
                        name: lang.getGlobal("WORDS_OUTPUT"),
                        value: inspect(evaled, { depth: 0 }).markdown("ts")
                    },
                    {
                        name: lang.getGlobal("WORDS_TYPE"),
                        value: (evaled?.constructor?.name ?? typeof evaled).markdown("ts")
                    }
                ]) ],
            });
        } catch (e : any) {
            await interaction.followUp({
                embeds: [ sender.error((e.stack ?? e).markdown("ts")) ],
            });
        }
    }
}