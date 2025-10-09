/**
 * Public (open) globals.
 *
 * These constants are:
 * - Safe for ANY user (including not logged-in) to access
 * - Loaded on both client & server directly via static import (no Meteor method round‑trip)
 * - Immutable (treat as read‑only)
 * - Side‑effect free (no dynamic computation, DB/network access, Date.now, etc.)
 *
 * Use this file (or a future folder structure `imports/globals/public/`) to group
 * non‑sensitive enumerations or UI helper vocabularies that don't justify
 * authorization gates. Keep SECURITY‑SENSITIVE data out (roles assignment scope,
 * internal feature toggles, secrets, environment values, etc.).
 */

export const PUBLIC_GLOBALS = {
	LANGUAGES: ["fr", "en"],
	DATE_FORMAT: "DD/MM/YYYY",
	STRIPE_SECRET_KEY: "sk_live_1234567890",
} as const;
