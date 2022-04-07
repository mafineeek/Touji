import checkAuth from '../middlewares/checkAuth';
import {Request, Response} from "express";
export default async (app: any) => {
    app.get("/dashboard/api/auth", (req: Request, res: Response) => {
        res.redirect('https://discord.com/oauth2/authorize?response_type=code&client_id=958455026907496529&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fapi%2Fauth%2Fcallback&scope=identify%20guilds');
    });

    app.get("/dashboard/api/auth/callback", app.get('passport').authenticate("discord", {failureRedirect: "/dashboard/api/auth"}), (req: Request, res: Response) => {
            res.redirect("/dashboard");
    });

    app.get('/dashboard/api/auth/logout', checkAuth, (req: Request, res: Response) => {
        (req as any).session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });
}