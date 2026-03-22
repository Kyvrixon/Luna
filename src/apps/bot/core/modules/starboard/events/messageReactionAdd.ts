import { config } from "@config";
import { DiscordEvent } from "@kyvrixon/utils";
import {
	ActionRowBuilder,
	type Attachment,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	ContainerBuilder,
	escapeMarkdown,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";

const c = config.modules.starboard;

function addSeparator(base: ContainerBuilder): ContainerBuilder {
	return base.addSeparatorComponents(
		new SeparatorBuilder()
			.setDivider(true)
			.setSpacing(SeparatorSpacingSize.Small),
	);
}

export default new DiscordEvent({
	type: "client",
	once: false,
	name: "messageReactionAdd",
	async method(client: Luna.Client.Class, reaction) {
		if (reaction.emoji.name !== c.emoji) return;

		reaction = await reaction.fetch();
		if (reaction.count !== c.triggerAmount) return;

		const ch = client.mainGuild.channels.cache.get(c.channelId);
		if (!ch?.isTextBased() || ch.type !== ChannelType.GuildText) return;

		const m = reaction.message;
		if (!m.inGuild()) return;

		const ogChnl = client.mainGuild.channels.cache.get(m.channelId);
		if (!ogChnl) return;

		const ok = await client.r.send("SET", [
			"cooldowns:starboard",
			"1",
			"NX",
			"EX",
			String(c.cooldownSeconds),
		]);

		if (ok !== "OK") {
			return void m.reply("Starboard is on cooldown!");
		}

		const _m = await m.reply("Sending ...");
		const files: Attachment[] = [];
		const time = Math.floor(m.createdTimestamp / 1000);
		const content = m.content.trim();

		const base = new ContainerBuilder()
			.setAccentColor(
				config.colours.parse(config.colours.pastel.purple, "tuple"),
			)
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								`> **Author:** <@${m.author.id}> (\`${m.author.id}\`)`,
								`> **Channel:** <#${m.channel.id}> (${ogChnl.name})`,
								`> **Created at:** <t:${time}:f> (<t:${time}:R>)`,
								`> **Jump to message:** [Click me!](${m.url})`,
							].join("\n"),
						),
					)
					.setThumbnailAccessory(
						new ThumbnailBuilder()
							.setDescription(`Avatar of ${m.author.username}`)
							.setURL(
								m.author.displayAvatarURL({ size: 4096, forceStatic: false }),
							),
					),
			);

		const mediaItems: MediaGalleryItemBuilder[] = [];
		if (m.attachments.size >= 1) {
			m.attachments
				.filter((att) => att.contentType?.startsWith("image"))
				.forEach((att) => {
					files.push(att);
					mediaItems.push(new MediaGalleryItemBuilder().setURL(att.url));
				});
		}

		if (
			/https:\/\/(tenor\.com|media\.discordapp\.com|discord\.com\/attachments\/)/.test(
				content,
			) &&
			content.split(/\s+/).length === 1
		) {
			mediaItems.push(new MediaGalleryItemBuilder().setURL(content));
		}

		if (mediaItems.length >= 1) {
			addSeparator(base);

			base.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(...mediaItems),
			);
		}

		if (content.length > 0) {
			addSeparator(base);

			base.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					escapeMarkdown(content, { heading: true }),
				),
			);
		}

		const __m = await ch.send({
			files,
			flags: [MessageFlags.IsComponentsV2],
			components: [base],
			allowedMentions: {
				parse: [],
				users: [m.author.id],
			},
		});

		await _m.edit({
			content: "Done!",
			components: [
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL(__m.url)
						.setLabel("View"),
				),
			],
		});
		return;
	},
});
