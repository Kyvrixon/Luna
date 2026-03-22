import { config } from "@config";
import { DiscordEvent } from "@kyvrixon/utils";
import {
	ContainerBuilder,
	MessageFlags,
	MessageType,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";

export default new DiscordEvent({
	type: "client",
	name: "messageCreate",
	once: false,
	async method(_client: Luna.Client.Class, message) {
		if (!message.guild || message.type !== MessageType.GuildBoost) return;
		const notifChannel = message.guild.channels.cache.get(
			"1376439217252732950",
		);
		
		if (
			!notifChannel ||
			!notifChannel.isSendable() ||
			!notifChannel.isTextBased()
		)
			return;

		notifChannel.send({
			flags: [MessageFlags.IsComponentsV2],
			components: [
				new ContainerBuilder()
					.setAccentColor(
						config.colours.parse(config.colours.pastel.pink, "tuple"),
					)
					.addSectionComponents(
						new SectionBuilder()
							.addTextDisplayComponents(
								new TextDisplayBuilder().setContent(
									[
										"## <a:T_gemheart:1465139278865498153> New Boost <a:T_gemheart:1465139278865498153>",
										"\n\n",
										`Thankyou so much <@${message.author.id}> for the boost <3`,
										"\n",
										"-# Open a ticket in <#1376452435303862313> to claim your perks!",
									].join(""),
								),
							)
							.setThumbnailAccessory(
								new ThumbnailBuilder().setURL(
									message.author.displayAvatarURL({
										forceStatic: false,
										size: 4096,
									}),
								),
							),
					),
			],
		});
	},
});
