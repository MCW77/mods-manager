// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import type { HelpSections } from "../domain/HelpSections";
import { ui$ } from "#/modules/ui/state/ui";

interface Help {
	section: HelpSections;
	topic: number;
	history: { section: HelpSections; topic: number }[];
	goBack: () => void;
	setHelpPosition: (section: HelpSections, topic: number) => void;
}

const help$ = observable<Help>({
	section: "general",
	topic: 1,
	history: [],
	goBack: () => {
		if (help$.history.length === 0) return;
		let lastPosition = help$.history.pop();
		if (lastPosition === undefined) return;
		const currentSection = help$.section.peek();
		const currentTopic = help$.topic.peek();
		if (
			lastPosition.section === currentSection &&
			lastPosition.topic === currentTopic
		)
			lastPosition = help$.history.pop();
		if (lastPosition === undefined) return;
		beginBatch();
		help$.section.set(lastPosition.section);
		help$.topic.set(lastPosition.topic);
		endBatch();
	},
	setHelpPosition: (section, topic) => {
		beginBatch();
		help$.section.set(section);
		help$.topic.set(topic);
		help$.history.push({ section, topic });
		ui$.currentSection.set("help");
		endBatch();
	},
});

export { help$ };
