import { config } from "@config";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export async function send_panel(
	client: Luna.Client.Class,
	int: ChatInputCommandInteraction,
): Promise<void> {
	const channel = client.mainGuild.channels.cache.get(
		config.modules.verify.channelId,
	);

	if (!channel || !channel.isSendable() || !channel.isTextBased()) return;

	if (
		!client.mainGuild.members.cache
			.get(int.user.id)
			?.permissions.has("Administrator", true)
	) {
		return void int.reply({
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
			allowedMentions: {
				parse: [],
			},
			components: [
				new ContainerBuilder()
					.setAccentColor(
						config.colours.parse(config.colours.pastel.yellow, "tuple"),
					)
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							`\`⚠️\` | You are not allowed to use this`,
						),
					),
			],
		});
	}

	channel.send({
		flags: [MessageFlags.IsComponentsV2],
		components: [
			new ContainerBuilder()
				.setAccentColor(
					config.colours.parse(config.colours.pastel.purple, "tuple"),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						"## <a:T_PinkStars:1359278544135389344> Verification <a:T_PinkStars:1359278544135389344>",
					),
				)
				.addSeparatorComponents(
					new SeparatorBuilder()
						.setSpacing(SeparatorSpacingSize.Large)
						.setDivider(true),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							"For the safety of the community and those within, it is mandatory for all users to pass this verification!",
							"\n",
							"You will be presented with some buttons and an emoji. You will need to quickly press the button with the given emoji to pass, not too hard!",
							"\n",
							"-# If you require assistance, please send a friend request to **`kyvrixon`**!",
						].join(""),
					),
				)
				.addActionRowComponents(
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setCustomId("verify-panel-button")
							.setEmoji("<a:T_flower:1350197072518713477>")
							.setStyle(ButtonStyle.Secondary)
							.setLabel("Begin"),
					),
				),
		],
	});

	int.reply("done");
}
