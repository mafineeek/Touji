import { r, Connection } from 'rethinkdb-ts';
import { omit } from "lodash";

export default async function(connection: Connection) {
    const { default: databaseConfig } = require('../../data/Database');

    // Databases
    for (const db of databaseConfig.requiredDBs) {
        const dbList = await r.dbList().run(connection);
        if (!dbList.includes(db)) await r.dbCreate(db).run(connection)
    }

    // Tables
    for (const table of databaseConfig.requiredTables) {
        const tableList = await r.db("Touji").tableList().run(connection);
        if (typeof table === "object") {
            if (!tableList.includes(table.name)) await r.db("Touji").tableCreate(table.name, omit(table, "name")).run(connection)
        } else {
            if (!tableList.includes(table)) await r.db("Touji").tableCreate(table).run(connection)
        }
    }

    // Indexes
    for (const [k, v] of Object.entries<[string, string[]][]>(databaseConfig.indexes)) {
        v.forEach(async (index: [string, string[]]) => {
            const indexList = await r.db("Touji").table(k).indexList().run(connection);

            // Regenerate indexes
            if (indexList.includes(index[0])) await r.db("Touji").table(k).indexDrop(index[0]).run(connection);

            await r.db("Touji").table(k).indexCreate(index[0], index[1].map((i) => r.row(i))).run(connection).catch(() => false)
        })
    }
}