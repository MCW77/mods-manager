// utils
import i18n from "#/i18n";

// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import type { SectionNames } from "../domain/SectionNames";
import type { SectionData, SectionRegistry } from "../domain/SectionRegistry";

const lazyPageModules = {
	"/src/modules/modsView/pages/Section.tsx": () =>
		import("#/modules/modsView/pages/Section.tsx"),
	"/src/modules/compilations/pages/Section.tsx": () =>
		import("#/modules/compilations/pages/Section.tsx"),
	"/src/modules/datacrons/pages/Section.tsx": () =>
		import("#/modules/datacrons/pages/Section.tsx"),
	"/src/modules/settings/pages/Section.tsx": () =>
		import("#/modules/settings/pages/Section.tsx"),
	"/src/modules/optimizerView/pages/Section.tsx": () =>
		import("#/modules/optimizerView/pages/Section.tsx"),
	"/src/modules/help/pages/Section.tsx": () =>
		import("#/modules/help/pages/Section.tsx"),
	"/src/modules/about/pages/Section.tsx": () =>
		import("#/modules/about/pages/Section.tsx"),
} as const satisfies Record<string, () => Promise<unknown>>;

const profilePageModules = [
	lazyPageModules["/src/modules/modsView/pages/Section.tsx"],
	lazyPageModules["/src/modules/compilations/pages/Section.tsx"],
	lazyPageModules["/src/modules/optimizerView/pages/Section.tsx"],
	lazyPageModules["/src/modules/settings/pages/Section.tsx"],
	lazyPageModules["/src/modules/datacrons/pages/Section.tsx"],
] as const;

interface UI {
	currentSection: SectionNames;
	previousSection: SectionNames;
	language: string;
	languages: readonly ("en-US" | "de-DE")[];
	orderedSectionRegistry: () => SectionRegistry;
	sectionRegistry: SectionRegistry;
	theme: "dark" | "light" | "system";
	themeClass: () => string;
	goToPreviousSection: () => void;
	registerSection: (section: SectionData) => void;
	loadPageModule: (path: string) => void;
	loadAllPageModules: () => void;
}

export const ui$ = observable<UI>({
	currentSection: "help" as SectionNames,
	previousSection: "help" as SectionNames,
	language: i18n.language ?? "en-US",
	languages: ["en-US", "de-DE"],
	sectionRegistry: [] as SectionRegistry,
	orderedSectionRegistry: () => {
		const sectionRegistry: SectionRegistry = ui$.sectionRegistry.get();
		return sectionRegistry.toSorted(
			(a: SectionData, b: SectionData) => a.position - b.position,
		);
	},
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
	registerSection: (section: SectionData) => {
		ui$.sectionRegistry.push(section);
	},
	loadPageModule: async (path: string) => {
		const importer = lazyPageModules[path as keyof typeof lazyPageModules];
		if (!importer) throw new Error(`Unknown component path: ${path}`);

		await importer();
	},
	loadAllPageModules: async () => {
		beginBatch();
		await Promise.all(profilePageModules.map((importer) => importer()));
		endBatch();
	},
});

ui$.loadPageModule("/src/modules/help/pages/Section.tsx");
ui$.loadPageModule("/src/modules/about/pages/Section.tsx");

ui$.currentSection.onChange(({ getPrevious }) => {
	ui$.previousSection.set(getPrevious());
});

ui$.language.onChange(({ value }) => {
	i18n.changeLanguage(value);
});
