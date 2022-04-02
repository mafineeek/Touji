import Administrator from "./Administrator";

export default {
    ...Administrator,
    "commands.dev.*": true,
    "commands.util.permissions.global": true
}