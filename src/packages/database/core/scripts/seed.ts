import { env } from "bun";
import { initPrismaClient } from "../../structures/PrismaClient";
import { LoggerModule } from "@kyvrixon/utils";

const guildId = env.SERVER_ID;
const userId = "981755777754755122";
const log = new LoggerModule();
const prisma = initPrismaClient();

log.divider("Starting Database Seeding");
log.notif("Connecting to db");

await prisma.$connect();

log.notif("DB connected");

// Create guild defaults
await Promise.allSettled([
	prisma.guild
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
		.then(() => void log.notif("Done guild upsert")),

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
		.then(() => void log.notif("Done bot upsert")),

	// Create bot cache
	prisma.user
		.upsert({
			create: {
				userId,
			},
			update: {
				userId,
			},
			where: {
				userId,
			},
		})
		.then(() => void log.notif("Done user upsert")),
]);

log.divider("Finished");

process.exit(0);
