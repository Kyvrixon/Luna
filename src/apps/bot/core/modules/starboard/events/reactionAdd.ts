import { DiscordEvent } from "@kyvrixon/utils";

export default new DiscordEvent({
	type: "client",
	once: false,
	name: "messageReactionAdd",
	async method(client, reaction, user, details) {
		//! WIP
		return;
	},
})