/**
 * This is the list of languages available in the app.
 *
 * Each language has:
 * - id: a unique identifier used for programmatic checks and role assignment
 * - idTranslate: a unique identifier used for i18n
 * - label: a human-readable name to display in UI
 */
export const LANGUAGES_APP = {
	FR: {
		id: "FR",
		idTranslate: "fr",
		label: "Français",
	},
	GB: {
		id: "GB",
		idTranslate: "en",
		label: "Anglais",
	},
	IT: {
		id: "IT",
		idTranslate: "it",
		label: "Italien",
	},
	DE: {
		id: "DE",
		idTranslate: "de",
		label: "Allemand",
	},
	ES: {
		id: "ES",
		idTranslate: "es",
		label: "Espagnol",
	},
} as const;

export type LanguageKey = keyof typeof LANGUAGES_APP;
export type Language =
	(typeof LANGUAGES_APP)[keyof typeof LANGUAGES_APP]["idTranslate"];
