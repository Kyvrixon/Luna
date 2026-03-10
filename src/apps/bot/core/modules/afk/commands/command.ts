import { DiscordCommand } from "@kyvrixon/utils";
import { SlashCommandBuilder } from "discord.js";
import { set } from "./src/set";
import { list } from "./src/list";

export default new DiscordCommand({
	data: new SlashCommandBuilder()
		.setName("afk")
		.setDescription("AFK System")
		.addSubcommand((cmd) =>
			cmd
				.setName("set")
				.setDescription("Set yourself afk or update your message")
				.addStringOption((opt) =>
					opt
						.setName("message")
						.setDescription(
							"Reason for being AFK, or your excuse to not talk to anyone",
						)
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(250),
				),
		)
		.addSubcommand((cmd) =>
			cmd
				.setName("list")
				.setDescription("List all AFK users")
				.addIntegerOption((opt) =>
					opt
						.setName("items-per-page")
						.setDescription("How many entries per page")
						.setRequired(true),
				),
		),
	async execute(client: Luna.Client.Class<true>, interaction) {
		switch (interaction.options.getSubcommand()) {
			case "set": {
				return void set(client, interaction);
			}
			case "list": {
				return void list(client, interaction);
			}
		}
	},
});
