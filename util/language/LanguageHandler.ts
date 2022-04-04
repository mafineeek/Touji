import { BooleanLike, Language } from "../../types";

export default class LanguageHandler {
    public constructor(
        private language: Language | "index"
    ) {}

    public static get(scope: string, variables: Array<{ old: string, new: any }>, language: Language) {
        let raw = this.raw(language).propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? "Unknown")
        }

        return raw as any;
    }

    public static getGlobal(scope: string, variables: Array<{ old: string, new: any }>, language: Language) {
        let raw = this.rawGlobal(language).propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? "Unknown")
        }

        return raw
    }

    public static getStatic(scope: string, variables: Array<{ old: string, new: any }>) {
        let raw = this.rawGlobal("index").propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? "Unknown")
        }

        return raw
    }

    public get(scope: string, variables?: Array<{ old: string, new: any }>) {
        let raw = this.raw().propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? this.resolveUnknown())
        }

        return raw as any;
    }

    public setLanguage(language: Language | "index") {
        this.language = language || "en";
        return this;
    }

    public resolveBoolean(boolean: BooleanLike) {
        switch (this.language) {
            case "pl": {
                switch (boolean) {
                    case "yes":
                    case "tak":
                    case "ja":
                    case "true":
                        return "Tak";
                    case "no":
                    case "false":
                    case "nein":
                    case "nie":
                    default:
                        return "Nie";
                }
            }
            case "en": {
                switch (boolean) {
                    case "yes":
                    case "tak":
                    case "ja":
                    case "true":
                        return "Yes";
                    case "no":
                    case "false":
                    case "nein":
                    case "nie":
                    default:
                        return "No";
                }
            }
        }
    }

    public resolveUnknown() {
        switch (this.language) {
            case "pl": return "Brak danych"
            case "en": return "Unknown"
            default: return "Unknown"
        }
    }

    public resolveEnabled(boolean: BooleanLike, suffix?: string) {
        switch (this.language) {
            case "pl": {
                switch (boolean) {
                    case "yes":
                    case "tak":
                    case "ja":
                    case "true":
                        return `Włączon${suffix ?? "y"}` as string;
                    case "no":
                    case "false":
                    case "nein":
                    case "nie":
                    default:
                        return `Wyłączon${suffix ?? "y"}` as string;
                }
            }
            case "en": {
                switch (boolean) {
                    case "yes":
                    case "tak":
                    case "ja":
                    case "true":
                        return "Enabled" as string;
                    case "no":
                    case "false":
                    case "nein":
                    case "nie":
                    default:
                        return "Disabled" as string;
                }
            }
        }
    }

    public getGlobal(scope: string, variables?: Array<{ old: string, new: any }>) {
        let raw = this.rawGlobal().propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? this.resolveUnknown())
        }

        return raw
    }

    public getStatic(scope: string, variables?: Array<{ old: string, new: any }>) {
        let raw = this.setLanguage("index").rawGlobal().propertiesLower();
        for (const part of scope.split("_")) {
            if (!raw.hasOwnProperty(part.toLowerCase())) return scope;
            raw = raw[part.toLowerCase()]
        }

        if (variables) for (const variable of variables) {
            raw = raw.replace(`{{${variable.old}}}`, variable.new ?? this.resolveUnknown())
        }

        return raw
    }

    public raw() {
        const { default: data } = require(`../../data/language/${this.language}`);
        return data
    }

    public rawGlobal() {
        const { default: data } = require(`../../data/language/global/${this.language}`);
        return data
    }

    static raw(language: Language) {
        const { default: data } = require(`../../data/language/${language}`);
        return data
    }

    static rawGlobal(language: Language | "index") {
        const { default: data } = require(`../../data/language/global/${language}`);
        return data
    }
}