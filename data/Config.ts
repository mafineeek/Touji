export default class Config {
  static BETA = true;
  static BETA_TOKEN =
    "OTU4NDU1MDI2OTA3NDk2NTI5.YkNkzQ.lmjWvywUAU8HIW44xKO8yJvghp0";
  static TOKEN = "OTU5NTYxMzc2NDIwOTkxMDM3.YkdrKw.eAJCBc9uq_aeepJYA4EMJ5HEPA0";
  static DEFAULTS = {
    language: "en",
    modLogChannelID: null,
    starboardBannedUsers: [],
    joinRoleIds: [],
    levelNeededXP: 200,
  };
  static PRESENCE_DATA = {
    status: "idle",
    activities: [
      {
        name: "@Touji",
        type: 2,
      },
    ],
  };
  static CONSTANTS = {
    supportServerID: "831509637999493121",
    developerRoleID: "958455859799797770",
    developerServerID: "862738841165496341" //"941643779830612028",
  };
  static PERMISSIONS = {
    developer: ["831474539053449227", "854342480019587133"],
  };
  static KEYS = {
    alexFlipnote: "5F5m6DVpbToTW_opFsxcnT89GDc8KgqYOQ1gwiCS",
    mee6: "Yjg5ZmRiMDFjMTAwMDBi.NjI0NWUzOTc=.nUTnKa8_Pn40-J3sNX2sbwDRfnI",
  };
  static DASHBOARD = {
    BETA: {
      clientID: "958455026907496529",
      clientSecret: "zFWV5gofv0dR0fwxaM2yZX2CAf3dO0Bi",
      redirect: "http://localhost:3000/auth-callback",
    },
    STABLE: {
      clientID: "959561376420991037",
      clientSecret: "gUHZUPlW2HXmH1pEtM_5k0bNI-XcJvyK",
      redirect: "https://toujibot.com/auth-callback",
    },
  };
  static ERROR_WEBHOOKS = [
    "https://canary.discord.com/api/webhooks/961665455909638176/Ld_JAWK6HVhDmcg6O9oNcqM90ElKcxd48plzxg8rvl_x2m9fiPkNQRVctTSEnZopeMY-",
  ];
}