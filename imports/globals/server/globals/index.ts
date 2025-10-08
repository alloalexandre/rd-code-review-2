import { ALL_ROLES, type RoleId } from "../../roles";
import { EXAMPLE } from "./example";

/**
 * This file defines constants accessible to different user roles.
 * Each key represents a role ID, and the value contains globals accessible to that role.
 *
 * Higher privilege roles inherit access from lower privilege roles automatically
 * through the method logic.
 */
// biome-ignore lint/nursery/useExplicitType: We want to allow any structure for globals
export const PRIVATE_GLOBALS = {
	[ALL_ROLES.superAdmin.id]: {
		EXAMPLE,
	},
	[ALL_ROLES.admin.id]: {
		EXAMPLE,
	},
	// biome-ignore lint/suspicious/noExplicitAny: We want to allow any structure for globals
} as const satisfies Record<Exclude<RoleId, "revoked">, Record<string, any>>;

// Role-specific types for easier access to globals
export type SuperAdminGlobals =
	(typeof PRIVATE_GLOBALS)[typeof ALL_ROLES.superAdmin.id];
export type AdminGlobals = (typeof PRIVATE_GLOBALS)[typeof ALL_ROLES.admin.id];

// Type helper to get all private globals
export type PrivateGlobals = typeof PRIVATE_GLOBALS;

// Type helper to get globals for a specific role
export type GlobalsForRole<T extends Exclude<RoleId, "revoked">> =
	(typeof PRIVATE_GLOBALS)[T];
