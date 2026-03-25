// Init config
import "@config";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { LunaClient } from "./structures/LunaClient";

const {
	Guilds,
	GuildMessages,
	MessageContent,
	GuildMessageReactions,
	GuildMembers,
	DirectMessages,
} = GatewayIntentBits;

process.once("SIGTERM", kill);
process.once("SIGINT", kill);
process.on("uncaughtException", (error, _origin) => console.error(error));
process.on("unhandledRejection", (error, _origin) => console.error(error));

async function kill(signal: string) {
	console.log(`[OS]: Received signal ${signal}, shutting down ...`);
	await bot.kill();
	process.exit(0);
}

const bot = new LunaClient({
	intents: [
		Guilds,
		GuildMessages,
		MessageContent,
		GuildMessageReactions,
		GuildMembers,
		DirectMessages,
	],
	// Partials.Channel is required for DMs when the DM channel is not cached (discord.js docs).
	partials: [Partials.Channel, Partials.Reaction, Partials.Message],
	shards: [0],
	shardCount: 1,
	presence: {
		shardId: 0,
		status: "idle",
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
