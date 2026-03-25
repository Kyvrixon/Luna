import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "./core/schema",
	migrations: {
		path: "./migrations",
		seed: "bun core/scripts/seed.ts",
	},
	datasource: {
		url: "file:../../../files/db/main.db",
	},
});
