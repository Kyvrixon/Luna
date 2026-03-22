import { DiscordEvent } from "@kyvrixon/utils";

export default new DiscordEvent({
	type: "client",
	name: "guildMemberAdd",
	once: false,
	async method(client: Luna.Client.Class, member) {
		const channel = client.mainGuild.channels.cache.get("1376439217252732950");
		if (!channel || !channel.isSendable() || !channel.isTextBased()) return;

		void channel.send({
			content: [
				`### <a:T_PinkStars:1359278544135389344> *Welcome to the community! <@${member.id}>*`,
				`_ _　　‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎‎`,
				`_ _　‎‎　‎‎‎‎[*rules*](https://discord.com/channels/1125196330646638592/1125196331602952213)‎‎　　‎‎[*tickets*](https://discord.com/channels/1125196330646638592/1376452435303862313)　‎‎　‎‎[*roles*](https://discord.com/channels/1125196330646638592/1376418810319339590)`,
				`_ _　　‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎‎`,
				`-# _ _　 *We hope you enjoy your stay here!*`,
			].join("\n"),
		});
	},
});
