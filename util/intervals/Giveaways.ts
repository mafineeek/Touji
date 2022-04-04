import { r } from "rethinkdb-ts";
import Bot from "../Bot";

export default function loadGiveaways(client: Bot) {
    r.table('giveaways').indexWait().run(client.database.connection);
    setInterval(async () => {
        for (const giveaway of await r.table("giveaways").between(
            [r.minval], [Date.now()], { index: "getTime" }
        ).filter({ ended: false }).run(client.database.connection)) {
            client.database.giveaways.reroll(giveaway)
        }
    }, 10000)
}