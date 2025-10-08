import { i18n } from "meteor/universe:i18n";
import React from "react";
import { useLanguageStore } from "/imports/stores/i18n.store";

/**
 * Returns a function that will translate a given key with the current language of the app.
 * The function returned will take a key and any number of arguments and will return the translated value.
 * If the key is not found in the translation files, the key will be returned as is.
 * The function will automatically update if the language of the app changes.
 */
export function useTranslator(
	prefix: string = "",
): (key: string, ...args: unknown[]) => string | undefined {
	const language = useLanguageStore((s) => s.language);
	return React.useCallback(
		(key, ...args) => {
			if (!language) return;
			return i18n.getTranslation(prefix, key, ...args);
		},
		[prefix, language],
	);
}
