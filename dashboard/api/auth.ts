const scopes = ["identify", "guilds"];
import passport from "passport";
import { Strategy } from "passport-discord";
import Config from '../../data/Config'

export default async (app: any) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done) => {
    done(null, obj);
  });

  passport.use(
    new Strategy(
      {
        clientID: Config.BETA ? Config.DASHBOARD.BETA.clientID : Config.DASHBOARD.STABLE.clientID,
        clientSecret: Config.BETA ? Config.DASHBOARD.BETA.clientSecret : Config.DASHBOARD.STABLE.clientSecret,
        callbackURL: Config.BETA ? Config.DASHBOARD.BETA.redirect : Config.DASHBOARD.STABLE.redirect,
        scope: scopes,
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        process.nextTick(() => {
          return done(null, profile);
        });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.passport = passport;
};