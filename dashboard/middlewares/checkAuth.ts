import authClient from '../auth/client';

export default async (req: any, res: any, next: any) => {
    if (req.cookies["user-key"] && await authClient.checkValidity(req.cookies["user-key"])) return next();
    res.redirect(
      "/auth"
    );
}