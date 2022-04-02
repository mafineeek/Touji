import { Collection } from "discord.js";
export default function initStructures() {
    global.isFloat = function (n: number) {
        return n % 1 !== 0;
    }
    Date.daysOfMonth = function(month: number) {
        if (month < 1 || month > 12) return 0;

        return new Date(new Date().getFullYear(), month, 0).getDate();
    }
    Promise.wait = function <T>(delay: number) {
        return new Promise<T>(((resolve: any) => resolve(delay)))
    }
    Math.randomInteger = function (min?: number, max?: number, allowFloat: boolean = false) {
        if (min && max) {
            const number = Math.random() * (max - min) + min;
            return allowFloat ? number : parseInt(number.toFixed())
        } else {
            const number = Math.random() * 100;
            return allowFloat ? number : parseInt(number.toFixed())
        }
    }
    Math.sum = function (array: Array<number>) {
        let sum = 0;
        for (const element of array) {
            sum += element
        }
        return sum
    }
    String.prototype.truncate = function (maxlength: number) {
        if (this.length > maxlength) {
            return this.substring(0, maxlength) + "...";
        } else {
            return this as string;
        }
    }
    String.prototype.capitalize = function () {
        return `${this.charAt(0).toUpperCase()}${this.slice(1)}`
    }
    String.prototype.markdown = function (code?: string) {
        return `\`\`\`${code ?? "txt"}\n${require("discord.js").Util.escapeMarkdown(this)}\`\`\``
    }
    String.prototype.codeBlock = function () {
        return `\`${require("discord.js").Util.escapeMarkdown(this)}\``
    }
    String.prototype.replaceMany = function (from: Array<string | RegExp>, to: string[]) {
        let string = this;
        for (const item of from) {
            string = string.replace(item, to[from.indexOf(item)])
        }
        return string.toString()
    }
    String.prototype.splitEmojis = function () {
        const split = this.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
        const array = [];
        for (let i = 0; i < split.length; i++) {
            const char = split[i]
            if (char !== "") {
                array.push(char);
            }
        }
        return array;
    }
    Collection.prototype.toArray = function () {
        return Array.from(this.values())
    }
    Collection.prototype.toArrayKeys = function () {
        return Array.from(this.keys())
    }
    Object.prototype.propertiesLower = function () {
        const newObject: any = {}
        Object.entries(this).map(([k, v]: [string, any]) => {
            if (typeof v === "object") return newObject[k.toLowerCase()] = v.propertiesLower();
            newObject[k.toLowerCase()] = v
        });
        return newObject
    }
    Object.fromEntries = function (iterable: Iterable<any>) {
        return [...iterable].reduce((object, [key, value]) => {
            object[key] = value
            return object
        }, {})
    }
    Object.prototype.random = function (max?: number) {
        const keys = Object.keys(this);
        if (max) {
            const results = [];
            for (let i = 0; i < max; i++) {
                results.push(keys[Math.floor(Math.random() * keys.length)])
            }
            return results
        } else return keys[Math.floor(Math.random() * keys.length)]
    }
    Object.prototype.randomValue = function (max?: number) {
        const values = Object.values(this);
        if (max) {
            const results = [];
            for (let i = 0; i < max; i++) {
                results.push(values[Math.floor(Math.random() * values.length)])
            }
        } else return values[Math.floor(Math.random() * values.length)]
    }
    Boolean.prototype.toString = function () {
        switch (this) {
            case true: return "true";
            case false: return "false";
            default: return "false";
        }
    }
    Array.prototype.removeOne = function <T>(element: T) {
        for (const i in this) if (this[i] === element) {
            this.splice(i, 1);
        }
        return this
    }
    Array.range = function (max: number) {
        return this.fill(max, (i: number) => i)
    }
    Array.prototype.chunk = function (size: number) {
        const array = [];
        for (let i = 0; i < this.length; i += size) array.push(this.slice(i, i + size));
        return array;
    }
    Array.prototype.mapAsync = function (callbackfn: (value: unknown, index: number, array: unknown[]) => any[]) {
        return Promise.all(this.map(callbackfn))
    }
    Array.fill = function (max: number, cb: Function) {
        const array = [];
        for (let i = 1; i <= max; i++) {
            array.push(cb(i))
        }
        return array
    }
    Array.prototype.shuffle = function () {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
        return this
    }
    Array.prototype.isUnique = function <T>() {
        return !this.some((v: T, i: number) => this.indexOf(v) < i)
    }
    Array.prototype.random = function (max?: number) {
        if (max) {
            const results = [];
            for (let i = 0; i < max; i++) {
                results.push(this[Math.floor(Math.random() * this.length)])
            }
        } else return this[Math.floor(Math.random() * this.length)]
    }
}