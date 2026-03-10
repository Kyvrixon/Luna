import { nanoseconds } from "bun";
import { Elysia } from "elysia";

export const startTimePlugin = new Elysia({
	name: "startTimePlugin",
}).derive({ as: "global" }, function startTime(): {
	startTime: number;
} {
	return {
		startTime: nanoseconds(),
	};
});
