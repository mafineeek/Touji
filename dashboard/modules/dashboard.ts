import Config from "../../data/Config";

import Discord from 'discord.js'
import checkAuth from "../middlewares/checkAuth";
import { client } from "../..";
export default async (app: any) => {
  app.get("/dashboard", checkAuth, (req: any, res: any) => {
    res.render("dashboard", {
      pageTitle: "Touji | Panel",
      user: req.user,
      bot: client,
      discord: Discord,
    });
  });

  app.get(
    "/dashboard/:ID",
    checkAuth,
    async (req: any, res: any) => {
      const guild = client.guilds.cache.get(req.params.ID);
      if (!guild) return res.redirect("/dashboard");
      const member = await guild.members.fetch(req.user.id).catch(() => {});
      if (!member) return res.redirect("/dashboard");
      if (
        !member.permissions.has("ADMINISTRATOR") &&
        !Config.PERMISSIONS.developer.includes(member.id)
      )
        return res.redirect("/dashboard");

      res.render("manage", {
        pageTitle: "Touji | Panel Serwera",
        user: req.user,
        member: member,
        guild: guild,
        bot: client,
        discord: Discord,
      });
    }
  );
};