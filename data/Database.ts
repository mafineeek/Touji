export default {
    requiredDBs: ["Touji"],
    requiredTables: [
        "guildConfig", "punishments", "giveaways", "birthdays", "starboard", "snipe",
        "reminders", "economy", "cooldowns", "shops", "inventories", "levelling", "role-rewards",
        "reaction-roles", "pex-groups", "pex-permissions", "pex-global-permissions", "automessages"
    ],
    indexes: {
        guildConfig: [ ["getGuild", ["id"]] ],
        punishments: [ ["getAll", ["caseID", "userID"]], ["getUser", ["userID"]], ["getGuild", ["guildId"]], ["getUserAndGuild", ["guildId", "userID"]], ["getTime", ["expireAt"]], ["getID", ["caseID"]] ],
        giveaways: [ ["getTime", ["endAt"]], ["getAll", ["endAt", "ended"]], ["getGuild", ["guildId"]], ["getMessage", ["messageID"]] ],
        birthdays: [ ["getAll", ["day", "month"]], ["getUser", ["userID"]] ],
        starboard: [ ["getMessage", ["messageID"]], ["getStars", ["starCount"]], ["getAll", ["messageID", "starCount"]], ["getUser", ["userID"]] ],
        snipe: [ ["getUser", ["userID", "type"]], ["getGuild", ["guildId", "type"]], ["getChannel", ["channelId", "type"]], ["getUserAndChannel", ["userID", "channelId", "type"]] ],
        reminders: [ ["getAll", ["expireAt"]], ["getUser", ["userID"]] ],
        economy: [ ["get", ["userID", "guildId"]], ["getGuild", ["guildId"]] ],
        cooldowns: [ ["get", ["userID", "commandName"]] ],
        shops: [ ["getGuild", ["guildId"]], ["getGuildId", ["guildId", "itemID"]] ],
        inventories: [ ["get", ["userID", "guildId"]] ],
        levelling: [ ["getAll", ["userID", "guildId"]], ["getGuild", ["guildId"]] ],
        "role-rewards": [ ["getGuild", ["guildId"]], ["getLevel", ["level", "guildId"]] ],
        "reaction-roles": [ ["getGuild", ["guildId"]], ["getMessage", ["messageId"]], ["getEmoji", ["emoji"]], ["getAll", ["messageID", "emoji"]] ],
        "pex-groups": [ ["get", ["guildId", "groupName"]] ],
        "pex-permissions": [ ["get", ["userID", "guildId"]] ],
        automessages: [ ["getAll", ["guildId"]] ]
    }
}