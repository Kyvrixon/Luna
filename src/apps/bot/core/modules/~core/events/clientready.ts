import { DiscordEvent } from "@kyvrixon/utils";
import { ActivityType } from "discord.js";

export default new DiscordEvent({
	type: "client",
	name: "clientReady",
	once: true,
	async method(client: Luna.Client.Class<true>) {
		client.registerCommands();

		setInterval(() => {
			client.user.setPresence({
				activities: [
					{
						name: "~",
						state: `Babysitting ${client.mainGuild.memberCount} people`,
						type: ActivityType.Custom,
						url: undefined,
					},
				],
			});
		}, 30_000);

		client.log.notif("Luna is online!");
	},
});
