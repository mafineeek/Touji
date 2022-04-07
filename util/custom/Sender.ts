//@ts-nocheck

import { GuildEmoji, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Language, NonDMChannel } from "../../types";
import Emojis from "../../data/Emojis";

const lang = new LanguageHandler("en");

export interface EmbedTemplate extends MessageEmbedOptions {
    extends?: MessageEmbedOptions
}
export interface SenderOptions {
    text?: string,
    color?: string,
    disableAuthor?: boolean
}
export default class Sender {
    public constructor(
        private channel: NonDMChannel<false>,
        private language: Language = 'en'
    ) { }

    public setLanguage(language: Language) {
        this.language = language;
        return this;
    }

    public success(text?: string, options?: SenderOptions): MessageEmbed {
        return new MessageEmbed({
            author: options?.disableAuthor ? {} : {
                name: options?.text ?? lang.setLanguage(this.language).getGlobal("WORDS_SUCCESS"),
                iconURL: this.channel.client.emojis.cache.find((emoji: GuildEmoji) => emoji.id === Emojis.success)?.url
            },
            color: options?.color || "#7289da",
            description: text
        })
    }

    public warning(text?: string, options?: SenderOptions): MessageEmbed {
        return new MessageEmbed({
            author: options?.disableAuthor ? {} : {
                name: options?.text ?? lang.setLanguage(this.language).getGlobal("WORDS_WARNING"),
                iconURL: this.channel.client.emojis.cache.find((emoji: GuildEmoji) => emoji.id === Emojis.warning)?.url
            },
            color: options?.color || "#f1c40f",
            description: text
        })
    }

    public error(text?: string, options?: SenderOptions): MessageEmbed {
        return new MessageEmbed({
            author: options?.disableAuthor ? {} : {
                name: options?.text ?? lang.setLanguage(this.language).getGlobal("WORDS_ERROR"),
                iconURL: this.channel.client.emojis.cache.find((emoji: GuildEmoji) => emoji.id === Emojis.error)?.url
            },
            color: options?.color  || "#e74c3c",
            description: text as string
        })
    }

    public permissionError(requiredPexes: Array<string>, text?: string): MessageEmbed {
        return this.error(text || lang.getGlobal("PERMISSIONERROR_TEXT")).addFields([
            { name: lang.getGlobal("PERMISSIONERROR_NEEDED"), value: requiredPexes.join(", ") }
        ])
    }

    public fromTemplate(template: EmbedTemplate): MessageEmbed {
        return template.extends ? new MessageEmbed({
            ...template.extends,
            ...template
        }) : new MessageEmbed(template)
    }
}