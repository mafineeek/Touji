import { Intents } from "discord.js";
import LanguageHandler from "./util/language/LanguageHandler";
import Bot from "./util/Bot";

global.LanguageHandler = LanguageHandler;

const bot = new Bot({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["USER", "REACTION", "MESSAGE"],
});
bot.setup();
process.on("unhandledRejection", (error: Error) => {
  bot.logger.error(error.stack as string);
  bot.errorWebhook.send(
    `Unhandled Rejection: \`\`\`\n${error}\n${error.stack}\n\`\`\``
  );
});
bot.on("error", (error: Error) => {
  bot.logger.error(error.stack as string);
  bot.errorWebhook.send(`Error: ${error}`);
});
export const client = bot;
