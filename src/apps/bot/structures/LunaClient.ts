import { DiscordCommand, DiscordEvent, LoggerModule } from "@kyvrixon/utils";
import { env } from "bun";
import { Client as DJSClient, REST, Routes } from "discord.js";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { initPrismaClient } from "src/packages/database/structures/PrismaClient";

export class LunaClient<
	Ready extends boolean = boolean,
> extends DJSClient<Ready> {
	public commands = new Map<string, DiscordCommand<this>>();
	public log = new LoggerModule();
	public db = initPrismaClient();
	private flags = {
		inited: false,
		registered: false,
		loaded: false,
	};

	get mainGuild() {
		const g = this.guilds.cache.get(env.SERVER_ID);
		if (!g)
			throw new Error(
				"Guild specified in 'env.SERVER_ID' does not exist in the cache!",
			);

		return g;
	}

	async init() {
		if (!this.flags.inited) {
			this.flags.inited = true;

			await this.db.$connect();

			this.log.notif("Starting client");
			await this.loadModules();

			this.log.notif("Logging in ...");
			await this.login(env.BOT_TOKEN);
		}
	}

	async loadModules() {
		if (!this.flags.loaded) {
			const root = join(cwd(), "src", "apps", "bot", "core", "modules");
			for await (const _module of (
				await readdir(root, {
					recursive: false,
					withFileTypes: true,
				})
			)
				.filter((x) => x.isDirectory())
				.map((x) => x.name)) {
				for await (const filepath of new Bun.Glob("**/**.{ts}").scan({
					cwd: join(root, _module),
					absolute: true,
					throwErrorOnBrokenSymlink: true,
					dot: false,
					onlyFiles: true,
					followSymlinks: true,
				})) {
					const importedModule = (await import(filepath)).default as unknown;
					if (!importedModule) {
						continue;
					}

					switch (true) {
						case importedModule instanceof DiscordCommand: {
							if (this.commands.has(importedModule.data.name)) {
								this.log.alert(
									`Skipping duplicate command: '${importedModule.data.name}' at path '${filepath}'`,
								);
								continue;
							}

							this.commands.set(importedModule.data.name, importedModule);
							break;
						}

						case importedModule instanceof DiscordEvent: {
							const e = importedModule;

							if (e.type === "rest") {
								this.rest[e.once ? "once" : "on"](
									e.name,
									// @ts-expect-error ts(7019) Untyped
									(...args) => e.method(this, ...args),
								);
							} else {
								this[e.once ? "once" : "on"](e.name, (...args) =>
									e.method(this, ...args),
								);
							}

							break;
						}
					}
				}
			}
		}
		this.flags.loaded = true;
	}

	async registerCommands() {
		if (!this.flags.registered) {
			const R = new REST().setToken(env.BOT_TOKEN);
			if (env.RESET_COMMANDS && env.RESET_COMMANDS === "yes") {
				this.log.alert("'RESET_COMMANDS' flag is enabled!");
				this.log.notif("Clearing commands ...");
				await R.put(
					Routes.applicationGuildCommands(
						(this.user as Luna.Client.Class<true>["user"]).id,
						env.SERVER_ID,
					),
					{
						body: [],
					},
				);
				await R.put(
					Routes.applicationCommands(
						(this.user as Luna.Client.Class<true>["user"]).id,
					),
					{
						body: [],
					},
				);
				this.log.notif(
					"Commands cleared! Remember to disable 'RESET_COMMANDS' env flag!",
				);
			}

			if (
				env.REGISTER_COMMANDS &&
				env.REGISTER_COMMANDS === "yes" &&
				this.commands.size > 0
			) {
				await R.put(
					Routes.applicationGuildCommands(
						(this.user as Luna.Client.Class<true>["user"]).id,
						env.SERVER_ID,
					),
					{
						body: [...this.commands.values().map((x) => x.data.toJSON())],
					},
				);

				this.log.notif("Commands registered");
			}

			this.flags.registered = true;
		}
	}
}
