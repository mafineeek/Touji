import { ApplicationCommandTypes } from "discord.js/typings/enums";
import Discord from "discord.js";
import GuildConfigBase from "../util/database/types/GuildConfig";

declare module 'disco-oauth';
declare module "discord.js" {
    interface GuildMember {
        data: UserData,
        permissionLevel?: number
    }

    interface Collection<K, V> {
        toArrayKeys(): Array<K>;
        toArray(): Array<V>;
    }

    interface CommandInteraction {
        member: Discord.GuildMember;
        channel: Discord.TextBasedChannels | null;
        fetchReply(): Promise<Discord.Message>;
        defer(options?: Discord.InteractionDeferOptions & { fetchReply?: true }): Promise<Discord.Message>;
        reply(options?: Discord.InteractionReplyOptions & { fetchReply?: true }): Promise<Discord.Message>;
        defer(options?: Discord.InteractionDeferOptions & { fetchReply?: false }): Promise<void>;
        reply(options?: Discord.InteractionReplyOptions & { fetchReply?: false }): Promise<void>;
    }

    interface ContextMenuInteraction {
        member: Discord.GuildMember;
        channel: Discord.TextBasedChannels | null;
        fetchReply(): Promise<Discord.Message>;
        defer(options?: Discord.InteractionDeferOptions & { fetchReply?: true }): Promise<Discord.Message>;
        reply(options?: Discord.InteractionReplyOptions & { fetchReply?: true }): Promise<Discord.Message>;
        defer(options?: Discord.InteractionDeferOptions & { fetchReply?: false }): Promise<void>;
        reply(options?: Discord.InteractionReplyOptions & { fetchReply?: false }): Promise<void>;
    }

    interface MessageComponentInteraction {
        message: Discord.Message;
        fetchReply(): Promise<Discord.Message>;
    }

    interface CommandInteractionOptionResolver {
        getMember(name: string, required?: boolean): Discord.GuildMember | null;
        getUser(name: string, required?: boolean): Discord.User | null;
        getChannel(name: string, required?: boolean): Discord.TextChannel | Discord.NewsChannel | Discord.ThreadChannel | null;
    }

    interface Guild {
        config: GuildConfigBase;
    }
}
declare global {
    declare var LanguageHandler: typeof import("../util/language/LanguageHandler").default;
    declare function isFloat(n: number): boolean;

    interface String {
        truncate(maxlength: number): string;
        capitalize(): string;
        markdown(code?: string): string;
        codeBlock(): string;
        replaceMany(from: Array<string | RegExp>, to: string[]): string;
        splitEmojis(): Array<string>;
    }

    interface Boolean {
        toString(): BooleanLike;
    }

    interface Array<T> {
        mapAsync<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
        removeOne(element: T): Array<T>;
        limit(max: number): Array<T>;
        chunk(size: number): Array<T[]>;
        random(max?: number): T;
        shuffle(): Array<T>;
        isUnique(): boolean;
    }

    interface Math {
        randomInteger(min?: number, max?: number, allowFloat?: boolean = false): number;
        sum(array: Array<number>): number;
    }

    interface PromiseConstructor<T> {
        wait(delay: number): Promise<T>
    }

    interface ArrayConstructor<T> {
        fill(max: number, cb: (i: number) => Promise<T> | T): Array<T>;
        range(max: number): Array<T>;
    }

    interface Object<T> {
        [key: string | number]: T;
        propertiesLower(): Object<T>;
        random(max?: number): Object<T>;
        randomValue(max?: number): Object<T>;
    }

    interface ObjectConstructor<T> {
        fromEntries(iterable: Array<T>): Object<T>;
    }

    interface DateConstructor {
        daysOfMonth(month: number): number;
    }
}

export type CommandCategory = string | "bot" | "dev" | "fun" | "economy" | "util" | "games" | "mod" | "levelling"
export type ValidChannel = Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel | Discord.PartialDMChannel | Discord.ThreadChannel
export type NonDMChannel<CAN_BE_THREAD> = CAN_BE_THREAD extends false | undefined ? Exclude<ValidChannel, "DMChannel", "PartialDMChannel", "ThreadChannel"> : Exclude<ValidChannel, "DMChannel", "PartialDMChannel">
export type Language = "pl" | "en"
export type BooleanLike = "yes" | "no" | "tak" | "nie" | "true" | "false" | "ja" | "nein"
export type MultiLanguageObject = { pl: string, en: string }
export interface Command {
    type?: keyof typeof ApplicationCommandTypes | number,
    name: string,
    description: MultiLanguageObject,
    usage: MultiLanguageObject,
    category: CommandCategory,
    pexes: Array<string>,
    cooldown?: number,
    options?: Discord.ApplicationCommandOptionData[],
    userFeatureFlags?: Array<string>,
    guildFeatureFlags?: Array<string>,
    channel_types?: Array<keyof typeof Discord.ChannelTypes>,
    run: (interaction: Discord.CommandInteraction, ...args: any[]) => Promise<any>
}

export interface ContextMenuCommand {
    type?: Exclude<keyof typeof ApplicationCommandTypes, "CHAT_INPUT"> | number,
    name: string,
    discordName?: string,
    usage: MultiLanguageObject,
    category: CommandCategory,
    pexes: Array<string>,
    cooldown?: number,
    run: (interaction: Discord.ContextMenuInteraction, ...args: any[]) => Promise<any>
}

export interface Event {
    name: keyof Discord.ClientEvents,
    run: (...args: any[]) => Promise<any> | any
}

export interface GuildConfig extends GuildConfigBase {}

export interface UserData {}