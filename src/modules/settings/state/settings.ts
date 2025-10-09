// state
import { observable } from "@legendapp/state";

// domain
import type { SettingsSections } from "../domain/SettingsSections";
import { ui$ } from "#/modules/ui/state/ui";

interface Settings {
	section: SettingsSections;
}

export const settings$ = observable<Settings>({
	section: "general",
});

settings$.section.onChange(() => {
	ui$.currentSection.set("settings");
});
