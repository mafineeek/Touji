import Managers from "./";
import { Connection } from "rethinkdb-ts";

export default class Database {
    public constructor(
        public connection: Connection
    ) { require("./Ensure").default(connection) }

    get guildConfig() {
        return new Managers.GuildConfigManager(this.connection)
    }

    get case() {
        return new Managers.CaseManager(this.connection)
    }

    get giveaways() {
        return new Managers.GiveawaysManager(this.connection)
    }

    get birthdays() {
        return new Managers.BirthdaysManager(this.connection)
    }

    get starboard() {
        return new Managers.StarboardManager(this.connection)
    }

    get snipe() {
        return new Managers.SnipeManager(this.connection)
    }

    get reminders() {
        return new Managers.ReminderManager(this.connection)
    }

    get economy() {
        return new Managers.EconomyManager(this.connection)
    }

    get cooldowns() {
        return new Managers.CooldownManager(this.connection)
    }

    get levelling() {
        return new Managers.LevellingManager(this.connection)
    }

    get reactionroles() {
        return new Managers.ReactionRoleManager(this.connection)
    }

    get permissions() {
        return new Managers.PEXManager(this.connection)
    }

    get automessages() {
        return new Managers.AutoMessagesManager(this.connection)
    }
}