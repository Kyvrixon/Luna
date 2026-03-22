import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../.generated/prisma/client";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { LoggerModule } from "@kyvrixon/utils";
import { env } from "bun";

new LoggerModule().notif(`Using DB file at: ${resolve(cwd(), env.DB_URL)}`);

export function initPrismaClient() {
	const client = new PrismaClient({
		adapter: new PrismaLibSql({
			url: `file:${env.DB_URL}`,
		}),
	});

	client
		.$connect()
		.then(() =>
			client.$executeRaw`PRAGMA journal_mode = WAL;`.then(() =>
				new LoggerModule().notif("WAL mode enabled!"),
			),
		);
	return client;
}
