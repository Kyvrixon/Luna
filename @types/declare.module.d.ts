/** biome-ignore-all lint/suspicious/noExplicitAny: ~ */
import type {
	ButtonInteraction,
	ChannelSelectMenuInteraction,
	MentionableSelectMenuInteraction,
	ModalSubmitInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
} from "discord.js";

// ===========================================================

interface CustomIntEventsMapping {
	// Interactions
	"int-button": [interaction: ButtonInteraction];
	"int-modalsubmit": [interaction: ModalSubmitInteraction];
	"int-roleselect": [interaction: RoleSelectMenuInteraction];
	"int-userselect": [interaction: UserSelectMenuInteraction];
	"int-stringselect": [interaction: StringSelectMenuInteraction];
	"int-channelselect": [interaction: ChannelSelectMenuInteraction];
	"int-mentionableselect": [interaction: MentionableSelectMenuInteraction];

	// Misc discord events
	raw: [payload: any];
}

type MergedCustomEventsMapping = CustomIntEventsMapping;

declare module "@kyvrixon/utils" {
	interface DiscordEventCustomType extends MergedCustomEventsMapping {}
}

export default void null;
