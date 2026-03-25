import { DiscordEvent } from "@kyvrixon/utils";
import { MessageFlags } from "discord.js";

export default new DiscordEvent({
	type: "custom",
	name: "int-button",
	once: false,
	async method(_client: Luna.Client.Bot, interaction) {
		const customId = interaction.customId;
		if (!customId.startsWith("aichatbot:")) return;

		switch (customId.split(":")[1]) {
			case "content-warning": {
				void interaction.reply({
					flags: [MessageFlags.Ephemeral],
					content:
						"Luna flagged your message as potentially violating the guidelines (e.g. harassment, hate speech, explicit content, or other unsafe topics).\n**This system is AI-based and not perfect.**\n\nIf you believe this is a mistake, please contact a staff member!",
				});
				break;
			}
		}
	},
});
