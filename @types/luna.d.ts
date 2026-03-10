import type { LunaClient } from "../src/apps/bot/structures/LunaClient";

declare global {
	namespace Luna {
		namespace Client {
			interface Class<Ready extends boolean = boolean>
				extends LunaClient<Ready> {}
		}
		namespace Database {
			namespace Typings {
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
		}
	}
}

export default void null;
