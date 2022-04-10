import Dashboard from "./modules/dashboard";
import Leaderboard from "./modules/leaderboard";
export default async (app: any) => {
  Dashboard(app);
  Leaderboard(app);
};
