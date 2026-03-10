import {
	createPagination,
	formatSeconds,
} from "@kyvrixon/utils";
import {
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

export async function list(
	client: Luna.Client.Class<true>,
	int: ChatInputCommandInteraction,
): Promise<void> {
	const afkData = await client.db.afk.findMany();
	const list: Array<string> = [];
	for (const entry of afkData.values()) {
		list.push(
			[
				`<@${entry.userId}>`,
				`   **Since:** ${formatSeconds(
					Math.floor((Date.now() - entry.time.getTime()) / 1000),
					{
						format: "short",
					},
				)}`,
				`   **Reason:** ${entry.message}`,
				``,
			].join("\n"),
		);
	}

	return void createPagination(
		list,
		[
			[
				{
					type: "display",
					component: new TextDisplayBuilder().setContent("AFK Users"),
				},
				{
					type: "separator",
					component: new SeparatorBuilder()
						.setDivider(true)
						.setSpacing(SeparatorSpacingSize.Small),
				},
				{
					type: "display",
					component: new TextDisplayBuilder().setContent("XXX"),
				},
				{
					type: "separator",
					component: new SeparatorBuilder()
						.setDivider(true)
						.setSpacing(SeparatorSpacingSize.Small),
				},
				{
					type: "buttons",
				},
			],
		],
		int,
		{
			contentMarker: "XXX",
			entriesPerPage: int.options.getInteger("items-per-page") || 5,
			ephemeral: false,
		},
	);
}
