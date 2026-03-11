import { LoggerModule } from "@kyvrixon/utils";
import { Elysia, type ElysiaConfig } from "elysia";
import { ip } from "elysia-ip";
import { rateLimit } from "elysia-rate-limit";
// import chalk from "../../../../node_modules/chalk";
import { startTimePlugin } from "../core/plugins/startTime";
import { initPrismaClient } from "src/packages/database/structures/PrismaClient";

// const statusColour = (s: number) =>
// 	s >= 500
// 		? chalk.red
// 		: s >= 400
// 			? chalk.yellow
// 			: s >= 300
// 				? chalk.cyan
// 				: s >= 200
// 					? chalk.green
// 					: chalk.magenta;

// const methodColour: Record<string, typeof chalk> = {
// 	GET: chalk.hex("#22C55E"),
// 	POST: chalk.hex("#3B82F6"),
// 	PUT: chalk.hex("#F59E0B"),
// 	PATCH: chalk.hex("#A855F7"),
// 	DELETE: chalk.hex("#EF4444"),
// 	OPTIONS: chalk.hex("#64748B"),
// 	HEAD: chalk.hex("#06B6D4"),
// };

export class WebServer extends Elysia {
	public port: number;
	public log = new LoggerModule();
	public db = initPrismaClient();

	constructor(
		config: ElysiaConfig<undefined> & {
			port: number;
		},
	) {
		super(config);
		this.port = config.port;
	}

	async kill() {
		await this.stop();
	}

	init(): this {
		void this.use(startTimePlugin)
			.use(ip())
			.use(
				rateLimit({
					max: 15,
					duration: 1,
					headers: false,
					countFailedRequest: true,
					scoping: "global",
				}),
			)
			// .onAfterHandle(({ startTime, path, request, set, ip }) => {
			// 	const rawMethod = request.method.toUpperCase();
			// 	const paddedMethod = rawMethod
			// 		.padStart(Math.ceil((7 + rawMethod.length) / 2))
			// 		.padEnd(7);
			// 	let stat: number;
			// 	if (set.status) {
			// 		if (typeof set.status === "string") {
			// 			stat = StatusMap[set.status];
			// 		} else {
			// 			stat = set.status as number;
			// 		}
			// 	} else {
			// 		stat = -1;
			// 	}

			// 	this.log.debug(
			// 		`[HTTP]: ${methodColour[rawMethod]?.(paddedMethod) ?? paddedMethod} ${path} ${statusColour(stat)(stat)} ${chalk.dim(
			// 			`[${formatSeconds((nanoseconds() - startTime) / 1_000_000_000).padEnd(8)}] ; ${ip === "::1" ? "localhost" : ip}`,
			// 		)}`,
			// 	);
			// })
			.onError(({ code, error }) => {
				switch (code) {
					// Unknown
					case "UNKNOWN": {
						break;
					}
					// Parse error
					case "PARSE": {
						break;
					}
					// File type invalid
					case "INVALID_FILE_TYPE": {
						break;
					}
					// Cookie signature invalid
					case "INVALID_COOKIE_SIGNATURE": {
						break;
					}
					// Validation failed
					case "VALIDATION": {
						break;
					}
					// Route does not exist
					case "NOT_FOUND": {
						break;
					}
					// Critical server error
					case "INTERNAL_SERVER_ERROR": {
						break;
					}
					// Invalid error code
					default: {
						this.log.error(error);
						break;
					}
				}
			})

			// ==================================================
			//                       Routes
			// ==================================================
			.get("/", ({ set }) => {
				set.status = 200;
				set.headers["content-type"] = "text/plain";
				return "OK";
			})
		return this;
	}

	start() {
		void this.listen(
			this.port,
			() => void this.log.notif(`Webserver online on port ${this.port}`),
		);
	}
}
