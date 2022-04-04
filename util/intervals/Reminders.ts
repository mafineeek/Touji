import { r } from "rethinkdb-ts";
import Bot from "../Bot";

export default function loadReminders(client: Bot) {
    setInterval(async () => {
        for (const reminder of await r.table("reminders").between(
            [r.minval], [Date.now()], { index: "getAll" }
        ).run(client.database.connection)) {
            const user = await client.users.fetch(reminder.userID).catch(() => null);
            if (!user) return;

            await user.send({ content: `>>> <:timer:863336720560291841> **#${reminder.id}**\n\n${reminder.content}` });
            await client.database.reminders.remove(reminder.id);
        }
    }, 10000)
}