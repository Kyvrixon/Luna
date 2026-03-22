import { DiscordCommand } from "@kyvrixon/utils";
import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandUserOption
} from "discord.js";
import { force } from "./src/force";
import { send_panel } from "./src/send_panel";

export default new DiscordCommand({
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Verification module")
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("send-panel")
				.setDescription("Sends the panel"),
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("force")
				.setDescription("Manually verify a user")
				.addUserOption(
					new SlashCommandUserOption()
						.setName("target")
						.setRequired(true)
						.setDescription("The user to verify"),
				),
		),
	async execute(client: Luna.Client.Class, interaction) {
		switch (interaction.options.getSubcommand()) {
			case "force": {
				force(client, interaction);
				break;
			}
			case "send-panel": {
				send_panel(client, interaction);
				break;
			}
		}
	},
});
