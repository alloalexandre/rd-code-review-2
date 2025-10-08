import React from "react";
import type { LanguageKey } from "../globals/languages";
import { useLanguageStore } from "../stores/i18n.store";

/**
 * Hook that returns the current language of the application.
 * It is also possible to update the language of the application
 * by calling the changeLanguage function returned by this hook.
 */
export function useLocale(): {
	language: LanguageKey;
	changeLanguage: (lang: LanguageKey) => void;
} {
	const languageStoreState = useLanguageStore((s) => ({
		language: s.language,
		changeLanguage: s.changeLanguage,
	}));

	return languageStoreState;
}
