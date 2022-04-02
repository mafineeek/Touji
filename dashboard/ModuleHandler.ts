import {readdirSync} from "fs";
import Auth from './api/auth';
import Login from './api/login';
export default async (app: any) => {
    Auth(app);
    Login(app);

    const array = readdirSync("./dashboard/modules");

    for (const ev of array){
        let _ = await import(`./modules/${ev}`);
        _.default(app);
    }
}