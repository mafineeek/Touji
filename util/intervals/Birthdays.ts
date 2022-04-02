import { TextChannel } from "discord.js";
import Bot from "../Bot";

export default function loadBirthdays(client: Bot) {
    setInterval(async () => {
        for (const data of await client.database.birthdays.today()) {
            if (data.delivered === new Date().getFullYear().toString()) return;

            const guildConfig = await client.database.guildConfig.get(data.guildId);
            const lang = new LanguageHandler(guildConfig.language!);
            if (!guildConfig?.birthdayChannelID) return;

            const guild = client.guilds.cache.get(data.guildId);
            const user = await guild?.members?.fetch(data.userID);
            const channel = <TextChannel>guild?.channels?.cache?.get(guildConfig.birthdayChannelID);

            if (!channel || !user) return;

            await channel.send({
                content: `:cake: ${lang.getGlobal(
                    "BIRTHDAYS_MESSAGE",
                    [
                        { old: "user", new: user.toString() }
                    ]
                )}`
            }).then((m) => {
                m.react("🎂");
                client.database.birthdays.delivered(user.id, new Date().getFullYear().toString())
            })
        }
    }, 60000)
}