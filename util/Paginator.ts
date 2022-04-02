import Discord from "discord.js";

export default async function paginator(interaction: Discord.CommandInteraction, pages: Discord.MessageEmbed[]) {
    let page = 0;

    await interaction.followUp({
        embeds: [pages[page]],
        components: [new Discord.MessageActionRow().addComponents([
            new Discord.MessageButton().setEmoji("863335576438308895").setCustomId("back").setStyle("DANGER").setDisabled(pages[page - 1] === undefined),
            new Discord.MessageButton().setEmoji("863335400649916416").setCustomId("stop").setStyle("DANGER"),
            new Discord.MessageButton().setEmoji("868904802006999081").setCustomId("next").setStyle("DANGER").setDisabled(pages[page + 1] === undefined)
        ])]
    });

    const currentPage = await interaction.fetchReply();

    const filter = (i: Discord.ButtonInteraction) => ["back", "stop", "next"].includes(i.customId) && i.user.id === interaction.user.id
    const collector = currentPage.createMessageComponentCollector(
        { filter, time: 90000, componentType: 'BUTTON' }
    );

    collector.on("collect", async (interaction: Discord.ButtonInteraction) => {
        switch (interaction.customId) {
            case "back":
                page = page > 0 ? page -1 : pages.length - 1;
                break;
            case "stop":
                await collector.stop();
                break;
            case "next":
                page = page + 1 < pages.length ? page +1 : 0;
                break;
        }
        if (interaction.customId !== "stop") currentPage.edit({ embeds: [pages[page]], components: [
            new Discord.MessageActionRow().addComponents([
                new Discord.MessageButton().setEmoji("863335576438308895").setCustomId("back").setStyle("DANGER").setDisabled(pages[page - 1] === undefined),
                new Discord.MessageButton().setEmoji("863335400649916416").setCustomId("stop").setStyle("DANGER"),
                new Discord.MessageButton().setEmoji("868904802006999081").setCustomId("next").setStyle("DANGER").setDisabled(pages[page + 1] === undefined)
            ])
        ]});

        await interaction.deferUpdate()
    });

    collector.on('end', () => {
        if (!currentPage.deleted) currentPage.edit({ embeds: currentPage.embeds, components: [] })
    });

    return currentPage;
}