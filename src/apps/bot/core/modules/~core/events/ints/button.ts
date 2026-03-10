import { DiscordEvent } from "@kyvrixon/utils";

export default new DiscordEvent({
	type: "custom",
	name: "int-button",
	once: false,
	async method(_client: Luna.Client.Class<true>, int) {
		if (int.customId.startsWith("~PAGINATION_")) return;
	},
});
