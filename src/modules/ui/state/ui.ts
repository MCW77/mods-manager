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
	theme: "dark" | "light";
	goToPreviousSection: () => void;
}

export const ui$ = observable<UI>({
	currentSection: "help" as SectionNames,
	previousSection: "help" as SectionNames,
	language: i18n.language,
	languages: ["en-US", "de-DE"],
	theme: "dark",
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
