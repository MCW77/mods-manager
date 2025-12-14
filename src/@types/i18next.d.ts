import "i18next";
import type { defaultNS } from "../i18n";
import type domain from "../../public/locales/en-US/domain.json";
import type exploreui from "../../public/locales/en-US/explore-ui.json";
import type globalui from "../../public/locales/en-US/global-ui.json";
import type helpui from "../../public/locales/en-US/help-ui.json";
import type optimizeui from "../../public/locales/en-US/optimize-ui.json";
import type settingsui from "../../public/locales/en-US/settings-ui.json";

const jsonFormat = "v3";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: defaultNS;
		resources: {
			domain: typeof domain;
			"explore-ui": typeof exploreui;
			"global-ui": typeof globalui;
			"help-ui": typeof helpui;
			"optimize-ui": typeof optimizeui;
			"settings-ui": typeof settingsui;
		};
		jsonFormat: typeof jsonFormat;
	}
}
