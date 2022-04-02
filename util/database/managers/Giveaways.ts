import { r, Connection } from "rethinkdb-ts";
import { TextChannel, User } from "discord.js";
import { client } from "../../../index";
import GiveawayData from "../types/Giveaway";

export default class GiveawaysManager {
    public constructor(
        private connection: Connection
    ) {}

    public async get(messageID: string): Promise<GiveawayData | null> {
        return (await r.table("giveaways").getAll([messageID], { index: "getMessage" }).coerceTo("array").run(this.connection))[0] as GiveawayData;
    }

    public async getAll(guildId: string): Promise<GiveawayData[]> {
        return await r.table("giveaways").getAll([guildId], { index: "getGuild" }).run(this.connection);
    }

    public async create(options: GiveawayData): Promise<boolean> {
        const response = await r.table("giveaways").insert(options).run(this.connection);
        return response.generated_keys?.length === 1
    }

    public async reroll(giveaway: GiveawayData) {
        const guild = await client.guilds.fetch(giveaway.guildId);
        const channel = <TextChannel>guild?.channels?.cache.get(giveaway.channelID);
        const message = await channel?.messages?.fetch(giveaway.messageID, { cache: true });
        if (!guild || !channel || !message) return await client.database.giveaways.remove(giveaway.messageID);

        const guildConfig = await client.database.guildConfig.get(guild.id);
        const lang = new LanguageHandler(guildConfig.language!);

        const winners = ((await message.reactions.cache.get("🎉")?.users.fetch())?.filter(
            (user: User) => !user.bot
        )?.random(giveaway.winnerCount) || []).map((user: User) => user.toString())

        if (!winners.length) return channel.send({
            content: lang.getGlobal("GIVEAWAYS_NOBODYREACTED")
        }).then(() => this.setEnded(giveaway.messageID, true))

        else if (winners.length < giveaway.winnerCount) return channel.send({
            content: lang.getGlobal("GIVEAWAYS_NOTENOUGHMEMBERS")
        }).then(() => this.setEnded(giveaway.messageID, true))

        await message.edit({
            embeds: [message.embeds[0].setDescription("").addField(lang.getGlobal("GIVEAWAYS_WINNERS"), winners.join(", "))]
        })
        await channel.send({ content: lang.getGlobal(
            "GIVEAWAYS_WINMESSAGE",
            [
                { old: "winners", new: winners.join(", ") },
                { old: "prize", new: giveaway.prize }
            ]
        )}).then(() => this.setEnded(giveaway.messageID, true))
    }
    public async remove(messageID: string): Promise<boolean> {
        const response = await r.table("giveaways").getAll([messageID], { index: "getMessage" }).delete().run(this.connection);
        return response.deleted === 1
    }

    public async setEnded(messageID: string, ended: boolean): Promise<boolean> {
        const response = await r.table("giveaways").getAll([messageID], { index: "getMessage" }).update({
            ended: ended
        }).run(this.connection);
        return response.replaced === 1
    }
}