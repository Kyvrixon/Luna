import { ActivityType } from "discord.js";
import { LunaClient } from "./structures/LunaClient";
import { $ } from "bun";

await $`bun deploy-db`;

const bot = new LunaClient({
	intents: [
		"Guilds",
		"GuildBans",
		"GuildMembers",
		"GuildMessages",
		"MessageContent",
	],
	shards: [0],
	shardCount: 1,
	presence: {
		shardId: 0,
		status: "online",
		activities: [
			{
				name: "~",
				type: ActivityType.Custom,
				state: "Starting up...",
				url: undefined,
			},
		],
	},
	failIfNotExists: false,
	allowedMentions: {
		parse: ["roles", "users"],
	},
});

bot.init();

async function kill(signal: string) {
	bot.log.alert(`[OS]: Received signal ${signal}, shutting down ...`);
	await bot.destroy();
	process.exit(0);
}

process.once("SIGTERM", kill);
process.once("SIGINT", kill);
