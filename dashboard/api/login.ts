import checkAuth from '../middlewares/checkAuth';
import {Request, Response} from "express";
export default async (app: any) => {
    app.get("/dashboard/api/auth", app.passport.authenticate("discord"));

    app.get("/dashboard/api/auth/callback", app.passport.authenticate("discord", {failureRedirect: "/dashboard/api/auth"}), (req: Request, res: Response) => {
            res.redirect("/dashboard");
    });

    app.get('/dashboard/api/auth/logout', checkAuth, (req: Request, res: Response) => {
        (req as any).session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });
}