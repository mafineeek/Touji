import express from "express";
import session from "express-session";
const app = express();
import flash from 'connect-flash';
import methodOverride from 'method-override'
import {client} from '../'
app.use("public", express.static(__dirname + '/public'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/css", express.static(__dirname + '/public/css'));
app.set("views", __dirname + "/views");
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride())
app.use(flash());

app.use(session({
    secret: "3927243c936f3f22f0f1d557e875fd3cf5067704c91b1371cd56bea030e9149c61fed585",
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req: any, res: any) => {
    res.render('home.ejs', {
        pageTitle: 'Touji | Home',
        bot: client,
        req
    });
});

import ModuleHandler from './ModuleHandler';
ModuleHandler(app);


app.get('*', (req: any, res: any) => {
    res.status(404).render("404.ejs", {
        pageTitle: "Touji | 404",
        bot: client
    });
});

app.use((err: Error, req: any, res: any, next: any) => {
    if (err.stack!.toString().includes("Failed to fetch user's guilds")) return res.redirect("/dashboard/api/auth");
    console.log(err.stack)
    res.status(500).render('500.ejs', {
        pageTitle: "Touji | 500",
        bot: client
    });
});


app.listen(3000);
client.logger.success(`Dashboard is listening on port 3000`)