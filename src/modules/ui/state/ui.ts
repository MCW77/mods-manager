// utils
import i18n from "#/i18n";

// state
import { observable } from "@legendapp/state";

// domain
import type { SectionNames } from "../domain/SectionNames";

interface UI {
	currentSection: SectionNames;
	previousSection: SectionNames;
	language: string;
	languages: readonly ("en-US" | "de-DE")[];
	theme: "dark" | "light" | "system";
	themeClass: () => string;
	goToPreviousSection: () => void;
}

export const ui$ = observable<UI>({
	currentSection: "help" as SectionNames,
	previousSection: "help" as SectionNames,
	language: i18n.language ?? "en-US",
	languages: ["en-US", "de-DE"],
	theme: "dark",
	themeClass: (): string => {
		const theme = ui$.theme.get();
		if (theme === "system") {
			const isDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			return isDarkMode ? "dark" : "light";
		}
		return theme;
	},
	goToPreviousSection: () => {
		ui$.currentSection.set(ui$.previousSection.peek());
	},
});

ui$.currentSection.onChange(({ getPrevious }) => {
	ui$.previousSection.set(getPrevious());
});

ui$.language.onChange(({ value }) => {
	i18n.changeLanguage(value);
});
