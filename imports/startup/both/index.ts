/**
 * Import settings and validate them
 */
import "./_settings";

/**
 * Setup SimpleSchema
 */
import "./_simpleSchemaSetup";

/**
 * Extends Mongo.Collection with Allohouston extensions
 */
import "./_mongoExtension";

/**
 * Setup roles and i18n
 */
import "/imports/globals/roles"; // User roles definitions
import "/imports/globals/languages"; // Language and i18n globals

/**
 * Configure logger
 */
import "./_logger";

/**
 * Setup collections
 */
import "./_collectionsImports";
