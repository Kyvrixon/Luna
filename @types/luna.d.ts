import type { LunaClient } from "../src/apps/bot/structures/LunaClient";
import type { globalConfig } from "../config";

declare global {
	namespace Luna {
		namespace Typings {
			type config = typeof globalConfig;
			namespace Models {
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
			interface Class extends LunaClient {}
		}
	}
}

export default void null;
