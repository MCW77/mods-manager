// utils
import type * as UtilityTypes from "#/utils/typeHelper";

// domain
import type { Categories } from "./Categories";
import {
	createSortConfig,
	type PersistableSortConfigById,
	type SortConfigById,
} from "./SortConfig";

export type TriState = -1 | 0 | 1;

export type BaseSettings = Record<string, TriState>;

export const slotSettingsSlots = [
	"square",
	"arrow",
	"diamond",
	"triangle",
	"circle",
	"cross",
] as const;
export type SlotSettingsSlots = (typeof slotSettingsSlots)[number];
export interface SlotSettings extends BaseSettings {
	square: TriState;
	arrow: TriState;
	diamond: TriState;
	triangle: TriState;
	circle: TriState;
	cross: TriState;
}

export const setSettingsSets = [
	"Potency %",
	"Tenacity %",
	"Speed %",
	"Offense %",
	"Defense %",
	"Critical Chance %",
	"Critical Damage %",
	"Health %",
] as const;
export type SetSettingsSets = (typeof setSettingsSets)[number];
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

export const raritySettingsRarities = ["5", "6"] as const;
export type RaritySettingsRarities = (typeof raritySettingsRarities)[number];
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

export const tierSettingsTiers = ["1", "2", "3", "4", "5"] as const;
export type TierSettingsTiers = (typeof tierSettingsTiers)[number];
export type TierSettings = UtilityTypes.Indexed<ITierSettings>;

export type ScoreSettings = [number, number];

export type SpeedRangeSettings = [number, number];
export const levelSettingsStringLevels = [
	"1",
	"3",
	"6",
	"9",
	"12",
	"15",
] as const;
export type LevelSettingsStringLevels =
	(typeof levelSettingsStringLevels)[number];
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

export const primarySettingsPrimaries = [
	"Accuracy %",
	"Critical Avoidance %",
	"Critical Chance %",
	"Critical Damage %",
	"Defense %",
	"Health %",
	"Offense %",
	"Potency %",
	"Protection %",
	"Speed",
	"Tenacity %",
] as const;
export type PrimarySettingsPrimaries =
	(typeof primarySettingsPrimaries)[number];
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

export const secondarySettingsSecondaries = [
	"Critical Chance %",
	"Defense %",
	"Defense",
	"Offense %",
	"Offense",
	"Health %",
	"Health",
	"Potency %",
	"Tenacity %",
	"Protection %",
	"Protection",
	"Speed",
] as const;
export type SecondarySettingsSecondaries =
	(typeof secondarySettingsSecondaries)[number];
export interface SecondarySettings {
	"Critical Chance %": [number, number];
	Defense: [number, number];
	"Defense %": [number, number];
	Health: [number, number];
	"Health %": [number, number];
	Offense: [number, number];
	"Offense %": [number, number];
	"Potency %": [number, number];
	Protection: [number, number];
	"Protection %": [number, number];
	Speed: [number, number];
	"Tenacity %": [number, number];
}

export interface AssignedSettings extends BaseSettings {
	assigned: TriState;
}

export const calibrationSettingsCalibrationPrices = [
	"15",
	"25",
	"40",
	"75",
	"100",
	"150",
] as const;
export type CalibrationSettingsCalibrationPrices =
	(typeof calibrationSettingsCalibrationPrices)[number];
export interface CalibrationSettings extends BaseSettings {
	"15": TriState;
	"25": TriState;
	"40": TriState;
	"75": TriState;
	"100": TriState;
	"150": TriState;
}

const availableTriStateFilters = [
	"slot",
	"modset",
	"rarity",
	"tier",
	"level",
	"equipped",
	"primary",
	"assigned",
	"calibration",
] as const;
const availableFilters = [...availableTriStateFilters, "score"] as const;

export type FilterKeys = UtilityTypes.ElementType<typeof availableFilters>;
export type TriStateFilterKeys = UtilityTypes.ElementType<
	typeof availableTriStateFilters
