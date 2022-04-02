import {client} from '../../'
import Config from '../../data/Config'; 

export default async (app: any) => {
  app.get("/leaderboard/:ID", async (req: any, res: any) => {
    const guild = client.guilds.cache.get(req.params.ID);
    if (!guild) return res.redirect("/dashboard");
    const leveling = await client.database.levelling.getAll(guild.id);
    res.render("levels", {
      pageTitle: "Touji | Leaderboard",
      user: req.user,
      guild: guild,
      leveling: leveling,
      bot: client,
      req: req,
    });
  });
  app.get("/api/leveling/resetlevel/:gID/:ID", async (req: any, res: any) => {
    client.guilds.fetch(req.params.gID);
    const guild = client.guilds.cache.get(req.params.gID);
    if (!guild) return res.redirect("/dashboard");
    if (
      (!req.user ||
        !guild.members.cache
          .get(req.user.id)!
          .permissions.has("MANAGE_GUILD")) &&
      !Config.PERMISSIONS.developer.includes(req.user.id)
    )
      return res.redirect("/dashboard");
    if (!guild.members.cache.get(req.params.ID))
      return res.redirect("/dashboard");

    await client.database.levelling.setLevel(req.params.ID, req.params.gID, 0);
    await client.database.levelling.setXP(req.params.ID, req.params.gID, 0);

    res.redirect("/leaderboard/" + req.params.gID);
  });
};