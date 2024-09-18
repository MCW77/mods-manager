// utils
import type * as UtilityTypes from "#/utils/typeHelper";

// domain
import type { Categories } from "./Categories";
import type { SortConfigById } from "./SortConfig";

export type TriState = -1 | 0 | 1;

export type BaseSettings = Record<string, TriState>;

export interface SlotSettings extends BaseSettings {
	square: TriState;
	arrow: TriState;
	diamond: TriState;
	triangle: TriState;
	circle: TriState;
	cross: TriState;
}

export interface SetSettings extends BaseSettings {
	"Potency %": TriState;
	"Tenacity %": TriState;
	"Speed %": TriState;
	"Offense %": TriState;
	"Defense %": TriState;
	"Critical Chance %": TriState;
	"Critical Damage %": TriState;
	"Health %": TriState;
}

export interface RaritySettings extends BaseSettings {
	5: TriState;
	6: TriState;
}

interface ITierSettings extends BaseSettings {
	"1": TriState;
	"2": TriState;
	"3": TriState;
	"4": TriState;
	"5": TriState;
}

export type TierSettings = UtilityTypes.Indexed<ITierSettings>;

interface ISecondariesScoreTierSettings extends BaseSettings {
	"1": TriState;
	"2": TriState;
	"3": TriState;
	"4": TriState;
	"5": TriState;
}

export type SecondariesScoreTierSettings =
	UtilityTypes.Indexed<ISecondariesScoreTierSettings>;

export interface LevelSettings extends BaseSettings {
	1: TriState;
	3: TriState;
	6: TriState;
	9: TriState;
	12: TriState;
	15: TriState;
}

export interface EquippedSettings extends BaseSettings {
	equipped: TriState;
}

export interface IPrimarySettings extends BaseSettings {
	"Accuracy %": TriState;
	"Critical Avoidance %": TriState;
	"Critical Chance %": TriState;
	"Critical Damage %": TriState;
	"Defense %": TriState;
	"Health %": TriState;
	"Offense %": TriState;
	"Potency %": TriState;
	"Protection %": TriState;
	Speed: TriState;
	"Tenacity %": TriState;
}
export type PrimarySettings = UtilityTypes.Indexed<IPrimarySettings>;

export interface SecondarySettings extends BaseSettings {
	"Critical Chance %": TriState;
	"Defense %": TriState;
	Defense: TriState;
	"Offense %": TriState;
	Offense: TriState;
	"Health %": TriState;
	Health: TriState;
	"Potency %": TriState;
	"Tenacity %": TriState;
	"Protection %": TriState;
	Protection: TriState;
	Speed: TriState;
}

export interface AssignedSettings extends BaseSettings {
	assigned: TriState;
}

export const availableFilters = [
	"slot",
	"modset",
	"rarity",
	"tier",
	"level",
	"equipped",
	"primary",
	"secondary",
	"assigned",
	"secondariesscoretier",
] as const;

export type FilterKeys = UtilityTypes.ElementType<typeof availableFilters>;

export interface Filter {
	id: string;
	slot: SlotSettings;
	modset: SetSettings;
	rarity: RaritySettings;
	tier: TierSettings;
	level: LevelSettings;
	equipped: EquippedSettings;
	primary: PrimarySettings;
	secondary: SecondarySettings;
	assigned: AssignedSettings;
	secondariesscoretier: SecondariesScoreTierSettings;
}
export interface PartialFilter {
	slot: (keyof SlotSettings)[];
	modset: (keyof SetSettings)[];
	rarity: (keyof RaritySettings)[];
	tier: (keyof TierSettings)[];
	level: (keyof LevelSettings)[];
	equipped: (keyof EquippedSettings)[];
	primary: (keyof PrimarySettings)[];
	secondary: (keyof SecondarySettings)[];
	assigned: (keyof AssignedSettings)[];
	secondariesscoretier: (keyof SecondariesScoreTierSettings)[];
}

export interface ViewSetup {
	id: string;
	category: Categories;
	description: string;
	filterById: Record<string, Filter>;
	sort: SortConfigById;
	isGroupingEnabled: boolean;
	modScore: string;
}

export type ViewSetupById = Record<string, ViewSetup>;

export type ViewSetupByIdByCategory = Record<Categories, ViewSetupById>;

export const quickFilter: Filter = {
	id: "QuickFilter",
	slot: {
		square: 0,
		arrow: 0,
		diamond: 0,
		triangle: 0,
		circle: 0,
		cross: 0,
	},
	modset: {
		"Potency %": 0,
		"Tenacity %": 0,
		"Speed %": 0,
		"Offense %": 0,
		"Defense %": 0,
		"Critical Damage %": 0,
		"Critical Chance %": 0,
		"Health %": 0,
	},
	rarity: {
		5: 0,
		6: 0,
	},
	tier: {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
	},
	level: {
		1: 0,
		3: 0,
		6: 0,
		9: 0,
		12: 0,
		15: 0,
	},
	equipped: {
		equipped: 0,
	},
	primary: {
		"Accuracy %": 0,
		"Critical Avoidance %": 0,
		"Critical Chance %": 0,
		"Critical Damage %": 0,
		"Defense %": 0,
		"Offense %": 0,
		"Health %": 0,
		"Potency %": 0,
		"Tenacity %": 0,
		"Protection %": 0,
		Speed: 0,
	},
	secondary: {
		"Critical Chance %": 0,
		"Defense %": 0,
		Defense: 0,
		"Offense %": 0,
		Offense: 0,
		"Health %": 0,
		Health: 0,
		"Potency %": 0,
		"Tenacity %": 0,
		"Protection %": 0,
		Protection: 0,
		Speed: 0,
	},
	assigned: {
		assigned: 0,
		unassigned: 0,
	},
	secondariesscoretier: {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
	},
};

