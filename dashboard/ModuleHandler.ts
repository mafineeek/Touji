import Dashboard from "./modules/dashboard";
import Leaderboard from "./modules/leaderboard";
import Commands from './modules/commands'
export default async (app: any) => {
  Dashboard(app);
  Leaderboard(app);
  Commands(app);
};
