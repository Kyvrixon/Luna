import { DiscordEvent } from "@kyvrixon/utils";
import {
	ApplicationCommandType,
	ComponentType,
	InteractionType,
} from "discord.js";

function getCmd(name: string, client: Luna.Client.Class<true>) {
	return client.commands.get(name);
}

export default new DiscordEvent({
	type: "client",
	name: "interactionCreate",
	once: false,
	async method(client: Luna.Client.Class<true>, interaction) {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand: {
				switch (interaction.commandType) {
					case ApplicationCommandType.ChatInput: {
						void getCmd(interaction.commandName, client)?.execute(
							client,
							interaction,
						);
						break;
					}
				}
				break;
			}

			case InteractionType.ApplicationCommandAutocomplete: {
				void getCmd(interaction.commandName, client)?.autocomplete?.(
					client,
					interaction,
				);
				break;
			}

			case InteractionType.MessageComponent: {
				switch (interaction.componentType) {
					case ComponentType.Button: {
						if (interaction.customId.startsWith("~PAGINATION_")) break;

						client.emit("int-button", interaction);
						break;
					}
					case ComponentType.ChannelSelect: {
						client.emit("int-channelselect", interaction);
						break;
					}
					case ComponentType.RoleSelect: {
						client.emit("int-roleselect", interaction);
						break;
					}
					case ComponentType.UserSelect: {
						client.emit("int-userselect", interaction);
						break;
					}
					case ComponentType.StringSelect: {
						client.emit("int-stringselect", interaction);
						break;
					}
					case ComponentType.MentionableSelect: {
						client.emit("int-mentionableselect", interaction);
						break;
					}
				}
				break;
			}

			case InteractionType.ModalSubmit: {
				client.emit("int-modalsubmit", interaction);
				break;
			}
		}
	},
});
