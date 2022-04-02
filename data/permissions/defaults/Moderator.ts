import User from "./User"

export default {
    ...User,
    "commands.economy.addmoney": true,
    "commands.economy.clearinventory": true,
    "commands.economy.createitem": true,
    "commands.economy.deleteitem": true,
    "commands.economy.edititem": true,
    "commands.economy.removemoney": true,
    "commands.levelling.rolerewards": true,
    "commands.levelling.setxp": true,
    "commands.levelling.setlevel": true,
    "commands.mod.kick": true,
    "commands.mod.ban": true,
    "commands.mod.deletecase": true,
    "commands.mod.setreason": true,
    "commands.mod.unban": true,
    "commands.mod.warn": true,
    "commands.util.autorole": true,
    "commands.util.giveaway.end": true,
    "commands.util.giveaway.reroll": true,
    "commands.util.giveaway": true,
    "commands.util.snipe.delete": true,
    "commands.util.snipe.seeother": true
}