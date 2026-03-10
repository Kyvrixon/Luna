import type {
	ButtonInteraction,
	ChannelSelectMenuInteraction,
	RoleSelectMenuInteraction,
	UserSelectMenuInteraction,
	StringSelectMenuInteraction,
	MentionableSelectMenuInteraction,
	ModalSubmitInteraction,
} from "discord.js";
import type { DiscordEventCustomType } from "@kyvrixon/utils";

declare module "@kyvrixon/utils" {
	interface DiscordEventCustomType {
		"int-button": [interaction: ButtonInteraction];
		"int-channelselect": [interaction: ChannelSelectMenuInteraction];
		"int-roleselect": [interaction: RoleSelectMenuInteraction];
		"int-userselect": [interaction: UserSelectMenuInteraction];
		"int-stringselect": [interaction: StringSelectMenuInteraction];
		"int-mentionableselect": [interaction: MentionableSelectMenuInteraction];
		"int-modalsubmit": [interaction: ModalSubmitInteraction];
	}
}

declare module "discord.js" {
	interface ClientEvents extends DiscordEventCustomType {}
}

export default void null;
