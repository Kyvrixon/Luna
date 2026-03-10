import { env } from "bun";
import { initPrismaClient } from "../../structures/PrismaClient";
import { LoggerModule } from "@kyvrixon/utils";

const log = new LoggerModule();

log.divider("Starting Database Seeding");

const prisma = initPrismaClient();

log.notif("Connecting to db");
await prisma.$connect();
log.notif("DB connected");

// Create guild defaults
const guildId = env.SERVER_ID;

await Promise.allSettled([
	await prisma.guild
		.upsert({
			create: {
				guildId,
			},
			where: {
				guildId,
			},
			update: {
				guildId,
			},
		})
		.then(() => log.notif("Done guild upsert")),

	// Create bot cache
	prisma.bot
		.upsert({
			create: {
				id: 1,
			},
			update: {
				id: 1,
			},
			where: {
				id: 1,
			},
		})
		.then(() => log.notif("Done bot upsert")),
]);

log.divider("Finished");

process.exit(0);
