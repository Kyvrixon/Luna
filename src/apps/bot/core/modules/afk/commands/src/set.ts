import {
	ContainerBuilder,
	TextDisplayBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { colours } from "src/apps/bot/structures/constants";

export async function set(
	client: Luna.Client.Class<true>,
	int: ChatInputCommandInteraction,
): Promise<void> {
	await int.deferReply({ flags: ["Ephemeral"], withResponse: true });

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
		flags: ["IsComponentsV2"],
		components: [
			new ContainerBuilder()
				.setAccentColor(Number(`0x${colours.pastel.green}`))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						`\`✅\` | AFK message set to **${afkMessage}**`,
					),
				),
		],
	});
}
