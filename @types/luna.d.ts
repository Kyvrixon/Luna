import type { LunaClient } from "../src/apps/bot/structures/LunaClient";
import type { globalConfig } from "../config";
import type { AIClient } from "../src/packages/ai/structures/AIClient";

declare global {
	namespace Luna {
		namespace Typings {
			type config = typeof globalConfig;
			namespace Models {
				namespace AI {
					type output = {
						message_for_user: string;
						user_said_bad_things: boolean;
					};
					type input = {
						message: string;
						user_id: string;
					};
				}
				namespace Afk {
					/**
					 * Only types a single entry!
					 */
					type pings = {
						userId: string;
						messageUrl: string;
						time: Date;
						channelId: string;
					};
				}
			}
		}
		namespace Client {
			interface Bot extends LunaClient {}
			interface AI extends AIClient {}
		}
	}
}

export default void null;
