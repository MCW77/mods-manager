// state
import { observable } from "@legendapp/state";

// domain
import type { ModListFilter } from "#/modules/review/domain/ModListFilter.js";

interface OptimizerView {
	modListFilter: ModListFilter;
}

export const review$ = observable<OptimizerView>({
	modListFilter: {
		show: "all",
		sort: "assignedCharacter",
		tag: "All",
		view: "sets",
	},
});
