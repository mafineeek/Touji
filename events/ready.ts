import { Event as BaseEvent } from "../types";
import Bot from "../util/Bot";

import "../dashboard";

export default class Event implements BaseEvent {
    public readonly name = "ready" as const;
    public async run(client: Bot) {
        client.logger.success(`${client.user!.tag} is ready.`);
    }
}