export default class Config {
  static BETA = false;
  static BETA_TOKEN =
    "";
  static TOKEN = "";
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
    supportServerID: "",
    developerRoleID: "",
    developerServerID: "",
  };
  static PERMISSIONS = {
    developer: [""],
  };
  static KEYS = {
    alexFlipnote: "",
    mee6: "",
  };
  static DASHBOARD = {
    BETA: {
      clientID: "",
      clientSecret: "",
      redirect: "",
    },
    STABLE: {
      clientID: "",
      clientSecret: "",
      redirect: "",
    },
  };
  static ERROR_WEBHOOKS = [
    "",
  ];
}
