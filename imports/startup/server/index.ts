/**
 * Add timestamp to console
 */
import "./_console";

/**
 * Import collections
 */
import "./_collectionsImports";

/**
 * Import user accounts
 */
import "./_userAccountsConfig";

/**
 * Add roles' hierarchy
 */
import "./_manageRoles";

/**
 * Import migrations
 */
import "./_migrations";

/**
 * Import dev-only features (for convenience in development)
 */
import "./_fakeUsers";

/**
 * Import globals and expose them to the client
 */
import "./_exposeGlobals";

/**
 * Import cron jobs
 */
import "./_scheduleJobs";

/**
 * Import security
 */
import "/imports/lib/security/server/security-server";

/**
 * Log app started
 */
console.log("App Started !");
