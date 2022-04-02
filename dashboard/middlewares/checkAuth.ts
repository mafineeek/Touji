export default async (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/dashboard/api/auth");
}