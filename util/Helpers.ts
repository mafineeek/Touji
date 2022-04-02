import { GuildMember } from "discord.js";
import { readdirSync, existsSync } from "fs";
import fetch, { RequestInit } from "node-fetch";
import Config from "../data/Config";
import Developer from "../data/permissions/defaults/Developer";
import Moderator from "../data/permissions/defaults/Moderator";
import Administrator from "../data/permissions/defaults/Administrator";
import Owner from "../data/permissions/defaults/Owner";
import User from "../data/permissions/defaults/User";

export default {
    /** @deprecated since 1.5.0 Please use `getUserGroup()` instead */
    getUserPermissions: function (user: GuildMember) {
        let level = 1;
        if (Config.PERMISSIONS.developer.includes(user.id)) return 6;
        if (user.permissions.has("MANAGE_MESSAGES") || user.permissions.has("KICK_MEMBERS")) level++;
        if (user.permissions.has("BAN_MEMBERS")) level++;
        if (user.permissions.has("ADMINISTRATOR")) level++;
        if (user.id === user.guild.ownerId) level++;
        return level;
    },
    getUserGroup: function (user: GuildMember) {
        if (Config.PERMISSIONS.developer.includes(user.id)) return Developer;
        if (user.id === user.guild.ownerId) return Owner;
        if (user.permissions.has("ADMINISTRATOR")) return Administrator;
        if (user.permissions.has("KICK_MEMBERS") || user.permissions.has("BAN_MEMBERS")) return Moderator;
        else return User
    },
    request: async function (url: string, data: RequestInit, options?: { json?: boolean, text?: boolean }) {
        const response = await fetch(
            url, data
        );
        return options?.json ? await response.json() : options?.text ? await response.text() : response
    },
    getAPIToken: function (identifier: string) {
        const { default: config } = require("../data/Config");
        return config.KEYS[identifier] || null
    },
    parseRawMention: function (raw: string) {
        raw = raw.replace(/\s/g, "").replace(/^\D+/g, "");
        if (raw.endsWith(">")) raw = raw.slice(0, -1);

        return raw;
    },
    mapDirs: function (path: string) {
        const files: string[] = [];
        readdirSync(path).forEach((d: string) => {
            files.push(require(`${path}/${d}`));

            if (existsSync(`${path}/${d}`) && !`${path}/${d}`.split(".").length) this.mapDirs(`${path}/${d}`);
        })

        return files
    }
}