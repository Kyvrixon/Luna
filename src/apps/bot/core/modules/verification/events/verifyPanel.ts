import { config } from "@config";
import { DiscordEvent } from "@kyvrixon/utils";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	ContainerBuilder,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
} from "discord.js";

// biome-ignore format: keep layout
const emojiOptions = [
	"🗝️","🍇","💀","🍊","❤️",
	"🌵","🫐","🍋","🧱","⚫",
	"🦋","🥕","🧊","🍓","🔵",
	"🌸","🥝","🍌","🪨","🔴",
	"🐸","🪻","🥥","⭐","⚪",
];

function generateOption(): (typeof emojiOptions)[number] {
	// biome-ignore lint/style/noNonNullAssertion: Exists
	return emojiOptions[Math.floor(Math.random() * emojiOptions.length)]!;
}

export default new DiscordEvent({
	type: "custom",
	once: false,
	name: "int-button",
	async method(client: Luna.Client.Class, interaction) {
		const cid = interaction.customId;
		if (cid !== "verify-panel-button") return;

		const ok = await client.r.send("SET", [
			`cooldowns:verify-panel:${interaction.user.id}`,
			"1",
			"NX",
			"EX",
			String(10),
		]);

		if (ok !== "OK") {
			return void interaction.reply({
				flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
				components: [
					new ContainerBuilder()
						.setAccentColor(
							config.colours.parse(config.colours.pastel.red, "tuple"),
						)
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								"`⌛` | Slow down! try again in a few seconds",
							),
						),
				],
			});
		}

		const correctEmojiGenerated = generateOption();
		const choisesArr =
			config.utils.shuffle<(typeof emojiOptions)[number]>(emojiOptions);

		const buttonsArr: ButtonBuilder[] = [];
		for (const entry of choisesArr) {
			buttonsArr.push(
				new ButtonBuilder()
					.setCustomId(`verify-panel:${interaction.user.id}:${entry}`)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(entry),
			);
		}

		await interaction.reply({
			flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
			components: [
				new ContainerBuilder()
					.setAccentColor(
						config.colours.parse(config.colours.pastel.pink, "tuple"),
					)
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							`Click the button with this emoji: ${correctEmojiGenerated}. You have 30 seconds`,
						),
					)
					.addSeparatorComponents(
						new SeparatorBuilder()
							.setDivider(true)
							.setSpacing(SeparatorSpacingSize.Small),
					)
					.addActionRowComponents(
						...Array.from(
							{ length: Math.ceil(buttonsArr.length / 5) },
							(_, i) =>
								new ActionRowBuilder<ButtonBuilder>().setComponents(
									buttonsArr.slice(i * 5, i * 5 + 5),
								),
						),
					),
			],
		});

		const msg = await interaction.fetchReply();
		const collector = msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 30_000,
		});

		collector.once("end", async (_collected, reason) => {
			if (reason === "time") {
				await interaction.editReply({
					components: [
						new ContainerBuilder()
							.setAccentColor(
								config.colours.parse(config.colours.pastel.red, "tuple"),
							)
							.addTextDisplayComponents(
								new TextDisplayBuilder().setContent(
									"`❌` | Verification timed out.",
								),
							),
					],
				});
			}
		});

		collector.on("collect", async (btnInt) => {
			const [, userId, btnEmoji] = btnInt.customId.split(":");

			if (userId !== btnInt.user.id) {
				collector.resetTimer();
				await btnInt.deferUpdate();
				return;
			}

			if (btnEmoji !== correctEmojiGenerated) {
				await btnInt.deferUpdate();
				await interaction.editReply({
					components: [
						new ContainerBuilder()
							.setAccentColor(
								config.colours.parse(config.colours.pastel.red, "tuple"),
							)
							.addTextDisplayComponents(
								new TextDisplayBuilder().setContent(
									"`❌` | Verification failed.",
								),
							),
					],
				});
				collector.stop();
				return;
			}

			const member = await client.mainGuild.members.fetch(interaction.user.id);

			// TODO Error handling needed
			await member.roles.add("1376430036826984448");
			await btnInt.deferUpdate();

			void interaction.editReply({
				components: [
					new ContainerBuilder()
						.setAccentColor(
							config.colours.parse(config.colours.pastel.green, "tuple"),
						)
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								[
									`\`✅\` | Verification completed! Welcome to the community, **${interaction.user.displayName}**!`,
									" ",
									"Feel free to come say hi in <#1376439217252732950>!",
								].join("\n"),
							),
						),
				],
			});

			void collector.stop();
		});
	},
});
