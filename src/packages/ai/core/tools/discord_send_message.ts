import type Anthropic from "@anthropic-ai/sdk";
import type { ToolResultBlockParam } from "@anthropic-ai/sdk/resources";

export async function discord_send_message(
	client: Luna.Client.Bot,
	tool: Anthropic.Messages.ToolUseBlock,
): Promise<ToolResultBlockParam> {
	const { target_id, your_message } = tool.input as {
		target_id?: string;
		your_message?: string;
	};

	const preview =
		your_message && your_message.length > 200
			? `${your_message.slice(0, 200)}…`
			: (your_message ?? "");

	if (!target_id || !your_message) {
		return {
			type: "tool_result",
			tool_use_id: tool.id,
			is_error: true,
			content:
				"Send failed: `target_id` and `your_message` are both required. Nothing was posted. Retry with both values.",
		};
	}
	try {
		const channel =
			client.channels.cache.get(target_id) ??
			(await client.channels.fetch(target_id).catch(() => null));
		if (channel) {
			if (!channel.isTextBased() || !channel.isSendable()) {
				return {
					type: "tool_result",
					tool_use_id: tool.id,
					is_error: true,
					content: `Send failed: resolved ID \`${target_id}\` to a channel, but it is not a text channel the bot can write to (or the bot lacks permission). Nothing was posted.`,
				};
			}

			const sent = await channel.send({
				content: your_message,
			});
			const place =
				"name" in channel && typeof channel.name === "string"
					? `#${channel.name}`
					: `channel ${channel.id}`;
			return {
				type: "tool_result",
				tool_use_id: tool.id,
				content: `Posted successfully in ${place} (${channel.id}). Discord message ID: ${sent.id}. Content sent (preview): ${preview}`,
			};
		}

		const user =
			client.users.cache.get(target_id) ??
			(await client.users.fetch(target_id).catch(() => null));
		if (!user) {
			return {
				type: "tool_result",
				tool_use_id: tool.id,
				is_error: true,
				content: `Send failed: no channel or user found for ID \`${target_id}\` (invalid ID, wrong server, or the bot cannot access that target). Nothing was posted.`,
			};
		}

		const dm = user.dmChannel ?? (await user.createDM());
		if (!dm.isTextBased() || !dm.isSendable()) {
			return {
				type: "tool_result",
				tool_use_id: tool.id,
				is_error: true,
				content: `Send failed: could not open a DM with ${user.username} (\`${user.id}\`) — DMs may be closed or the bot may be blocked. Nothing was posted.`,
			};
		}

		const sent = await dm.send({ content: your_message });
		return {
			type: "tool_result",
			tool_use_id: tool.id,
			content: `Direct message delivered to ${user.username} (\`${user.id}\`). Discord message ID: ${sent.id}. Content sent (preview): ${preview}`,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown send error";
		return {
			type: "tool_result",
			tool_use_id: tool.id,
			is_error: true,
			content: `Send failed with an exception while posting to \`${target_id}\`: ${errorMessage}. Nothing was posted.`,
		};
	}
}
