import { i18n } from "meteor/universe:i18n";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { LANGUAGES_APP, type LanguageKey } from "/imports/globals/languages";

const DEFAULT_LANGUAGE = "FR" as const;

type LanguageStore = {
	language: LanguageKey;
	changeLanguage: (newLanguage: LanguageKey) => void;
	initializeLanguage: () => void;
};

export const useLanguageStore: UseBoundStore<StoreApi<LanguageStore>> =
	create<LanguageStore>((set) => ({
		language: DEFAULT_LANGUAGE,

		changeLanguage: (newLanguage: LanguageKey) => {
			const localeString =
				LANGUAGES_APP[newLanguage]?.idTranslate || DEFAULT_LANGUAGE;
			i18n.setLocale(localeString);
			set({ language: newLanguage });
			localStorage.setItem("Language", newLanguage);
		},

		initializeLanguage: () => {
			const storedLanguage =
				(localStorage.getItem("Language") as LanguageKey) || DEFAULT_LANGUAGE;
			const localeString =
				LANGUAGES_APP[storedLanguage]?.idTranslate || DEFAULT_LANGUAGE;

			i18n.setLocale(localeString);
			set({ language: storedLanguage });

			// Listen to changes in the i18n locale and update the store accordingly
			const handleLocaleChange = () => set({ language: storedLanguage });
			i18n.onChangeLocale(handleLocaleChange);

			return () => i18n.offChangeLocale(handleLocaleChange);
		},
	}));
