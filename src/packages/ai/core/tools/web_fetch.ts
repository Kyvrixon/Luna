import type Anthropic from "@anthropic-ai/sdk";
import type { ToolResultBlockParam } from "@anthropic-ai/sdk/resources";

export async function web_fetch(
	_client: Luna.Client.Bot,
	tool: Anthropic.Messages.ToolUseBlock,
): Promise<ToolResultBlockParam> {
	const { url } = tool.input as { url?: string };

	if (!url) {
		return {
			type: "tool_result",
			tool_use_id: tool.id,
			is_error: true,
			content: "Missing required field: url",
		};
	}

	try {
		const fetched = await fetch(url);
		const body = await fetched.text();

		if (!fetched.ok) {
			return {
				type: "tool_result",
				tool_use_id: tool.id,
				is_error: true,
				content: `Request failed with status ${fetched.status}: ${body.slice(0, 1000)}`,
			};
		}

		return {
			type: "tool_result",
			tool_use_id: tool.id,
			content: body.slice(0, 20000),
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown fetch error";
		return {
			type: "tool_result",
			tool_use_id: tool.id,
			is_error: true,
			content: `Fetch failed: ${message}`,
		};
	}
}
