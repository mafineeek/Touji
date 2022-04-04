import { r } from "rethinkdb-ts";
import Bot from "../Bot";

export default function loadTempbans(client: Bot) {
    r.table("punishments").indexWait().run(client.database.connection);
    setInterval(async () => {
        for (const tempban of await r.table("punishments").between(
            [1], [Date.now()], { index: "getTime" }
        ).run(client.database.connection).catch(() => client.logger.error("Cannot get punishment's getTime index.") as any) || []) {
            const guild = client.guilds.cache.get(tempban.guildId);
            if (!guild) return client.database.case.remove(tempban.caseID);

            guild.members.unban(tempban.userID, "Tempban end").catch(() => false);
            client.database.case.remove(tempban.caseID)
        }
    }, 10000)
}