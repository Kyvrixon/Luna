import { initPrismaClient } from "../../structures/PrismaClient";
import { LoggerModule } from "@kyvrixon/utils";

const userId = "981755777754755122";
const log = new LoggerModule();
const prisma = initPrismaClient();

log.divider("Starting Database Seeding");
log.notif("Connecting to db");

await prisma.$connect();

log.notif("DB connected");

// Create guild defaults
await Promise.allSettled([
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
