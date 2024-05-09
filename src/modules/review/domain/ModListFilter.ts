type ShowOptions = "upgrades" | "change" | "all";
type SortOptions = "currentCharacter" | "assignedCharacter";
type ViewOptions = "list" | "sets";

const sortOptions = {
	currentCharacter: "currentCharacter",
	assignedCharacter: "assignedCharacter",
} as const;

const viewOptions = {
	list: "list",
	sets: "sets",
} as const;

const showOptions = {
	upgrades: "upgrades",
	change: "change",
	all: "all",
} as const;

interface ModListFilter {
	show: ShowOptions;
	sort: SortOptions;
	tag: string;
	view: ViewOptions;
}

export {
	type ModListFilter,
	type ShowOptions,
	type SortOptions,
	type ViewOptions,
	sortOptions,
	viewOptions,
	showOptions,
};
