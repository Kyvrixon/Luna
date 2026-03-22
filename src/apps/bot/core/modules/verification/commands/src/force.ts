import { config } from "@config";
import {
	ContainerBuilder,
	MessageFlags,
	TextDisplayBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export async function force(
	client: Luna.Client.Class,
	int: ChatInputCommandInteraction,
): Promise<void> {
	const user = int.options.getUser("target", true);
	const um = client.mainGuild.members.cache.get(int.user.id);

	if (!um?.permissions.has("Administrator", true)) {
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

	const member = client.mainGuild.members.cache.get(user.id);
	if (!member) {
		return void int.reply({
			flags: [MessageFlags.IsComponentsV2],
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
							`\`⚠️\` | <@${user.id}> **\`${user.username}\`** is not a member of the server!`,
						),
					),
			],
		});
	}

	if (member.roles.cache.has("1376430036826984448")) {
		return void int.reply({
			flags: [MessageFlags.IsComponentsV2],
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
							`\`⚠️\` | <@${user.id}> **\`${user.username}\`** has already been verified!`,
						),
					),
			],
		});
	}

	await member.roles.add("1376430036826984448");
	
	// TODO [Modules#quarantine]: remove quarantine role here	

	return void int.reply({
		flags: [MessageFlags.IsComponentsV2],
		allowedMentions: {
			parse: [],
		},
		components: [
			new ContainerBuilder()
				.setAccentColor(
					config.colours.parse(config.colours.pastel.green, "tuple"),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						`\`✅\` | <@${user.id}> **\`${user.username}\`** has been manually verified!`,
					),
				),
		],
	});
}
