import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { LunaClient } from "./structures/LunaClient";

const {
	Guilds,
	GuildMessages,
	MessageContent,
	GuildMessageReactions,
	GuildMembers,
} = GatewayIntentBits;

process.once("SIGTERM", kill);
process.once("SIGINT", kill);
process.on("uncaughtException", (error, _origin) => bot.log.error(error));
process.on("unhandledRejection", (error, _origin) => bot.log.error(error));

async function kill(signal: string) {
	bot.log.alert(`[OS]: Received signal ${signal}, shutting down ...`);
	await bot.destroy();
	process.exit(0);
}

const bot = new LunaClient({
	intents: [
		Guilds,
		GuildMessages,
		MessageContent,
		GuildMessageReactions,
		GuildMembers,
	],
	partials: [Partials.Reaction, Partials.Message],
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
