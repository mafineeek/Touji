import chalk from "chalk";
import moment from "moment";
export default class Logger {
    public success(...text: string[]) { console.log(`${chalk.green(`[${moment(Date.now()).format(
        "YYYY/MM/DD HH:mm:ss"
    )}]`)} ${text.join()}`) }
    public error(...text: string[]) { console.log(`${chalk.red(`[${moment(Date.now()).format(
        "YYYY/MM/DD HH:mm:ss"
    )}]`)} ${text.join()}`) }
    public warning(...text: string[]) { console.log(`${chalk.yellow(`[${moment(Date.now()).format(
        "YYYY/MM/DD HH:mm:ss"
    )}]`)} ${text.join()}`) }
    public info(...text: string[]) { console.log(`${chalk.blue(`[${moment(Date.now()).format(
        "YYYY/MM/DD HH:mm:ss"
    )}]`)} ${text.join()}`) }
}