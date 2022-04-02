import Moderator from "./defaults/Moderator";
import User from "./defaults/User";
import Administrator from "./defaults/Administrator";
import Owner from "./defaults/Owner";
import Developer from "./defaults/Developer";

export default {
    ...User,
    ...Moderator,
    ...Administrator,
    ...Owner,
    ...Developer
}