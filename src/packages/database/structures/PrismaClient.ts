import { env } from "bun";
import { PrismaClient } from "../.generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function initPrismaClient() {
	return new PrismaClient({
		adapter: new PrismaPg({
			connectionString: env.DB_URL,
		}),
	});
}
