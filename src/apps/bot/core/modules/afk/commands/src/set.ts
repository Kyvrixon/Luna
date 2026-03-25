import {
	ContainerBuilder,
	MessageFlags,
	TextDisplayBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { config } from "@config";

export async function set(
	client: Luna.Client.Bot,
	int: ChatInputCommandInteraction,
): Promise<void> {
	await int.deferReply({ flags: [MessageFlags.Ephemeral], withResponse: true });

	const afkMessage = int.options.getString("message") ?? "No reason given";
	const userId = int.user.id;

	await client.db.afk.upsert({
		where: {
			userId,
		},
		create: {
			message: afkMessage,
			user: {
				connectOrCreate: {
					where: {
						userId,
					},
					create: {
						userId,
					},
				},
			},
		},
		update: {
			message: afkMessage,
		},
	});

	int.editReply({
		flags: [MessageFlags.IsComponentsV2],
		components: [
			new ContainerBuilder()
				.setAccentColor(
					config.colours.parse(config.colours.pastel.green, "tuple"),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						`\`✅\` | AFK message set to **${afkMessage}**`,
					),
				),
		],
	});
}
