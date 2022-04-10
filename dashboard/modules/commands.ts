import { client } from "../..";
export default async (app: any) => {
    app.get('/commands', (req: any, res: any) => {
        res.render('commands', {
            pageTitle: 'Touji | Commands',
            bot: client,
        });
    })
}