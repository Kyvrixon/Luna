import { DiscordEvent } from "@kyvrixon/utils";
import { ActivityType } from "discord.js";

function updatePresence(c: Luna.Client.Class): void {
	void c.user.setPresence({
		status: "online",
		activities: [
			{
				name: "~",
				state: `Babysitting ${c.mainGuild.memberCount} people`,
				type: ActivityType.Custom,
				url: undefined,
			},
		],
	});
}

export default new DiscordEvent({
	type: "client",
	name: "clientReady",
	once: true,
	async method(client: Luna.Client.Class) {
		client.registerCommands();

		updatePresence(client);
		setInterval(() => updatePresence(client), 30_000);

		client.log.notif(`${client.user.username} is online!`);
	},
});
