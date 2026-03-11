import { DiscordEvent, formatSeconds } from "@kyvrixon/utils";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";
import { colours } from "src/apps/bot/structures/constants";

export default new DiscordEvent({
	type: "client",
	name: "messageCreate",
	once: false,
	async method(client: Luna.Client.Class<true>, message) {
		if (!message.guild || message.author.bot || message.webhookId) return;

		const authorAfk = await client.db.afk.findFirst({
			where: { userId: message.author.id },
		});

		if (authorAfk && message.channel.isSendable()) {
			await Promise.all([
				message.channel.sendTyping().then(() =>
					message.reply({
						flags: ["IsComponentsV2"],
						allowedMentions: { parse: [], repliedUser: false },
						components: [
							new ContainerBuilder()
								.setAccentColor(Number(`0x${colours.pastel.pink}`))
								.addTextDisplayComponents(
									new TextDisplayBuilder().setContent(
										[
											`Welcome back <@${message.author.id}>!`,
											`   **Gone for:** ${formatSeconds(
												Math.floor(
													(Date.now() - authorAfk.time.getTime()) / 1000,
												),
												{
													format: "short",
													includeZeroUnits: false,
													onlyUnits: ["d", "h", "m", "s"],
												},
											)}`,
											`   **Reason:** ${authorAfk.message}`,
										].join("\n"),
									),
								),
						],
					}),
				),
				client.db.afk.delete({ where: { userId: message.author.id } }),
			]);
		}

		if (message.mentions.users.size === 0) return;

		for (const u of message.mentions.users.values()) {
			const targetAfk = await client.db.afk.findFirst({
				where: { userId: u.id },
			});
			if (!targetAfk) continue;

			const targetMember =
				client.mainGuild.members.cache.get(u.id) ||
				(await client.mainGuild.members.fetch(u.id));

			await message
				.reply({
					flags: ["IsComponentsV2"],
					allowedMentions: { parse: [], repliedUser: true },
					components: [
						new ContainerBuilder().addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								[
									`Hey! <@${targetMember.user.id}> is currently AFK!`,
									" ",
									`   **Since:** ${formatSeconds(
										Math.floor((Date.now() - targetAfk.time.getTime()) / 1000),
										{
											format: "short",
											includeZeroUnits: false,
										},
									)} ago`,
									`   **Reason:** ${targetAfk.message}`,
								].join(),
							),
						),
					],
				})
				.then((m) => {
					setTimeout(() => {
						if (m.deletable) {
							m.delete().catch(() => null);
						}
					}, 10_000);
				});
		}
	},
});