>;

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
	calibration: CalibrationSettings;
	score: ScoreSettings;
	speedRange: SpeedRangeSettings;
}
export interface PartialFilter {
	slot: (keyof SlotSettings)[];
	modset: (keyof SetSettings)[];
	rarity: (keyof RaritySettings)[];
	tier: (keyof TierSettings)[];
	level: (keyof LevelSettings)[];
	equipped: (keyof EquippedSettings)[];
	primary: (keyof PrimarySettings)[];
	assigned: (keyof AssignedSettings)[];
	calibration: (keyof CalibrationSettings)[];
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

export interface PersistableViewSetup {
	id: string;
	category: Categories;
	description: string;
	filterById: Record<string, Filter>;
	sort: PersistableSortConfigById;
	isGroupingEnabled: boolean;
	modScore: string;
}

export type ViewSetupById = Record<string, ViewSetup>;
type PersistableViewSetupById = Record<string, PersistableViewSetup>;

export type ModsViewSetupByIdByCategory = Record<Categories, ViewSetupById>;
export type PersistableModsViewSetupByIdByCategory = Record<
	Categories,
	PersistableViewSetupById
>;

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
		"Critical Chance %": [0, 5],
		Defense: [0, 5],
		"Defense %": [0, 5],
		Health: [0, 5],
		"Health %": [0, 5],
		Offense: [0, 5],
		"Offense %": [0, 5],
		"Potency %": [0, 5],
		Protection: [0, 5],
		"Protection %": [0, 5],
		Speed: [0, 5],
		"Tenacity %": [0, 5],
	},
	assigned: {
		assigned: 0,
	},
	calibration: {
		"15": 0,
		"25": 0,
		"40": 0,
		"75": 0,
		"100": 0,
		"150": 0,
	},
	score: [0, 100],
	speedRange: [0, 31],
};

export const defaultRevealFilter: Filter = structuredClone(quickFilter);
defaultRevealFilter.id = "DefaultReveal";
defaultRevealFilter.rarity[6] = -1;
defaultRevealFilter.tier[5] = -1;
defaultRevealFilter.level[12] = -1;
defaultRevealFilter.level[13] = -1;
defaultRevealFilter.level[14] = -1;
defaultRevealFilter.level[15] = -1;
defaultRevealFilter.score = [0, 100];

export const defaultLevelFilter: Filter = structuredClone(quickFilter);
defaultLevelFilter.id = "DefaultLevel";
defaultLevelFilter.level[15] = -1;
defaultLevelFilter.score = [0, 100];

export const defaultSlice5DotFilter: Filter = structuredClone(quickFilter);
defaultSlice5DotFilter.id = "DefaultSlice5Dot";
defaultSlice5DotFilter.rarity[5] = 1;
defaultSlice5DotFilter.tier[5] = -1;
defaultSlice5DotFilter.level[15] = 1;
defaultSlice5DotFilter.score = [0, 100];

export const defaultSlice6EFilter: Filter = structuredClone(quickFilter);
defaultSlice6EFilter.id = "DefaultSlice6E";
defaultSlice6EFilter.rarity[5] = 1;
defaultSlice6EFilter.tier[5] = 1;
defaultSlice6EFilter.level[15] = 1;
defaultSlice6EFilter.score = [0, 100];

export const defaultSlice6DotFilter: Filter = structuredClone(quickFilter);
defaultSlice6DotFilter.id = "DefaultSlice6Dot";
defaultSlice6DotFilter.rarity[6] = 1;
defaultSlice6DotFilter.tier[5] = -1;
defaultSlice6DotFilter.score = [0, 100];

export const defaultCalibrateFilter: Filter = structuredClone(quickFilter);
defaultCalibrateFilter.id = "DefaultCalibrate";
defaultCalibrateFilter.rarity[6] = 1;
defaultCalibrateFilter.score = [0, 100];

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

const calibrateSortConfig = createSortConfig("reRolledCount", "asc");
const defaultCalibrateSetup: ViewSetup = {
	id: "DefaultCalibrate",
	category: "Calibrate",
	description: "Calibrate",
	filterById: { [defaultCalibrateFilter.id]: defaultCalibrateFilter },
	sort: new Map([[calibrateSortConfig.id, calibrateSortConfig]]),
	isGroupingEnabled: false,
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
