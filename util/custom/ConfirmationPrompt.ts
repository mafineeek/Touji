import { EventEmitter } from "events";
import Discord from "discord.js";
import Emojis from "../../data/Emojis";
import Sender from "./Sender";

export default class ConfirmationPrompt extends EventEmitter {
    private text: string = "Unknown";
    private emitRejectedEvent: boolean = false;
    private onlyFor: string[] = [];
    public constructor(
        private interaction: Discord.CommandInteraction
    ) { super() }

    public setText(text: string) {
        this.text = text;
        return this;
    }

    public emitRejected(value?: boolean) {
        this.emitRejectedEvent = value ?? !this.emitRejectedEvent;
        return this;
    }

    public onlyForUsers(ids: string[]) {
        this.onlyFor = [ ...this.onlyFor, ...ids ];
        return this;
    }

    public async ask() {
        const sender = new Sender(this.interaction.channel, this.interaction.guild!.config.language!);
        const filter = (interaction: Discord.ButtonInteraction) => ["yes", "no"].includes(interaction.customId)

        await this.interaction[this.interaction.deferred ? "followUp" : this.interaction.replied ? "editReply" : "reply"]({
            embeds: [sender.warning(this.text)],
            components: [new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton().setStyle("DANGER").setCustomId("yes").setEmoji(Emojis.success),
                new Discord.MessageButton().setStyle("DANGER").setCustomId("no").setEmoji(Emojis.error)
            ])]
        });

        const collector = (await this.interaction.fetchReply()).createMessageComponentCollector(
            { filter, time: 30000, componentType: "BUTTON" }
        );

        collector.on("collect", async (interaction: Discord.ButtonInteraction) => {
            await interaction.deferUpdate()
            if (!this.onlyFor.includes(interaction.user.id)) return;

            switch (interaction.customId) {
                case "yes": this.emit("accepted", interaction); break;
                case "no": this.emitRejectedEvent ? this.emit("rejected", interaction) : await this.interaction.editReply({
                    embeds: [sender.error(LanguageHandler.getGlobal("STATIC_CANCELLED", [], interaction.guild!.config.language!))],
                    components: []
                }); break;
            }
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) await this.interaction.editReply({
                embeds: [sender.error(LanguageHandler.getGlobal("CONFIRMATIONPROMPT_TIMEOUT", [], this.interaction.guild!.config.language!))],
                components: []
            })
        })

        return this;
    }
}