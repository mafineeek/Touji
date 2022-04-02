import {readdirSync} from "fs";
import Auth from './api/auth';
import Login from './api/login';
import Dashboard from "./modules/dashboard";
import Leaderboard from "./modules/leaderboard";
export default async (app: any) => {
    Auth(app);
    Login(app);
    Dashboard(app);
    Leaderboard(app);
}