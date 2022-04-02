import { Intents } from "discord.js";
import LanguageHandler from "./util/language/LanguageHandler";
import Bot from "./util/Bot";

global.LanguageHandler = LanguageHandler;

const bot = new Bot({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: ['USER', 'REACTION', 'MESSAGE']
})
bot.setup()
export const client = bot;