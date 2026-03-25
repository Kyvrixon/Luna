import { config } from "@config";
import { DiscordEvent } from "@kyvrixon/utils";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
} from "discord.js";

const queue = new Set<string>();

const AI_MODEL: "haiku" | "sonnet" | "opus" = "sonnet";

export default new DiscordEvent({
	type: "client",
	name: "messageCreate",
	once: false,
	async method(client: Luna.Client.Bot, message) {
		if (
			!config.ai_enabled ||
			message.author.bot ||
			message.webhookId ||
			(message.guild &&
				!message.mentions.users?.find((u) => u.id === client.user.id))
		)
			return;

		const allowed = ["981755777754755122", "1398450651297747065"];

		// Guild-only: DMs have no `member`; do not treat missing member as "no role" or the OR
		// `!role || !allowed` will always fire in DMs and breaks bypass logic for role/allowed.
		const hasBypassRole = Boolean(
			message.guild && message.member?.roles.cache.get("1125222184533639338"),
		);
		const isAllowedUser = allowed.includes(message.author.id);

		if (!hasBypassRole && !isAllowedUser) {
			const ok = await client.r.send("SET", [
				`cooldowns:aichat:${message.author.id}`,
				"1",
				"NX",
				"EX",
				String(15),
			]);

			if (ok !== "OK" || queue.has(message.author.id)) {
				return void message.react("⌛");
			}
		}

		queue.add(message.author.id);

		let content = message.content
			.trim()
			.replace(`<@${client.user.id}>`, "")
			.slice(0, 2000)
			.trim();

		if (!content || content.length === 0) content = "Hello";

		const r = await message.react("<a:T_heartsloading:1485927931133038612>");
		const res = await client.ai.talk(
			client,
			message.author.id,
			{
				message: content,
				user_id: message.author.id,
			},
			AI_MODEL,
			2000,
		);
		const texts = res.filter((v) => v.type === "text").shift();

		if (!texts) return;

		const data = JSON.parse(texts.text) as Luna.Typings.Models.AI.output;
		const components: ActionRowBuilder<ButtonBuilder>[] = [];

		if (data.user_said_bad_things) {
			components.push(
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setCustomId("aichatbot:content-warning")
						.setLabel("but why?")
						.setStyle(ButtonStyle.Secondary),
				),
			);
		}

		r.remove().then(
			async () =>
				await message
					.reply({
						content: data.message_for_user,
						flags: [MessageFlags.SuppressNotifications],
						components,
						allowedMentions: {
							parse: [],
						},
					})
					.then(() => queue.delete(message.author.id)),
		);
	},
});
