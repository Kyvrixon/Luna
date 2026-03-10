import { DiscordCommand } from "@kyvrixon/utils";
import { SlashCommandBuilder } from "discord.js";
import * as T from "transcriptify";
import { join } from "node:path";
import { cwd } from "node:process";

export default new DiscordCommand({
	data: new SlashCommandBuilder().setName("test").setDescription("idk lol"),
	async execute(_client, interaction) {
		if (interaction.user.username !== "kyvrixon") {
			interaction.reply({
				content: "no",
				flags: ["Ephemeral"],
			});
			return;
		}

		if (interaction.channel?.isTextBased()) {
			await interaction.reply("working, just wait");
			// @ts-expect-error TS(2345) Packages 'discord.js' slightly out of date
			const htmlString = await T.createTranscript(interaction.channel, {
				limit: 10
			});
			console.log("html stuff done");
			console.log(htmlString);

			await interaction.editReply("done");

			await Bun.write(join(cwd(), "files", "yeah.html"), htmlString);


		}
	},
});
