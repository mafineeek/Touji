import { Router, Request, Response } from "express";
import client from "../auth/client";
import passport from "passport";
const router = Router();
import Config from "../../data/Config";

const CLIENT_ID = Config.BETA
  ? Config.DASHBOARD.BETA.clientID
  : Config.DASHBOARD.STABLE.clientID;
const CLIENT_SECRET = Config.BETA
  ? Config.DASHBOARD.BETA.clientSecret
  : Config.DASHBOARD.STABLE.clientSecret;
const REDIRECT_URI = Config.BETA
  ? Config.DASHBOARD.BETA.redirect
  : Config.DASHBOARD.STABLE.redirect;

router.get("/auth-callback", async (req, res) => {
  if (req.query.state && req.query.code && req.cookies["user-state"]) {
    if (req.query.state === req.cookies["user-state"]) {
      const userKey = await client
        .getAccess(req.query.code)
        .catch(console.error);
      res.cookie("user-state", "deleted", { maxAge: -1 });
      res.cookie("user-key", userKey);
      res.redirect("/user");
    } else {
      res.send("States do not match. Nice try hackerman!");
    }
  } else {
    res.send("Invalid login request.");
  }
});
router.get("/auth", async(req, res) => {
  if (req.cookies["user-key"]) {
    try {
      const keyValidity = await client.checkValidity(req.cookies["user-key"]);
      if (keyValidity.expired) {
        const newKey = await client.refreshToken(req.cookies["user-key"]);
        res.cookie("user-key", newKey);
        res.redirect("/user");
      } else {
        res.redirect("/user");
      }
    } catch (err) {
      console.error(err);
      const { link, state } = client.auth;
      res.cookie("user-key", "deleted", { maxAge: -1 });
      res.cookie("user-state", state);
      res.redirect('/dashboard')
    }
} else {
    const { link, state } = client.auth;
    res.cookie("user-state", state);
    res.redirect(link)
  }
});

export default router;