export const defaultRevealFilter: Filter = structuredClone(quickFilter);
defaultRevealFilter.id = "DefaultReveal";
defaultRevealFilter.rarity[6] = -1;
defaultRevealFilter.tier[5] = -1;
defaultRevealFilter.level[12] = -1;
defaultRevealFilter.level[13] = -1;
defaultRevealFilter.level[14] = -1;
defaultRevealFilter.level[15] = -1;

export const defaultLevelFilter: Filter = structuredClone(quickFilter);
defaultLevelFilter.id = "DefaultLevel";
defaultLevelFilter.level[15] = -1;

export const defaultSlice5DotFilter: Filter = structuredClone(quickFilter);
defaultSlice5DotFilter.id = "DefaultSlice5Dot";
defaultSlice5DotFilter.rarity[5] = 1;
defaultSlice5DotFilter.tier[5] = -1;
defaultSlice5DotFilter.level[15] = 1;

export const defaultSlice6EFilter: Filter = structuredClone(quickFilter);
defaultSlice6EFilter.id = "DefaultSlice6E";
defaultSlice6EFilter.rarity[5] = 1;
defaultSlice6EFilter.tier[5] = 1;
defaultSlice6EFilter.level[15] = 1;

export const defaultSlice6DotFilter: Filter = structuredClone(quickFilter);
defaultSlice6DotFilter.id = "DefaultSlice6Dot";
defaultSlice6DotFilter.rarity[6] = 1;
defaultSlice6DotFilter.tier[5] = -1;

export const defaultCalibrateFilter: Filter = structuredClone(quickFilter);
defaultCalibrateFilter.id = "DefaultCalibrate";
defaultCalibrateFilter.rarity[6] = 1;

const defaultRevealSetup: ViewSetup = {
	id: "DefaultReveal",
	category: "Reveal",
	description: "Reveal",
	filterById: { [defaultRevealFilter.id]: defaultRevealFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultLevelSetup: ViewSetup = {
	id: "DefaultLevel",
	category: "Level",
	description: "Level",
	filterById: { [defaultLevelFilter.id]: defaultLevelFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultSlice5DotSetup: ViewSetup = {
	id: "DefaultSlice5Dot",
	category: "Slice5Dot",
	description: "Slice5Dot",
	filterById: { [defaultSlice5DotFilter.id]: defaultSlice5DotFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultSlice6ESetup: ViewSetup = {
	id: "DefaultSlice6E",
	category: "Slice6E",
	description: "Slice6E",
	filterById: { [defaultSlice6EFilter.id]: defaultSlice6EFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultSlice6DotSetup: ViewSetup = {
	id: "DefaultSlice6Dot",
	category: "Slice6Dot",
	description: "Slice6Dot",
	filterById: { [defaultSlice6DotFilter.id]: defaultSlice6DotFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultCalibrateSetup: ViewSetup = {
	id: "DefaultCalibrate",
	category: "Calibrate",
	description: "Calibrate",
	filterById: { [defaultCalibrateFilter.id]: defaultCalibrateFilter },
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

const defaultAllModsSetup: ViewSetup = {
	id: "DefaultAllMods",
	category: "AllMods",
	description: "All Mods",
	filterById: {},
	sort: new Map(),
	isGroupingEnabled: true,
	modScore: "PureSecondaries",
};

export const defaultViewSetupByCategory: Record<Categories, ViewSetup> = {
	Reveal: defaultRevealSetup,
	Level: defaultLevelSetup,
	Slice5Dot: defaultSlice5DotSetup,
	Slice6E: defaultSlice6ESetup,
	Slice6Dot: defaultSlice6DotSetup,
	Calibrate: defaultCalibrateSetup,
	AllMods: defaultAllModsSetup,
};

export const createFilter = (allycode: string) => {
	const createdFilter = structuredClone(quickFilter);
	createdFilter.id = `${allycode}-${crypto.randomUUID()}`;
	return createdFilter;
};

export const builtinFilters = [
	"QuickFilter",
	"DefaultReveal",
	"DefaultLevel",
	"DefaultSlice5Dot",
	"DefaultSlice6E",
	"DefaultSlice6Dot",
	"DefaultCalibrate",
];

export const builtinViewSetups = [
	"DefaultReveal",
	"DefaultLevel",
	"DefaultSlice5Dot",
	"DefaultSlice6E",
	"DefaultSlice6Dot",
	"DefaultCalibrate",
	"DefaultAllMods",
];
