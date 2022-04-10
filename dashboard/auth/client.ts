//@ts-expect-error
import Client from 'disco-oauth';
import Config from '../../data/Config';
const CLIENT_ID = Config.BETA
  ? Config.DASHBOARD.BETA.clientID
  : Config.DASHBOARD.STABLE.clientID;
const CLIENT_SECRET = Config.BETA
  ? Config.DASHBOARD.BETA.clientSecret
  : Config.DASHBOARD.STABLE.clientSecret;
const REDIRECT_URI = Config.BETA
  ? Config.DASHBOARD.BETA.redirect
  : Config.DASHBOARD.STABLE.redirect;

const client = new Client(CLIENT_ID, CLIENT_SECRET);
client.setScopes('identify', 'guilds')
client.setRedirect(REDIRECT_URI);

export default client;