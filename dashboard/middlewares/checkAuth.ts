export default async (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.redirect(
      "/dashboard/api/auth"
    );
}