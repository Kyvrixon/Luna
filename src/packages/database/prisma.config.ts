import { defineConfig } from "prisma/config";
import { env } from "bun";

export default defineConfig({
	schema: "./core/schema",
	migrations: {
		path: "./.generated/migrations",
	},
	datasource: {
		url: env.DB_URL,
	},
});
