import { Client, ClientOptions, Collection } from "discord.js";
import { readdirSync } from "fs";
import { r } from "rethinkdb-ts";
import { resolve } from "path";
import { Command, Event } from "../types";
import { client } from "../index";
import Logger from "./Logger";
import Database from "./database/Database";
import Config from "../data/Config";
import Helpers from "./Helpers"
import { REST } from "@discordjs/rest"
import { Routes, ApplicationCommandType } from 'discord-api-types/v9'
import {version} from '../package.json';
import { WebhookClient } from "discord.js";

export default class Bot extends Client {
    public commands = new Collection<string, Command>();
    public pexes: string[] = [];
    public logger = new Logger();
    public database: Database = null!;
    public helpers: typeof Helpers = Helpers;
    public version: string = version;
    private restHandler: any;
    public errorWebhook: WebhookClient = new WebhookClient({url: Config.ERROR_WEBHOOKS[0]})
    public constructor(options: ClientOptions) {
        super(options);
        this.logger.success("Client created.")
        this.restHandler = new REST({version: '9'}).setToken(Config.BETA ? Config.BETA_TOKEN : Config.TOKEN);
    }

    public getAllCommands() {
        const files: string[] = [];
        readdirSync("commands").forEach((directory: string) => {
            readdirSync(`commands/${directory}`).forEach((file: string) => {
                files.push(file)
            })
        });

        return files
    }

    public async setup() {
        try {
            this.database = new Database(await r.connect({ db: "Touji" }))
        } catch (e) {
            return this.logger.error(`Cannot connect to database.\nError: ${e}.`)
        }

        await this.login(Config.BETA ? Config.BETA_TOKEN : Config.TOKEN);

        this.logger.success(`Logged in as ${this.user!.tag}.`);
        this.user!.setPresence(Config.PRESENCE_DATA as any);
        this.logger.success(`Updated bot presence.`);
        
        require("./custom/ExtendedStructures").default();
        readdirSync("util/intervals").forEach((f: string) => {
            require(`./intervals/${f}`).default(this);
        })
        
        Config.PERMISSIONS.developer.forEach((developer: string) => {
          this.users.fetch(developer)
        })

        await this.readCommands();
        await this.readEvents();
    }

    private async readCommands() {
      this.pexes.push('*')
        for (const directory of readdirSync("commands")){
            for(const file of readdirSync(`commands/${directory}`)){
                const pull = await import(resolve("commands", directory, file));
                const command = new pull.default();
                this.commands.set(command.name, command);
                this.pexes = this.pexes.concat(command.pexes);
            }
        }
        let commands = this.commands.map((c) => {
          return c.type === 2 || c.type === 3
            ? {
                type: c.type,
                name: c.name,
              }
            : {
                type: c.type || ApplicationCommandType['ChatInput'],
                name: c.name,
                description: (c.description as any)["en"] || 'Failed to load description',
                options: c.options,
                channel_types: c.channel_types || [],
              };
        });
        if (Config.BETA) {
          this.restHandler
            .put(
              Routes.applicationGuildCommands(
                <string>this.user?.id,
                Config.CONSTANTS.developerServerID
              ),
              { body: commands }
            )
            .then(() => {
              this.logger.info("Installed application commands for dev server");
            })
            .catch((e: Error) =>
              this.logger.error(
                `Error while installing application commands for dev server. Error: ${
                  e.stack ?? e
                }`
              )
            );
        }else{
          this.restHandler.put(
            Routes.applicationGuildCommands(
              <string>this.user?.id,
              Config.CONSTANTS.supportServerID
            ),
            { body: [] }
          );

          this.restHandler
            .put(Routes.applicationCommands(<string>this.user?.id), {
              body: commands,
            })
            .then(() => {
              this.logger.info("Installed application commands for all servers");
            })
            .catch((e: Error) =>
              this.logger.error(
                `Error while installing application commands for all servers. Error: ${
                  e.stack ?? e
                }`
              )
            );
        }
    }

    private readEvents() {
        readdirSync('events').forEach(async (file) => {
            const pull = await import(resolve("events", file));
            const event = new pull.default() as Event;

            this.logger.info(`Event ${event.name} loaded.`)
            this.on(event.name, (...args) => event.run(this, ...args).catch(console.log))
        })
    }
}