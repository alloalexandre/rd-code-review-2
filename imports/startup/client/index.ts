/**
 * Setup i18n
 */
import "./_i18n";

/**
 * Setup helpscout
 */
import "./_helpscout";

/**
 * Import Security
 */
import "/imports/lib/security/security-client";

/**
 * Disable console.log on the client
 */
import { METEOR_SETTINGS } from "../both/_settings";

if (!METEOR_SETTINGS.public.debug) {
	console.log = (): void => {
		// do nothing
	};
}
