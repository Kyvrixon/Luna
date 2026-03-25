import type Anthropic from "@anthropic-ai/sdk";

export default [
	{
		name: "web_fetch",
		description: "Fetch a URL and return its content.",
		input_schema: {
			type: "object",
			properties: {
				url: { type: "string" },
			},
			required: ["url"],
			additionalProperties: false,
		},
	},
	{
		name: "discord_send_message",
		description: "Send a message to a Discord channel or dm a user.",
		input_schema: {
			type: "object",
			properties: {
				target_id: { type: "string" },
				your_message: { type: "string" },
			},
			required: ["target_id", "your_message"],
			additionalProperties: false,
		},
	},
] satisfies Anthropic.Messages.ToolUnion[];
