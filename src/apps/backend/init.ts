import { WebServer } from "./structures/WebServer";
import { env } from "bun";

const server = new WebServer({
	port: Number(env.PORT),
	systemRouter: true,
	name: "@core",
	analytic: false,
});

server.init();
server.start();

async function kill(signal: string) {
	server.log.alert(`[OS]: Received signal ${signal}, shutting down ...`);
	await server.kill();
	process.exit(0);
}

process.once("SIGTERM", kill);
process.once("SIGINT", kill);
