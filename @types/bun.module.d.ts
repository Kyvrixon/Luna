declare module "bun" {
	interface Env {
		BOT_TOKEN: string;
		DB_URL: string;
		SERVER_ID: string;
		PORT: string;
		RESET_COMMANDS: "yes" | "no" | undefined;
		REGISTER_COMMANDS: "yes" | "no" | undefined;
		REDIS_URL: string;
	}
}

export default void null;
