// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import type { HelpSections } from "../domain/HelpSections";
import { ui$ } from "#/modules/ui/state/ui";

interface Help {
	section: HelpSections;
	topic: number;
	setHelpPosition: (section: HelpSections, topic: number) => void;
}

export const help$ = observable<Help>({
	section: "general",
	topic: 1,
	setHelpPosition: (section, topic) => {
		beginBatch();
		help$.section.set(section);
		help$.topic.set(topic);
		ui$.currentSection.set("help");
		endBatch();
	},
});
