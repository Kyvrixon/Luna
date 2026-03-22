import { DiscordEvent } from "@kyvrixon/utils";

export default new DiscordEvent({
	type: "custom",
	name: "raw",
	once: false,
	async method(_client: Luna.Client.Class, _payload) {
		//? handles raw API events
		return;
	},
});
