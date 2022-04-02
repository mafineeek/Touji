import { EventEmitter } from "events";
import Discord from "discord.js";

export type Step = { name: string, text: string, minLength?: number, maxLength?: number };
export default class Modifier extends EventEmitter {
    private i = 1;
    private steps: Step[] = [];
    private actualStep: Step | null = null;
    private callbackFunc: Function | null = null;
    public constructor(
        private interaction: Discord.CommandInteraction
    ) { super() };

    public addStep(data: Step) {
        this.steps.push(data);
        return this;
    };

    public onChange(callbackFunc: (step: string, answer: string) => Promise<boolean> | boolean) {
        this.callbackFunc = callbackFunc;
        return this;
    }

    public ask() {
        this.actualStep = this.steps[this.i - 1];

        this.interaction.followUp({
            content: `> **${this.i}/${this.steps.length}**\n\n${this.actualStep.text}`
        });

        const filter = (message: Discord.Message) => message.author === this.interaction.user;

        const collector = this.interaction.channel!.createMessageCollector({ filter, time: 120000 });
        collector.on("collect", async (collected: Discord.Message) => {
            if (collected.deletable) await collected.delete();
            if (this.actualStep!.minLength && collected.content?.length <= this.actualStep!.minLength) {
                await this.interaction.editReply({
                    content: LanguageHandler.getGlobal("MODIFIER_TOOSHORT", [], this.interaction.guild!.config.language!)
                });
                return await collector.stop("invalid-option")
            }

            if (this.actualStep!.maxLength && collected.content?.length >= this.actualStep!.maxLength) {
                await this.interaction.editReply({
                    content: LanguageHandler.getGlobal("MODIFIER_TOOLONG", [], this.interaction.guild!.config.language!)
                });
                return await collector.stop("invalid-option")
            }

            if (this.callbackFunc && !await this.callbackFunc(this.actualStep!.name, collected.content)) {
                if (collected.deletable) await collected.delete();
                return collector.stop("invalid-option");
            }

            this.i += 1;
            this.actualStep = this.steps[this.i - 1];

            if (!this.actualStep) return await collector.stop("ended");

            await this.interaction.editReply({
                content: `> **${this.i}/${this.steps.length}**\n\n${this.actualStep.text}`
            });
        });

        collector.on("end", async (collected: Discord.Collection<string, Discord.Message>, reason: string) => {
            const reply = await this.interaction.fetchReply().catch(() => null);

            if (reason === "invalid-option") return;

            if (!reply?.deleted && !collected.size) {
                await reply!.edit({ content: LanguageHandler.getGlobal("MODIFIER_TIMEOUT", [], this.interaction.guild!.config.language!) });
                return;
            }

            if (reason === "ended") this.emit("end", collected.map((m: Discord.Message) => m.content))
        });
        return this;
    };
}