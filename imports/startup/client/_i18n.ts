import { useLanguageStore } from "../../stores/i18n.store";

// Specific to the current app
import "/i18n/en.i18n.json";
import "/i18n/fr.i18n.json";

// Belongs to the suprakit package
import "/i18n/supra/fr.i18n.json";
import "/i18n/supra/en.i18n.json";

// Standard translations
import "/i18n/standard/fr.i18n.json";
import "/i18n/standard/en.i18n.json";

const initializeLanguage: () => void =
	useLanguageStore.getState().initializeLanguage;
initializeLanguage();
