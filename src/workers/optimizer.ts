// utils
import superjson from "superjson";
import "../utils/globalLegendPersistSettings";
import * as perf from "../utils/performance";
// state
import { when } from "@legendapp/state";

import {
	profilesManagement$,
	syncStatus$ as profilesManagementSyncStatus$,
} from "#/modules/profilesManagement/state/profilesManagement";
import {
	mods$,
	syncStatus$ as modsSyncStatus$,
} from "#/modules/mods/state/mods";
import {
	roster$,
	syncStatus$ as rosterSyncStatus$,
} from "#/modules/roster/state/roster";
import {
	defaultCompilation$,
	syncStatus$ as defaultCompilationStatus$,
} from "#/modules/defaultCompilation/state/defaultCompilation";
import {
	incrementalOptimization$,
	syncStatus$ as incrementalOptimizationStatus$,
} from "#/modules/incrementalOptimization/state/incrementalOptimization";
import {
	lockedStatus$,
	syncStatus$ as lockedSyncStatus$,
} from "#/modules/lockedStatus/state/lockedStatus";
import {
	optimizationSettings$,
	syncStatus$ as optimizationSettingsSyncStatus$,
} from "#/modules/optimizationSettings/state/optimizationSettings";

// domain
import type { CharacterNames } from "../constants/CharacterNames";
import { gimoSlots } from "../domain/constants/ModConsts";
import type * as ModTypes from "../domain/types/ModTypes";

import type * as Character from "../domain/Character";
import type { CharacterStats } from "../domain/CharacterStats";
import type {
	allowedPrimaryStatsBySlot,
	GIMOPrimaryStatNames,
	GIMOSecondaryStatNames,
	GIMOSetStatNames,
} from "../domain/GIMOStatNames";

import {
	fromShortOptimizationPlan,
	type OptimizableStats,
	type OptimizationPlan,
	type PrimaryStatRestrictions,
} from "../domain/OptimizationPlan";
import { GIMO2DisplayStatNamesMap } from "../domain/PrimaryStat";
import type { SelectedCharacters } from "../domain/SelectedCharacters";
import type { SetRestrictions } from "../domain/SetRestrictions";
import {
	type DisplayStatNames,
	display2CSGIMOStatNamesMap,
	gimo2DisplayStatNamesMap,
	mixedTypes,
} from "../domain/Stat";
import type { TargetStat, TargetStatsNames } from "../domain/TargetStat";
import type {
	FlatCharacterModding,
	FlatCharacterModdings,
} from "../modules/compilations/domain/CharacterModdings";
import type { MissedGoals } from "../modules/compilations/domain/MissedGoals";
import type { ProfileOptimizationSettings } from "../modules/optimizationSettings/domain/ProfileOptimizationSettings";
import type { WithoutCC } from "#/domain/CharacterStatNames";

// #region types
interface Cache {
	modsetScore: {
		get: (
			modsetName: GIMOSetStatNames,
			target: OptimizationPlan,
			modsetCount: number,
		) => { score: number; partiallyScoredStats: StatValue[] };
		setCharacter: (character: Character.Character) => void;
		setRelevantStats: (target: OptimizationPlan) => void;
	};
	modsetStats: (
		setName: GIMOSetStatNames,
		fullOrHalf: FullOrHalf,
		character: Character.Character,
	) => StatValue[];
	modScores: {
		get: (mod: Mod) => { score: number; partiallyScoredStats: StatValue[] };
		set: (
			modId: string,
			score: { score: number; partiallyScoredStats: StatValue[] },
		) => void;
		setCharacter: (character: Character.Character) => void;
		setTarget: (target: OptimizationPlan) => void;
	};
	// Closure-based modStats cache API (bound to current character)
	modStats: {
		get: (mod: Mod) => StatValue[];
		setCharacter: (character: Character.Character) => void;
		setRelevantStats: (target: OptimizationPlan) => void;
	};
	flatStats: {
		get: (stat: Stat) => StatValue[];
		set: (key: FlatStatsCacheKey, flatStats: StatValue[]) => void;
	};
	relatedStatValues: Map<string, Map<string, number>>;
}

interface StatValue {
	displayType: DisplayStatNames;
	value: number;
	integral: number;
	fractional: number;
}

interface Stat {
	displayType: DisplayStatNames;
	isPercentVersion?: boolean;
	value: number;
}

interface SquarePrimaryStat {
	type: "Offense %";
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface ArrowPrimaryStat {
	type: (typeof allowedPrimaryStatsBySlot.arrow)[number];
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface DiamondPrimaryStat {
	type: "Defense %";
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface TrianglePrimaryStat {
	type: (typeof allowedPrimaryStatsBySlot.triangle)[number];
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface CirclePrimaryStat {
	type: (typeof allowedPrimaryStatsBySlot.circle)[number];
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface CrossPrimaryStat {
	type: (typeof allowedPrimaryStatsBySlot.cross)[number];
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

type PrimaryStat =
	| SquarePrimaryStat
	| ArrowPrimaryStat
	| DiamondPrimaryStat
	| TrianglePrimaryStat
	| CirclePrimaryStat
	| CrossPrimaryStat;

interface SecondaryStat {
	type: GIMOSecondaryStatNames;
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface SetBonus {
	name: GIMOSetStatNames;
	numberOfModsRequired: 2 | 4;
	smallBonus: SetStat;
	maxBonus: SetStat;
}

type FullOrHalf = "full" | "half";
type Pips = 5 | 6;

interface SetLoadout {
	loadout: Mod[];
	setName: GIMOSetStatNames | "Setless";
	fullOrHalf: FullOrHalf;
}

interface SetStat {
	type: GIMOSetStatNames;
	displayType: DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface SquareMod {
	id: string;
	slot: "square";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: SquarePrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

interface ArrowMod {
	id: string;
	slot: "arrow";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: ArrowPrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

interface DiamondMod {
	id: string;
	slot: "diamond";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: DiamondPrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

interface TriangleMod {
	id: string;
	slot: "triangle";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: TrianglePrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

interface CircleMod {
	id: string;
	slot: "circle";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: CirclePrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

interface CrossMod {
	id: string;
	slot: "cross";
	modset: SetBonus;
	level: number;
	pips: Pips;
	primaryStat: CrossPrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
}

type Mod =
	| SquareMod
	| ArrowMod
	| DiamondMod
	| TriangleMod
	| CircleMod
	| CrossMod;

interface LoadoutAndMessages {
	id: string;
	loadout: Mod[];
	messages: string[];
	score: number;
}

type ModsetCompositionRequirement = Uint8Array;
type ModsetDistribution = (GIMOSetStatNames | null)[];
interface TargetStatHeapNode {
	indices: Uint16Array;
	counts: Uint8Array;
	targetValues: Float64Array;
	modScore: number;
}
type ModsetScoreCacheKey = `${GIMOSetStatNames}-${number}`;
type FlatStatsCacheKey = `${DisplayStatNames}${boolean | undefined}${number}`;
type ModBySlot = Record<ModTypes.GIMOSlots, Mod | null>;
type PartialModBySlot = Partial<ModBySlot>;
type NullablePartialModBySlot = PartialModBySlot | null;
type SetRestrictionsEntries = [GIMOSetStatNames, number][];
type ModFilterPredicate = (mod: Mod) => boolean;
// #endregion types

// #region Messaging
self.onmessage = async (message) => {
	if (message.data.type === "Init") {
		await when(
			() =>
				profilesManagementSyncStatus$.isPersistLoaded.get() &&
				modsSyncStatus$.isPersistLoaded.get() &&
				defaultCompilationStatus$.isPersistLoaded.get() &&
				incrementalOptimizationStatus$.isPersistLoaded.get() &&
				lockedSyncStatus$.isPersistLoaded.get() &&
				optimizationSettingsSyncStatus$.isPersistLoaded.get() &&
				rosterSyncStatus$.isPersistLoaded.get(),
			() => {
				const profilesManagementError =
					profilesManagementSyncStatus$.error.peek();
				const modsError = modsSyncStatus$.error.peek();
				const defaultCompilationError = defaultCompilationStatus$.error.peek();
				const incrementalOptimizationError =
					incrementalOptimizationStatus$.error.peek();
				const lockedSyncError = lockedSyncStatus$.error.peek();
				const optimizationSettingsError =
					optimizationSettingsSyncStatus$.error.peek();
				const rosterError = rosterSyncStatus$.error.peek();
				const firstError =
					profilesManagementError ||
					modsError ||
					defaultCompilationError ||
					incrementalOptimizationError ||
					lockedSyncError ||
					optimizationSettingsError ||
					rosterError;
				if (firstError) {
					const errorMessage = superjson.stringify({
						cause: firstError.cause,
						message: firstError.message,
						stack: firstError.stack,
					});
					postMessage({
						type: "Error",
						message: errorMessage,
					});
					return;
				}
				postMessage({
					type: "Ready",
				});
			},
		);
	}

	if (message.data.type === "Optimize") {
		perf.resetPerformanceLog();

		const allycode = profilesManagement$.activeAllycode.get();
		const modDeserializer = (mod: ModTypes.GIMOFlatMod) =>
			deserializeMod(
				mod,
				optimizationSettings$.activeSettings.simulateLevel15Mods.peek(),
				optimizationSettings$.activeSettings.simulate6EModSlice.peek(),
			);

		const allMods = Array.from(
			mods$.persistedModByIdByAllycode[allycode].modById.values(),
			modDeserializer,
		);

		const selectedCharacters: SelectedCharacters =
			defaultCompilation$.data.selectedCharacters
				.peek()
				.map(({ id, target }) => ({
					id: id,
					target: deserializeTarget(target),
				}));

		const optimizerResults = perf.measureTime(optimizeMods, "optimizeMods")(
			allMods,
			roster$.activeCharacterById.peek(),
			selectedCharacters,
			incrementalOptimization$.activeIndex.peek(),
			optimizationSettings$.settingsByProfile.peek()[allycode],
			defaultCompilation$.data.flatCharacterModdings.peek(),
		);

		perf.logMeasures("optimizeMods");

		optimizationSuccessMessage(optimizerResults);
		self.close();
	}
};

function optimizationSuccessMessage(result: FlatCharacterModdings) {
	postMessage({
		type: "OptimizationSuccess",
		result: result,
	});
}

let lastProgressUpdated: number | undefined;
let currentCharacterStats: CharacterStats;
function progressMessage(
	characterId: CharacterNames,
	characterCount: number,
	characterIndex: number,
	setsCount: number,
	setsIndex: number,
	targetStat: string,
	targetStatCount: number,
	targetStatIndex: number,
	step: string,
	progress = 100,
) {
	if (
		lastProgressUpdated === undefined ||
		performance.now() - lastProgressUpdated > 10
	) {
		postMessage({
			character: characterId,
			characterCount: characterCount,
			characterIndex: characterIndex,
			progress: progress,
			setsCount: setsCount,
			setsIndex: setsIndex,
			step: step,
			targetStat: targetStat,
			targetStatCount: targetStatCount,
			targetStatIndex: targetStatIndex,
			type: "Progress",
		});
		lastProgressUpdated = performance.now();
	}
}
// #endregion Messaging

//#region Shitty code section
const statDisplayNames = Object.freeze({
	Health: "Health",
	Protection: "Protection",
	Speed: "Speed",
	"Critical Damage %": "Critical Damage",
	"Potency %": "Potency",
	"Tenacity %": "Tenacity",
	"Physical Damage": "Physical Damage",
	"Special Damage": "Special Damage",
	"Critical Chance": "Critical Chance",
	"Physical Critical Chance %": "Physical Critical Chance",
	"Special Critical Chance %": "Special Critical Chance",
	Defense: "Defense",
	Armor: "Armor",
	Resistance: "Resistance",
	"Accuracy %": "Accuracy",
	"Critical Avoidance %": "Critical Avoidance",
	"Physical Critical Avoidance": "Physical Critical Avoidance",
	"Special Critical Avoidance": "Special Critical Avoidance",
});

const requiredModsOfModsets = new Uint8Array([2, 4, 2, 2, 4, 2, 4, 2]);
const modsetCompositionRequirementsIndicesBySetName: Record<
	GIMOSetStatNames,
	number
> = Object.freeze({
	"Critical Chance %": 0,
	"Critical Damage %": 1,
	"Defense %": 2,
	"Health %": 3,
	"Offense %": 4,
	"Potency %": 5,
	"Speed %": 6,
	"Tenacity %": 7,
});

const setBonuses: Record<GIMOSetStatNames, SetBonus> = Object.freeze({
	"Health %": {
		name: "Health %",
		numberOfModsRequired: 2,
		smallBonus: {
			type: "Health %",
			displayType: "Health",
			value: 5,
			isPercentVersion: true,
		},
		maxBonus: {
			type: "Health %",
			displayType: "Health",
			value: 10,
			isPercentVersion: true,
		},
	},
	"Defense %": {
		name: "Defense %",
		numberOfModsRequired: 2,
		smallBonus: {
			type: "Defense %",
			displayType: "Defense",
			value: 12.5,
			isPercentVersion: true,
		},
		maxBonus: {
			type: "Defense %",
			displayType: "Defense",
			value: 25,
			isPercentVersion: true,
		},
	},
	"Critical Damage %": {
		name: "Critical Damage %",
		numberOfModsRequired: 4,
		smallBonus: {
			type: "Critical Damage %",
			displayType: "Critical Damage",
			value: 15,
			isPercentVersion: false,
		},
		maxBonus: {
			type: "Critical Damage %",
			displayType: "Critical Damage",
			value: 30,
			isPercentVersion: false,
		},
	},
	"Critical Chance %": {
		name: "Critical Chance %",
		numberOfModsRequired: 2,
		smallBonus: {
			type: "Critical Chance %",
			displayType: "Critical Chance",
			value: 4,
			isPercentVersion: false,
		},
		maxBonus: {
			type: "Critical Chance %",
			displayType: "Critical Chance",
			value: 8,
			isPercentVersion: false,
		},
	},
	"Tenacity %": {
		name: "Tenacity %",
		numberOfModsRequired: 2,
		smallBonus: {
			type: "Tenacity %",
			displayType: "Tenacity",
			value: 10,
			isPercentVersion: false,
		},
		maxBonus: {
			type: "Tenacity %",
			displayType: "Tenacity",
			value: 20,
			isPercentVersion: false,
		},
	},
	"Offense %": {
		name: "Offense %",
		numberOfModsRequired: 4,
		smallBonus: {
			type: "Offense %",
			displayType: "Offense",
			value: 7.5,
			isPercentVersion: true,
		},
		maxBonus: {
			type: "Offense %",
			displayType: "Offense",
			value: 15,
			isPercentVersion: true,
		},
	},
	"Potency %": {
		name: "Potency %",
		numberOfModsRequired: 2,
		smallBonus: {
			type: "Potency %",
			displayType: "Potency",
			value: 7.5,
			isPercentVersion: false,
		},
		maxBonus: {
			type: "Potency %",
			displayType: "Potency",
			value: 15,
			isPercentVersion: false,
		},
	},
	"Speed %": {
		name: "Speed %",
		numberOfModsRequired: 4,
		smallBonus: {
			type: "Speed %",
			displayType: "Speed",
			value: 5,
			isPercentVersion: true,
		},
		maxBonus: {
			type: "Speed %",
			displayType: "Speed",
			value: 10,
			isPercentVersion: true,
		},
	},
});

// Map pips to maximum value at level 15 for each primary stat type
const maxStatPrimaries: Readonly<
	Partial<Record<DisplayStatNames, Record<Pips, number>>>
> = Object.freeze({
	Offense: {
		5: 5.88,
		6: 8.5,
	},
	Defense: {
		5: 11.75,
		6: 20,
	},
	Health: {
		5: 5.88,
		6: 16,
	},
	Protection: {
		5: 23.5,
		6: 24,
	},
	Speed: {
		5: 30,
		6: 32,
	},
	Accuracy: {
		5: 12,
		6: 30,
	},
	"Critical Avoidance": {
		5: 24,
		6: 35,
	},
	"Critical Chance": {
		5: 12,
		6: 20,
	},
	"Critical Damage": {
		5: 36,
		6: 42,
	},
	Potency: {
		5: 24,
		6: 30,
	},
	Tenacity: {
		5: 24,
		6: 35,
	},
});

const statSlicingUpgradeFactors = Object.freeze({
	"Offense %": 3.02,
	"Defense %": 2.34,
	"Health %": 1.86,
	Defense: 1.63,
	"Tenacity %": 1.33,
	"Potency %": 1.33,
	"Protection %": 1.33,
	Health: 1.26,
	Protection: 1.11,
	Offense: 1.1,
	"Critical Chance %": 1.04,
} as const satisfies Record<Exclude<GIMOSecondaryStatNames, "Speed">, number>);

const statWeights = Object.freeze({
	Health: 2000,
	Protection: 4000,
	Speed: 20,
	"Critical Damage %": 30,
	"Potency %": 15,
	"Tenacity %": 15,
	"Physical Damage": 225,
	"Special Damage": 450,
	Offense: 225,
	"Critical Chance": 10,
	Armor: 33,
	Resistance: 33,
	"Accuracy %": 10,
	"Critical Avoidance %": 10,
});

const affectedOptimizableStatsBySet: Record<
	GIMOSetStatNames,
	OptimizableStats[]
> = Object.freeze({
	"Health %": ["Health"],
	"Defense %": ["Armor", "Resistance"],
	"Critical Damage %": ["Critical Damage %"],
	"Critical Chance %": ["Critical Chance"],
	"Tenacity %": ["Tenacity %"],
	"Offense %": ["Physical Damage", "Special Damage"],
	"Potency %": ["Potency %"],
	"Speed %": ["Speed"],
});

const affectedTargetStatsBySet: Record<GIMOSetStatNames, TargetStatsNames[]> =
	Object.freeze({
		"Health %": ["Health", "Health+Protection"],
		"Defense %": ["Armor", "Resistance"],
		"Critical Damage %": ["Critical Damage"],
		"Critical Chance %": [
			"Physical Critical Chance",
			"Special Critical Chance",
		],
		"Tenacity %": ["Tenacity"],
		"Offense %": ["Physical Damage", "Special Damage"],
		"Potency %": ["Potency"],
		"Speed %": ["Speed"],
	});

const affectedTargetStatsByPrimaryStat: Record<
	GIMOPrimaryStatNames,
	TargetStatsNames[]
> = Object.freeze({
	"Offense %": ["Physical Damage", "Special Damage"],
	"Defense %": ["Armor", "Resistance"],
	"Health %": ["Health", "Health+Protection"],
	"Protection %": ["Protection", "Health+Protection"],
	Speed: ["Speed"],
	"Accuracy %": ["Accuracy"],
	"Critical Avoidance %": ["Critical Avoidance"],
	"Critical Chance %": ["Physical Critical Chance", "Special Critical Chance"],
	"Critical Damage %": ["Critical Damage"],
	"Potency %": ["Potency"],
	"Tenacity %": ["Tenacity"],
});

const affectedTargetStatsBySecondaryStat: Record<
	GIMOSecondaryStatNames,
	TargetStatsNames[]
> = Object.freeze({
	Offense: ["Physical Damage", "Special Damage"],
	"Offense %": ["Physical Damage", "Special Damage"],
	Defense: ["Armor", "Resistance"],
	"Defense %": ["Armor", "Resistance"],
	Health: ["Health", "Health+Protection"],
	"Health %": ["Health", "Health+Protection"],
	Protection: ["Protection", "Health+Protection"],
	"Protection %": ["Protection", "Health+Protection"],
	Speed: ["Speed"],
	"Accuracy %": ["Accuracy"],
	"Critical Avoidance %": ["Critical Avoidance"],
	"Critical Chance %": ["Physical Critical Chance", "Special Critical Chance"],
	"Critical Damage %": ["Critical Damage"],
	"Potency %": ["Potency"],
	"Tenacity %": ["Tenacity"],
});

const wholeValueStats = new Set<DisplayStatNames>([
	"Health",
	"Protection",
	"Speed",
	"Physical Damage",
	"Special Damage",
	"Armor",
	"Resistance",
]);

const display2CSGIMOStatNameMap: Record<
	DisplayStatNames,
	WithoutCC | "Critical Chance"
> = Object.freeze({
	Health: "Health",
	Protection: "Protection",
	Speed: "Speed",
	"Critical Damage": "Critical Damage %",
	Potency: "Potency %",
	Tenacity: "Tenacity %",
	"Physical Damage": "Physical Damage",
	"Special Damage": "Special Damage",
	"Critical Chance": "Critical Chance",
	"Physical Critical Chance": "Critical Chance",
	"Special Critical Chance": "Critical Chance",
	Armor: "Armor",
	Resistance: "Resistance",
	Accuracy: "Accuracy %",
	"Critical Avoidance": "Critical Avoidance %",
	"Effective Health (physical)": "Health",
	"Effective Health (special)": "Health",
	"Average Damage (physical)": "Health",
	"Average Damage (special)": "Health",
	Defense: "Health",
	Offense: "Health",
} as const);

/**
 * Return the first value from an array, if one exists. Otherwise, return null.
 * @param mods {Array}
 * @returns {*}
 */
function firstOrNull(mods: Mod[]) {
	if ("undefined" !== typeof mods[0]) {
		return mods[0];
	}
	return null;
}

function chooseFromArray<T>(input: readonly T[], choices: number) {
	const combinations: T[][] = [];

	for (let i = 0; i <= input.length - choices; i++) {
		if (1 >= choices) {
			combinations.push([input[i]]);
		} else {
			for (const subResult of chooseFromArray(
				input.slice(i + 1),
				choices - 1,
			)) {
				combinations.push([input[i]].concat(subResult));
			}
		}
	}

	return combinations;
}

function deserializePrimaryStat(
	type: GIMOPrimaryStatNames,
	value: string,
	pips: Pips,
	simulateLevel15: boolean,
) {
	const displayType = GIMO2DisplayStatNamesMap[type];
	const rawValue = value.replace(/[+%]/g, "");
	const realValue = simulateLevel15
		? (maxStatPrimaries[displayType]?.[pips] ?? 0)
		: +rawValue;
	const isPercentVersion =
		(type.endsWith("%") || value.endsWith("%")) &&
		mixedTypes.includes(displayType);

	return {
		type: type,
		displayType: displayType,
		value: realValue,
		isPercentVersion: isPercentVersion,
	} as PrimaryStat;
}

function deserializeSecondaryStat(
	type: GIMOSecondaryStatNames,
	value: string,
	simulate6E: boolean,
) {
	const displayType = gimo2DisplayStatNamesMap[type];
	const rawValue = value.replace(/[+%]/g, "");
	const isPercentVersion =
		(type.endsWith("%") || value.endsWith("%")) &&
		mixedTypes.includes(displayType);

	const realValue =
		simulate6E === false
			? +rawValue
			: type === "Speed"
				? +rawValue + 1
				: statSlicingUpgradeFactors[type] * +rawValue;

	return {
		type: type,
		displayType: displayType,
		value: realValue,
		isPercentVersion: isPercentVersion,
	} as SecondaryStat;
}

function deserializeMod(
	mod: ModTypes.GIMOFlatMod,
	simulateLevel15: boolean,
	simulate6E: boolean,
): Mod {
	const doLevel15 = (simulateLevel15 || simulate6E) && mod.level < 15;
	const do6E = simulate6E && mod.pips === 5;

	const primaryStat = deserializePrimaryStat(
		mod.primaryBonusType,
		mod.primaryBonusValue,
		mod.pips,
		doLevel15,
	);
	const secondaryStats: SecondaryStat[] = [];

	if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_1, mod.secondaryValue_1, do6E),
		);
	}
	if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_2, mod.secondaryValue_2, do6E),
		);
	}
	if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_3, mod.secondaryValue_3, do6E),
		);
	}
	if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_4, mod.secondaryValue_4, do6E),
		);
	}

	//  const setBonus = setBonuses[mod.set.toLowerCase().replace(' ', '')];
	const setBonus = setBonuses[mod.set];

	return {
		id: mod.mod_uid,
		slot: mod.slot.toLowerCase(),
		modset: setBonus,
		level: doLevel15 ? 15 : mod.level,
		pips: do6E ? 6 : mod.pips,
		primaryStat: primaryStat,
		secondaryStats: secondaryStats,
		characterID: mod.characterID,
	} as Mod;
}

function deserializeTarget(target: OptimizationPlan) {
	const updatedTarget = Object.assign({}, target);

	for (const stat of Object.keys(updatedTarget) as OptimizableStats[]) {
		if (Object.keys(statWeights).includes(stat)) {
			updatedTarget[stat] = updatedTarget[stat] / statWeights[stat];
		}
	}

	return updatedTarget;
}
//#endregion Shitty code section

// #region Caching variables

const createModScoresCache = () => {
	const modScoresCache = new Map<
		string,
		{ score: number; partiallyScoredStats: StatValue[] }
	>();
	let currentCharacter: Character.Character | null = null;
	let currentTarget: OptimizationPlan | null = null;

	return {
		get: (mod: Mod) => {
			if (!currentCharacter) {
				throw new Error("flatStats cache used before character was set");
			}
			if (!currentTarget) {
				throw new Error("modScores cache used before target was set");
			}
			const cacheHit = modScoresCache.get(mod.id);
			if (cacheHit) {
				return cacheHit;
			}
			const flattenedStatValues = cache.modStats.get(mod) ?? [];
			const partiallyScoredStats: StatValue[] = [];
			const target = currentTarget;
			const modScore = flattenedStatValues.reduce((score, flatStat) => {
				const isWholeValueStat = wholeValueStats.has(flatStat.displayType);
				if (flatStat.displayType !== "Speed") {
					partiallyScoredStats.push({ ...flatStat });
				}
				return score + scoreStat(flatStat, target, isWholeValueStat);
			}, 0);

			const result = {
				score: modScore,
				partiallyScoredStats,
			};
			modScoresCache.set(mod.id, result);
			return result;
		},
		set: (
			modId: string,
			score: { score: number; partiallyScoredStats: StatValue[] },
		) => {
			modScoresCache.set(modId, score);
		},
		setCharacter: (character: Character.Character) => {
			currentCharacter = character;
		},
		setTarget: (target: OptimizationPlan) => {
			currentTarget = target;
		},
	};
};

const createFlatStatsCache = () => {
	const cache = new Map<FlatStatsCacheKey, StatValue[]>();

	return {
		get: (stat: Stat) => {
			const cacheKey: FlatStatsCacheKey = `${stat.displayType}${stat.isPercentVersion}${stat.value}`;
			const cacheHit = cache.get(cacheKey);
			if (cacheHit) {
				return cacheHit;
			}

			const flatStats = flattenStatValues(stat);
			cache.set(cacheKey, flatStats);
			return flatStats;
		},
		set: (key: FlatStatsCacheKey, flatStats: StatValue[]) => {
			cache.set(key, flatStats);
		},
	};
};

const createModStatsCache = () => {
	const modStatsCache = new Map<string, StatValue[]>();
	let currentCharacter: Character.Character | null = null;
	let relevantStats: Set<string> | null = null;
	return {
		get: (mod: Mod) => {
			if (!currentCharacter) {
				throw new Error("modStats cache used before character was set");
			}
			const cacheHit = modStatsCache.get(mod.id);
			if (cacheHit !== undefined) {
				return cacheHit;
			}

			//			const workingMod = getUpgradedMod(mod);
			let primaryFlatStats: StatValue[] = [];
			const allFlatStats: StatValue[] = [];
			const alreadyPushedStats = new Map<DisplayStatNames, StatValue>();

			if (relevantStats?.has(mod.primaryStat.displayType)) {
				primaryFlatStats = cache.flatStats.get(mod.primaryStat) ?? [];
				for (const flatStat of primaryFlatStats) {
					const newStat = { ...flatStat };
					allFlatStats.push(newStat);
					alreadyPushedStats.set(newStat.displayType, newStat);
				}
			}

			for (const stat of mod.secondaryStats) {
				if (relevantStats?.has(stat.displayType)) {
					const secondaryFlatStats = cache.flatStats.get(stat) ?? [];
					for (const flatStat of secondaryFlatStats) {
						if (!alreadyPushedStats.has(flatStat.displayType)) {
							const newStat = { ...flatStat };
							allFlatStats.push(newStat);
							alreadyPushedStats.set(newStat.displayType, newStat);
						} else {
							const existingStat = alreadyPushedStats.get(flatStat.displayType);
							if (existingStat) {
								existingStat.value += flatStat.value;
								existingStat.integral += flatStat.integral;
								existingStat.fractional += flatStat.fractional;
							}
						}
					}
				}
			}

			modStatsCache.set(mod.id, allFlatStats);
			return allFlatStats;
		},
		setCharacter: (character: Character.Character) => {
			currentCharacter = character;
		},
		setRelevantStats: (target: OptimizationPlan) => {
			relevantStats = new Set<string>();
			for (const targetStat of target.targetStats) {
				relevantStats.add(targetStat.stat);
			}
			if (target.Health !== 0) {
				relevantStats.add("Health");
			}
			if (target.Protection !== 0) {
				relevantStats.add("Protection");
			}
			if (target.Armor !== 0) {
				relevantStats.add("Armor");
				relevantStats.add("Defense");
			}
			if (target.Resistance !== 0) {
				relevantStats.add("Resistance");
				relevantStats.add("Defense");
			}
			if (target.Speed !== 0) {
				relevantStats.add("Speed");
			}
			if (target["Accuracy %"] !== 0) {
				relevantStats.add("Accuracy");
			}
			if (target["Critical Avoidance %"] !== 0) {
				relevantStats.add("Critical Avoidance");
			}
			if (target["Critical Chance"] !== 0) {
				relevantStats.add("Critical Chance");
			}
			if (target["Critical Damage %"] !== 0) {
				relevantStats.add("Critical Damage");
			}
			if (target["Potency %"] !== 0) {
				relevantStats.add("Potency");
			}
			if (target["Tenacity %"] !== 0) {
				relevantStats.add("Tenacity");
			}
			if (target["Physical Damage"] !== 0) {
				relevantStats.add("Physical Damage");
				relevantStats.add("Offense");
			}
			if (target["Special Damage"] !== 0) {
				relevantStats.add("Special Damage");
				relevantStats.add("Offense");
			}
			if (relevantStats.has("Armor") || relevantStats.has("Resistance")) {
				relevantStats.add("Defense");
			}
		},
	};
};

const createModsetScoreCache = () => {
	const modsetScorecache = new Map<
		ModsetScoreCacheKey,
		{ score: number; partiallyScoredStats: StatValue[] }
	>();
	let currentCharacter: Character.Character | null = null;
	let relevantStats: Set<string> | null = null;
	return {
		get: (
			setName: GIMOSetStatNames,
			target: OptimizationPlan,
			modsetCount: number,
		) => {
			if (!currentCharacter) {
				throw new Error("modStats cache used before character was set");
			}

			const cacheKey: ModsetScoreCacheKey = `${setName}-${modsetCount}`;
			const cacheHit = modsetScorecache.get(cacheKey);
			if (cacheHit !== undefined) {
				return cacheHit;
			}

			const flatStats = cache.modsetStats(setName, "half", currentCharacter);
			const countedStats = flatStats.map((stat) => {
				const value = stat.value * modsetCount;
				const integral = Math.trunc(value);
				return {
					...stat,
					value,
					integral,
					fractional: value - integral,
				};
			});
			const score = countedStats.reduce((acc, stat) => {
				if (!relevantStats?.has(stat.displayType)) {
					return acc;
				}
				const isWholeValueStat = wholeValueStats.has(stat.displayType);
				return acc + scoreStat(stat, target, isWholeValueStat);
			}, 0);

			let partiallyScoredStats: StatValue[] = [];
			if (
				setName === "Health %" ||
				setName === "Defense %" ||
				setName === "Offense %"
			) {
				partiallyScoredStats = countedStats;
			}

			const result = { score, partiallyScoredStats };
			modsetScorecache.set(cacheKey, result);
			return result;
		},
		setCharacter: (character: Character.Character) => {
			currentCharacter = character;
		},
		setRelevantStats: (target: OptimizationPlan) => {
			relevantStats = new Set<string>();
			if (target.Health !== 0) {
				relevantStats.add("Health");
			}
			if (target.Armor !== 0) {
				relevantStats.add("Armor");
			}
			if (target.Resistance !== 0) {
				relevantStats.add("Resistance");
			}
			if (target.Speed !== 0) {
				relevantStats.add("Speed");
			}
			if (target["Critical Chance"] !== 0) {
				relevantStats.add("Critical Chance");
				relevantStats.add("Physical Critical Chance");
				relevantStats.add("Special Critical Chance");
			}
			if (target["Critical Damage %"] !== 0) {
				relevantStats.add("Critical Damage");
			}
			if (target["Potency %"] !== 0) {
				relevantStats.add("Potency");
			}
			if (target["Tenacity %"] !== 0) {
				relevantStats.add("Tenacity");
			}
			if (target["Physical Damage"] !== 0) {
				relevantStats.add("Physical Damage");
			}
			if (target["Special Damage"] !== 0) {
				relevantStats.add("Special Damage");
			}
		},
	};
};

const createModsetStatsCache = () => {
	const cache = new Map<string, StatValue[]>();
	return (
		setName: GIMOSetStatNames,
		fullOrHalf: FullOrHalf,
		character: Character.Character,
	) => {
		const cacheKey = `${setName}-${fullOrHalf}-${character.id}`;
		if (cache.has(cacheKey)) {
			return cache.get(cacheKey) ?? [];
		}

		const setStats = getFlatStatsFromSet(setName, fullOrHalf);
		cache.set(cacheKey, setStats);
		return setStats;
	};
};

const cache: Cache = {
	modScores: createModScoresCache(),
	modStats: createModStatsCache(),
	relatedStatValues: new Map<string, Map<string, number>>(),
	modsetScore: createModsetScoreCache(),
	modsetStats: createModsetStatsCache(),
	flatStats: createFlatStatsCache(),
};

function resetCaches() {
	cache.modScores = createModScoresCache();
	cache.modStats = createModStatsCache();
	cache.modsetScore = createModsetScoreCache();
	cache.modsetStats = createModsetStatsCache();
	cache.flatStats = createFlatStatsCache();
}
// #endregion Caching variables

const charactersRelatedTo = new Map<string, Set<TargetStatsNames>>();
// #region Utility functions

// Small helper encapsulating the reuse/skip checks for a character's previous optimization result
function canReusePreviousAssignment(params: {
	recalculateMods: boolean;
	previousModAssignments: FlatCharacterModdings;
	index: number;
}): boolean {
	const { recalculateMods, previousModAssignments, index } = params;

	return (
		!recalculateMods &&
		index <= defaultCompilation$.data.reoptimizationIndex.peek() &&
		!!previousModAssignments[index]
	);
}

function modHasScoreForTargetStat(mod: Mod, targetStat: TargetStat) {
	if (targetStat.stat === "Speed" && targetStat.minimum === 0) return true;
	if (affectedTargetStatsBySet[mod.modset.name].includes(targetStat.stat))
		return true;
	if (
		affectedTargetStatsByPrimaryStat[mod.primaryStat.type].includes(
			targetStat.stat,
		)
	)
		return true;
	if (
		mod.secondaryStats.some((secondaryStat) =>
			affectedTargetStatsBySecondaryStat[secondaryStat.type].includes(
				targetStat.stat,
			),
		)
	)
		return true;
	return false;
}

const modFilters = {
	setNames: new Set<GIMOSetStatNames>(),
	target: fromShortOptimizationPlan({}),
	openModSlots: 0,
	hasSet: (mod: Mod) => modFilters.setNames.has(mod.modset.name),
	no4SlotSets: (mod: Mod) => mod.modset.numberOfModsRequired !== 4,
	no6Dot: (mod: Mod) => mod.pips < 6,
	only6Dot: (mod: Mod) => mod.pips === 6,
	hasMaxLevel: (mod: Mod) => mod.level === 15,
	hasMinimumDots: (mod: Mod) => mod.pips >= modFilters.target.minimumModDots,
	hasRestrictedPrimaryStat: (mod: Mod) => {
		if (["square", "diamond"].includes(mod.slot)) return true;

		const restrictions = modFilters.target.primaryStatRestrictions[
			mod.slot as ModTypes.VariablePrimarySlots
		] as string[];

		return (
			restrictions === undefined ||
			restrictions.length === 0 ||
			restrictions.includes(mod.primaryStat.type)
		);
	},
	hasScoredStats: (mod: Mod) =>
		modFilters.target.targetStats.some((targetStat: TargetStat) =>
			modHasScoreForTargetStat(mod, targetStat),
		),
	noFilter: () => true,
};

const combineModFilters: (filters: ModFilterPredicate[]) => ModFilterPredicate =
	(filters) => (item: Mod) =>
		filters.map((filter) => filter(item)).every((x) => x === true);

function getSetRestrictionsNames(setRestrictions: SetRestrictions) {
	const names = new Set<GIMOSetStatNames>();
	for (const [setName, setCount] of Object.entries(
		setRestrictions,
	) as SetRestrictionsEntries) {
		if (setCount > 0) {
			names.add(setName);
		}
	}
	return names;
}

function addPossibleSetRestrictionsNames(
	setRestrictionNames: Set<GIMOSetStatNames>,
	openModSlots: number,
) {
	if (openModSlots === 0) return;
	for (const setBonus of Object.values(setBonuses)) {
		if (setBonus.numberOfModsRequired <= openModSlots) {
			setRestrictionNames.add(setBonus.name);
		}
	}
}

function getOpenModSlots(setRestrictions: SetRestrictions): number {
	return (
		6 -
		(Object.entries(setRestrictions) as SetRestrictionsEntries)
			.filter(([, setCount]) => setCount > 0)
			.reduce(
				(filledSlots, [setName, setCount]) =>
					filledSlots + setBonuses[setName].numberOfModsRequired * setCount,
				0,
			)
	);
}

function getFlatStatsFromSet(
	setName: GIMOSetStatNames,
	fullOrHalf: FullOrHalf,
) {
	const setBonus = setBonuses[setName];
	const bonus = fullOrHalf === "full" ? setBonus.maxBonus : setBonus.smallBonus;
	return cache.flatStats.get(bonus);
}

function getFlatStatsFromSetLoadouts(
	setLoadouts: Map<string, SetLoadout>,
	character: Character.Character,
) {
	const loadoutsFlatStats = Array.from(setLoadouts.values()).flatMap(
		(loadout) => getFlatStatsFromSetLoadout(loadout, character),
	);
	// Combine the flat stats into a single object
	const combinedStats = loadoutsFlatStats.reduce(
		(acc, stat) => {
			if (!acc[stat.displayType]) {
				acc[stat.displayType] = { ...stat };
			} else {
				acc[stat.displayType].value += stat.value;
			}
			return acc;
		},
		{} as Record<string, StatValue>,
	);

	return Object.values(combinedStats);
}

function getFlatStatsFromSetLoadout(
	setLoadout: SetLoadout,
	character: Character.Character,
) {
	const flattenedStats =
		setLoadout.setName !== "Setless"
			? [
					...cache.modsetStats(
						setLoadout.setName,
						setLoadout.fullOrHalf,
						character,
					),
				]
			: [];

	for (const mod of setLoadout.loadout) {
		const modStats = cache.modStats.get(mod);
		for (const stat of modStats) {
			flattenedStats.push(stat);
		}
	}

	return flattenedStats;
	// return combineFlatStats(flattenedStats);
}

/**
 * Take a stat that may be a percentage and return only the name and absolute values
 * of the stats it affects for a character
 * @param stat {Stat}
 * @param character {Character}
 *
 * @returns {Array<Stat>}
 */
function flattenStatValues(stat: Stat) {
	const statPropertyNames = display2CSGIMOStatNamesMap[stat.displayType];

	const flattenedStats: StatValue[] = statPropertyNames.map((statName) => {
		const displayName = statDisplayNames[statName];
		const value = !stat.isPercentVersion
			? stat.value
			: (stat.value * (currentCharacterStats[statName] ?? 0)) / 100;
		const integralValue = Math.trunc(value);
		return {
			displayType: displayName,
			value,
			integral: integralValue,
			fractional: value % 1,
		};
	});

	return flattenedStats;
}

/**
 * Check to see if a set of mods satisfies all the restrictions a character has placed
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
const loadoutSatisfiesCharacterRestrictions = (
	loadout: Mod[],
	character: Character.Character,
	target: OptimizationPlan,
	satisfiesTargetStats = false,
) => {
	const minimumDots = target.minimumModDots;
	type ModBySlot = {
		[Slot in ModTypes.GIMOSlots]: Extract<Mod, { slot: Slot }>;
	};

	type PartialModBySlot = Partial<ModBySlot>;
	const loadoutSlots: PartialModBySlot = {};
	for (const mod of loadout) {
		(loadoutSlots as Partial<Record<ModTypes.GIMOSlots, Mod>>)[mod.slot] = mod;
	}

	return (
		loadout.every((mod) => mod.pips >= minimumDots) &&
		(!Object.hasOwn(target.primaryStatRestrictions, "arrow") ||
			target.primaryStatRestrictions.arrow === undefined ||
			target.primaryStatRestrictions.arrow.length === 0 ||
			(Object.hasOwn(loadoutSlots, "arrow") &&
				loadoutSlots.arrow !== undefined &&
				target.primaryStatRestrictions.arrow.includes(
					loadoutSlots.arrow.primaryStat.type,
				))) &&
		(!Object.hasOwn(target.primaryStatRestrictions, "triangle") ||
			target.primaryStatRestrictions.triangle === undefined ||
			target.primaryStatRestrictions.triangle.length === 0 ||
			(Object.hasOwn(loadoutSlots, "triangle") &&
				loadoutSlots.triangle !== undefined &&
				target.primaryStatRestrictions.triangle.includes(
					loadoutSlots.triangle.primaryStat.type,
				))) &&
		(!Object.hasOwn(target.primaryStatRestrictions, "circle") ||
			target.primaryStatRestrictions.circle === undefined ||
			target.primaryStatRestrictions.circle.length === 0 ||
			(Object.hasOwn(loadoutSlots, "circle") &&
				loadoutSlots.circle !== undefined &&
				target.primaryStatRestrictions.circle.includes(
					loadoutSlots.circle.primaryStat.type,
				))) &&
		(!Object.hasOwn(target.primaryStatRestrictions, "cross") ||
			target.primaryStatRestrictions.cross === undefined ||
			target.primaryStatRestrictions.cross.length === 0 ||
			(Object.hasOwn(loadoutSlots, "cross") &&
				loadoutSlots.cross !== undefined &&
				target.primaryStatRestrictions.cross.includes(
					loadoutSlots.cross.primaryStat.type,
				))) &&
		(!target.useOnlyFullSets || loadoutFulfillsFullSetRestriction(loadout)) &&
		loadoutFulfillsSetRestriction(loadout, target.setRestrictions) &&
		(satisfiesTargetStats ||
			loadoutFulfillsTargetStatRestriction(loadout, character, target))
	);
};

/**
 * Find any goal stats that weren't hit and return the target and the value.
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param goalStats {Array<TargetStat>}
 * @param target {OptimizationPlan}
 */
function getMissedGoals(
	loadout: Mod[],
	character: Character.Character,
	goalStats: TargetStat[],
) {
	const missedGoals: MissedGoals = [];
	for (const goalStat of goalStats) {
		const characterValue = getStatValueForCharacterWithMods(
			loadout,
			character,
			goalStat.stat,
		);

		if (
			characterValue < goalStat.minimum ||
			characterValue > goalStat.maximum
		) {
			missedGoals.push([goalStat, characterValue]);
		}
	}
	return missedGoals;
}

/**
 * Checks to see if this mod set is made up of only full sets
 *
 * @param loadout {Array<Mod>}
 * @returns {Boolean}
 */
function loadoutFulfillsFullSetRestriction(loadout: Mod[]) {
	// Count how many mods exist in each set
	const setCounts: SetRestrictions = {} as SetRestrictions;
	for (const mod of loadout) {
		const name = mod.modset.name;
		setCounts[name] = (setCounts[name] ?? 0) + 1;
	}

	return (Object.entries(setCounts) as [GIMOSetStatNames, number][]).every(
		([setName, count]) => {
			return 0 === count % setBonuses[setName].numberOfModsRequired;
		},
	);
}

/**
 * Checks to see if this mod set satisfies all of the sets listed in setDefinition
 *
 * @param loadout {Array<Mod>}
 * @param setDefinition {Object<String, Number>}
 * @returns {Boolean}
 */
function loadoutFulfillsSetRestriction(
	loadout: Mod[],
	setDefinition: SetRestrictions,
) {
	// Count how many mods exist in each set
	const setCounts: SetRestrictions = {} as SetRestrictions;
	for (const mod of loadout) {
		const name = mod.modset.name;
		setCounts[name] = (setCounts[name] ?? 0) + 1;
	}

	// Check that each set in the setDefinition has a corresponding value at least that high in setCounts, unless
	// the given count is -1, meaning the set should be actively avoided
	return (Object.entries(setDefinition) as SetRestrictionsEntries).every(
		([setName, count]) => {
			const numberOfFullSets = Math.floor(
				(setCounts[setName] || 0) / setBonuses[setName].numberOfModsRequired,
			);
			return (
				(count >= 0 && numberOfFullSets >= count) ||
				(count < 0 && numberOfFullSets === 0)
			);
		},
	);
}

/**
 * Checks to see if this mod set meets the target stat
 *
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {boolean}
 */
function loadoutFulfillsTargetStatRestriction(
	loadout: Mod[],
	character: Character.Character,
	target: OptimizationPlan,
	modsetValues: Record<TargetStatsNames, number> | null = null,
) {
	const targetStats = target.targetStats;

	if (0 === targetStats.length) {
		return true;
	}

	// Check each target stat individually
	return targetStats.every((targetStat) => {
		if (targetStat.stat === "Health+Protection") return true;
		let totalValue = getStatValueForCharacterWithMods(
			loadout,
			character,
			targetStat.stat,
			modsetValues,
		);
		if (targetStat.stat === "Armor" || targetStat.stat === "Resistance") {
			totalValue =
				(100 * totalValue) / (character.playerValues.level * 7.5 + totalValue);
		}
		return totalValue <= targetStat.maximum && totalValue >= targetStat.minimum;
	});
}

/**
 * Find the absolute value that a given stat has for a character, given a set of mods equipped on them
 *
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param stat {String}
 * @param passedModsetValues {Object<String, Number>}
 * @returns {Number}
 */
function getStatValueForCharacterWithMods(
	loadout: Mod[],
	character: Character.Character,
	stat: TargetStatsNames,
	passedModsetValues: Record<TargetStatsNames, number> | null = null,
) {
	let modsetValue =
		passedModsetValues === null ? null : passedModsetValues[stat];
	if (
		stat !== "Health+Protection" &&
		display2CSGIMOStatNamesMap[stat] &&
		display2CSGIMOStatNamesMap[stat].length > 1
	) {
		throw new Error(
			"Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special.",
		);
	}
	if (stat === "Health+Protection") {
		const healthProperty = display2CSGIMOStatNamesMap.Health[0];
		const protProperty = display2CSGIMOStatNamesMap.Protection[0];
		const baseValue =
			currentCharacterStats[healthProperty] +
			currentCharacterStats[protProperty];

		if (modsetValue === null) {
			const setStats = getFlatStatsFromSetLoadouts(
				splitLoadoutBySets(loadout),
				character,
			);

			modsetValue = setStats.reduce((setValueSum, setStat) => {
				// Check to see if the stat is health or protection. If it is, add its value to the total.
				return setStat.displayType === "Health" ||
					setStat.displayType === "Protection"
					? setValueSum + setStat.value
					: setValueSum;
			}, 0);
		}
		return baseValue + modsetValue;
	}
	const statProperty = display2CSGIMOStatNamesMap[stat][0];
	const baseValue = currentCharacterStats[statProperty];

	if (modsetValue === null) {
		const setStats = getFlatStatsFromSetLoadouts(
			splitLoadoutBySets(loadout),
			character,
		);

		modsetValue = setStats.reduce((setValueSum, setStat) => {
			// Check to see if the stat is the target stat. If it is, add its value to the total.
			return setStat.displayType === stat
				? setValueSum + setStat.value
				: setValueSum;
		}, 0);
	} else {
		const loadoutStatsValues = loadout.reduce(
			(loadoutStats, mod) => {
				const modStats = cache.modStats.get(mod);
				if (modStats) {
					modStats.forEach(({ value, displayType }) => {
						if (displayType === stat) {
							loadoutStats[stat] += value;
						}
					});
				}
				return loadoutStats;
			},
			{ [stat]: 0 } as Record<TargetStatsNames, number>,
		);
		modsetValue += loadoutStatsValues[stat];
	}
	let returnValue = baseValue + modsetValue;

	// Change target stat to a percentage for Armor and Resistance
	// so Reo'Ris shuts up about it in the Discord.
	if (["armor", "resistance"].includes(statProperty)) {
		returnValue =
			(100 * returnValue) / (character.playerValues.level * 7.5 + returnValue);
	}

	return returnValue;
}

/**
 * Return a function to sort mods by their scores for a character
 *
 * @param character Character
 */
function modSort(character: Character.Character) {
	return (left: Mod, right: Mod) => {
		const leftScore = cache.modScores.get(left).score;
		const rightScore = cache.modScores.get(right).score;
		if (leftScore === rightScore) {
			// If mods have equal value, then favor the one that's already equipped
			if (left.characterID !== "null" && character.id === left.characterID) {
				return -1;
			}
			if (right.characterID !== "null" && character.id === right.characterID) {
				return 1;
			}
			return 0;
		}
		return rightScore - leftScore;
	};
}

/**
 * Return how valuable a particular stat is for an Optimization Plan
 * @param stat {Stat}
 * @param target {OptimizationPlan}
 */
function scoreStat(
	stat: StatValue,
	target: OptimizationPlan,
	isWholeValueStat: boolean,
) {
	// Special critical chance is tracked for summary display, but it does not contribute independently to
	// optimization value. The original optimizer only scores the physical side of crit chance.
	if (stat.displayType === "Special Critical Chance") {
		return 0;
	}

	const targetProperties: WithoutCC | "Critical Chance" =
		display2CSGIMOStatNameMap[stat.displayType];
	const valueToScore = isWholeValueStat ? stat.integral : stat.value;
	return target[targetProperties] * valueToScore;
}

function splitLoadoutBySets(loadout: Mod[]) {
	// Use small arrays to reduce Set/Map churn; consolidate leftovers into a single Setless group
	const buckets = new Map<string, Mod[]>();
	const setLoadoutsById = new Map<string, SetLoadout>();
	const leftovers: Mod[] = [];

	for (const mod of loadout) {
		const setName = mod.modset.name;
		const fullOrHalfModset: FullOrHalf = mod.level === 15 ? "full" : "half";
		const key = `${setName}-${fullOrHalfModset}` as const;
		let arr = buckets.get(key);
		if (!arr) {
			arr = [];
			buckets.set(key, arr);
		}
		arr.push(mod);

		const required = setBonuses[setName].numberOfModsRequired;
		if (arr.length === required) {
			// Emit a full set loadout immediately and reset bucket
			const modsArray = arr.slice();
			setLoadoutsById.set(generateLoadoutId(modsArray), {
				loadout: modsArray,
				setName,
				fullOrHalf: fullOrHalfModset,
			});
			buckets.set(key, []);
		}
	}

	// Collect any leftovers across all buckets into a single Setless group
	for (const arr of buckets.values()) {
		if (arr.length > 0) {
			// Push all remaining mods; order is deterministic by input iteration
			for (const m of arr) leftovers.push(m);
		}
	}

	if (leftovers.length > 0) {
		setLoadoutsById.set(generateLoadoutId(leftovers), {
			loadout: leftovers,
			setName: "Setless",
			fullOrHalf: "full",
		});
	}

	return setLoadoutsById;
}

const modsetNames: readonly GIMOSetStatNames[] = [
	"Critical Chance %",
	"Critical Damage %",
	"Defense %",
	"Health %",
	"Offense %",
	"Potency %",
	"Speed %",
	"Tenacity %",
];

const modsetIndexByName: Record<GIMOSetStatNames, number> = {
	"Critical Chance %": 0,
	"Critical Damage %": 1,
	"Defense %": 2,
	"Health %": 3,
	"Offense %": 4,
	"Potency %": 5,
	"Speed %": 6,
	"Tenacity %": 7,
};

/**
 * Given a mod loadout, get the score of that loadout for an OptimizationPlan
 *
 * @param loadout {Array<Mod>}
 * @param target {OptimizationPlan}
 */
function getLoadoutScore(loadout: Mod[], target: OptimizationPlan) {
	const modsetCounts = new Uint8Array(modsetNames.length * 2);
	let modsetsScore = 0;
	let modStatsScore = 0;
	let healthFraction = 0;
	let protectionFraction = 0;
	let physicalDamageFraction = 0;
	let specialDamageFraction = 0;
	let armorFraction = 0;
	let resistanceFraction = 0;

	for (const mod of loadout) {
		const setName = mod.modset.name;
		const fullOrHalf = mod.level === 15 ? 0 : 1;
		modsetCounts[modsetIndexByName[setName] * 2 + fullOrHalf]++;

		const { score, partiallyScoredStats: modPartiallyScoredStats } =
			cache.modScores.get(mod);
		modStatsScore += score;
		for (const stat of modPartiallyScoredStats) {
			switch (stat.displayType) {
				case "Health":
					healthFraction += stat.fractional;
					break;
				case "Protection":
					protectionFraction += stat.fractional;
					break;
				case "Physical Damage":
					physicalDamageFraction += stat.fractional;
					break;
				case "Special Damage":
					specialDamageFraction += stat.fractional;
					break;
				case "Armor":
					armorFraction += stat.fractional;
					break;
				case "Resistance":
					resistanceFraction += stat.fractional;
					break;
			}
		}
	}

	for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
		const setName = modsetNames[setIndex];
		const fullCount = modsetCounts[setIndex * 2];
		const halfCount = modsetCounts[setIndex * 2 + 1];
		const fullModsetCount = Math.floor(
			fullCount / setBonuses[setName].numberOfModsRequired,
		);
		const remainingHalfCount =
			halfCount +
			(fullCount - fullModsetCount * setBonuses[setName].numberOfModsRequired);
		const halfModsetCount = Math.floor(
			remainingHalfCount / setBonuses[setName].numberOfModsRequired,
		);
		const modsetCount = fullModsetCount * 2 + halfModsetCount;
		if (modsetCount === 0) {
			continue;
		}

		const { score, partiallyScoredStats: modsetPartiallyScoredStats } =
			cache.modsetScore.get(setName, target, modsetCount);
		modsetsScore += score;
		for (const stat of modsetPartiallyScoredStats) {
			switch (stat.displayType) {
				case "Health":
					healthFraction += stat.fractional;
					break;
				case "Protection":
					protectionFraction += stat.fractional;
					break;
				case "Physical Damage":
					physicalDamageFraction += stat.fractional;
					break;
				case "Special Damage":
					specialDamageFraction += stat.fractional;
					break;
				case "Armor":
					armorFraction += stat.fractional;
					break;
				case "Resistance":
					resistanceFraction += stat.fractional;
					break;
			}
		}
	}

	let fractionsScore = 0;
	if (healthFraction >= 1) {
		fractionsScore += target.Health * Math.trunc(healthFraction);
	}
	if (protectionFraction >= 1) {
		fractionsScore += target.Protection * Math.trunc(protectionFraction);
	}
	if (physicalDamageFraction >= 1) {
		fractionsScore +=
			target["Physical Damage"] * Math.trunc(physicalDamageFraction);
	}
	if (specialDamageFraction >= 1) {
		fractionsScore +=
			target["Special Damage"] * Math.trunc(specialDamageFraction);
	}
	if (armorFraction >= 1) {
		fractionsScore += target.Armor * Math.trunc(armorFraction);
	}
	if (resistanceFraction >= 1) {
		fractionsScore += target.Resistance * Math.trunc(resistanceFraction);
	}

	return modsetsScore + modStatsScore + fractionsScore;
}
// #endregion

// #region Startup code
// This will be used later. It's calculated here in the constructor so that it only needs to be calculated once
const fourSlotOptions = chooseFromArray<ModTypes.GIMOSlots>(gimoSlots, 4);

const chooseFourOptions: ModTypes.GIMOSlots[][][] = [];
for (const usedSlots of fourSlotOptions) {
	chooseFourOptions.push([
		usedSlots,
		gimoSlots.filter((slot) => !usedSlots.includes(slot)),
	]);
}

const twoSlotOptions = chooseFromArray<ModTypes.GIMOSlots>(gimoSlots, 2);
const chooseTwoOptions: ModTypes.GIMOSlots[][][] = [];
for (const firstSetSlots of twoSlotOptions) {
	const remainingSlots = gimoSlots.filter(
		(slot) => !firstSetSlots.includes(slot),
	);
	const secondSetOptions = chooseFromArray<ModTypes.GIMOSlots>(
		remainingSlots,
		2,
	);
	for (const secondSetSlots of secondSetOptions) {
		chooseTwoOptions.push([
			firstSetSlots,
			secondSetSlots,
			remainingSlots.filter((slot) => !secondSetSlots.includes(slot)),
		]);
	}
}

Object.freeze(chooseFourOptions);
Object.freeze(chooseTwoOptions);
//#endregion startup code

/*********************************************************************************************************************
 * Optimization code                                                                                                 *
 ********************************************************************************************************************/

/**
 * Find the optimum configuration for mods for a list of characters by optimizing mods for the first character,
 * optimizing mods for the second character after removing those used for the first, etc.
 *
 * @param availableMods {Array<Mod>} An array of mods that could potentially be assign to each character
 * @param characterById {Object<String, Character>} A set of characters keyed by base ID that might be optimized
 * @param order {Array<Object>} The characters to optimize, in order, as {id, target}
 * @param incrementalOptimizeIndex {number} index of character to stop optimization at for incremental runs
 * @param globalSettings {Object} The settings to apply to every character being optimized
 * @return {Object} An array with an entry for each item in `order`. Each entry will be of the form
 *                  {id, target, assignedMods, messages}
 */
function optimizeMods(
	availableMods: Mod[],
	characterById: Character.CharacterById,
	order: SelectedCharacters,
	incrementalOptimizeIndex: number | null,
	globalSettings: ProfileOptimizationSettings,
	previousModAssignments: FlatCharacterModdings,
) {
	// We only want to recalculate mods if settings have changed between runs. If global settings or locked
	// characters have changed, recalculate all characters
	let recalculateMods =
		defaultCompilation$.data.isReoptimizationNeeded.peek() === true;

	//TODO: Remove forced recalculation after we are done benchmarking
	recalculateMods = true; //

	// Filter out any mods that are on locked characters, including if all unselected characters are locked
	const selectedCharacterIds = globalSettings.lockUnselectedCharacters
		? new Set(order.map(({ id }) => id))
		: new Set();
	const lockedCharactersForActivePlayer =
		lockedStatus$.lockedCharactersForActivePlayer.peek();
	const usableMods = availableMods.filter(
		(mod) =>
			mod.characterID === "null" ||
			(!lockedCharactersForActivePlayer.has(mod.characterID) &&
				(!globalSettings.lockUnselectedCharacters ||
					selectedCharacterIds.has(mod.characterID))),
	);

	if (
		incrementalOptimizeIndex !== null &&
		incrementalOptimizeIndex < order.length
	) {
		order.length = incrementalOptimizeIndex + 1;
	}

	for (const character of order) {
		for (const targetStat of character.target.targetStats) {
			if (targetStat.relativeCharacterId !== "null") {
				if (!charactersRelatedTo.has(targetStat.relativeCharacterId)) {
					charactersRelatedTo.set(targetStat.relativeCharacterId, new Set());
				}
				charactersRelatedTo
					.get(targetStat.relativeCharacterId)
					?.add(targetStat.stat);
			}
		}
	}

	// For each not-locked character in the list, find the best mod set for that character
	const optimizerResults = order.reduce(
		(
			modSuggestions: FlatCharacterModdings,
			{ id: characterID, target },
			index,
		) => {
			const character = structuredClone(characterById[characterID]);

			// If the character is locked, skip it
			if (lockedStatus$.lockedCharactersForActivePlayer.has(character.id)) {
				return modSuggestions;
			}

			// For each character, check if the settings for the previous run were the same, and skip the character if so
			if (
				canReusePreviousAssignment({
					recalculateMods,
					previousModAssignments,
					index,
				})
			) {
				const assignedMods = previousModAssignments[index].assignedMods;
				const messages = previousModAssignments[index].messages;
				const missedGoals = previousModAssignments[index].missedGoals || [];

				// Remove any assigned mods from the available pool (O(n) with Set membership)
				const assignedIds = new Set(assignedMods);
				let writeIndex = 0;
				for (let readIndex = 0; readIndex < usableMods.length; readIndex++) {
					const mod = usableMods[readIndex];
					if (!assignedIds.has(mod.id)) {
						usableMods[writeIndex++] = mod;
					}
				}
				if (writeIndex < usableMods.length) usableMods.length = writeIndex;

				modSuggestions.push({
					characterId: characterID,
					target: target,
					assignedMods: assignedMods,
					messages: messages,
					missedGoals: missedGoals,
					currentScore: previousModAssignments[index].currentScore || 0,
					previousScore: previousModAssignments[index].previousScore || 0,
				} as FlatCharacterModding);
				return modSuggestions;
			}
			recalculateMods = true;
			cache.modStats.setCharacter(character);
			cache.modsetScore.setCharacter(character);
			cache.modStats.setRelevantStats(target);
			cache.modsetScore.setRelevantStats(target);
			cache.modScores.setCharacter(character);
			cache.modScores.setTarget(target);
			currentCharacterStats =
				target.simulatedRelicLevel > 1 &&
				target.simulatedStats !== undefined &&
				target.simulatedStats !== null
					? target.simulatedStats
					: character.playerValues.equippedStats;
			if (
				target.simulatedRelicLevel > 1 &&
				target.simulatedStats !== undefined &&
				target.simulatedStats !== null
			) {
				character.playerValues.gearLevel = 13;
				character.playerValues.relicTier = target.simulatedRelicLevel;
			}
			if (globalSettings.optimizeWithPrimaryAndSetRestrictions === false) {
				target.setRestrictions = {};
				target.primaryStatRestrictions = {} as PrimaryStatRestrictions;
			}
			if (globalSettings.forceCompleteSets) {
				target.useOnlyFullSets = true;
			}

			const absoluteTarget = changeRelativeTargetStatsToAbsolute(target);

			// Extract any target stats that are set as only goals
			const goalStats = absoluteTarget.targetStats.filter(
				(targetStat) => !targetStat.optimizeForTarget,
			);

			absoluteTarget.targetStats = absoluteTarget.targetStats.filter(
				(targetStat) => targetStat.optimizeForTarget,
			);

			const realTarget = combineTargetStats(absoluteTarget, character);

			let foundLoadout = findBestLoadoutForCharacter(
				usableMods,
				character,
				order.length,
				index,
				realTarget,
			);
			const messages = structuredClone(foundLoadout.messages);
			if (foundLoadout.loadout.length === 0) {
				const noRestrictionsTarget = {
					...realTarget,
					setRestrictions: {},
					primaryStatRestrictions: {} as PrimaryStatRestrictions,
					targetStats: [],
					useOnlyFullSets: false,
					minimumModDots: 0,
				};
				foundLoadout = findBestLoadoutForCharacter(
					usableMods,
					character,
					order.length,
					index,
					noRestrictionsTarget,
				);
				for (const message of messages) {
					foundLoadout.messages.push(message);
				}
				foundLoadout.messages.push(
					"Could not find a loadout that satisfies the given restrictions. Suggesting the best loadout with no restrictions instead.",
				);
			}

			const oldLoadoutForCharacter = availableMods.filter(
				(mod) => mod.characterID === character.id,
			);
			const remainingOldLoadoutForCharacter = usableMods.filter(
				(mod) => mod.characterID === character.id,
			);

			const oldLoadoutScore =
				previousModAssignments[index] !== undefined &&
				previousModAssignments[index].characterId === characterID &&
				previousModAssignments[index].previousScore !== 0
					? previousModAssignments[index].previousScore
					: getLoadoutScore(oldLoadoutForCharacter, realTarget);

			// Assign the new loadout if any of the following are true:
			let assignedLoadout: Mod[] = [];
			let assignmentMessages: string[] = [];
			if (
				// Treat a threshold of 0 as "always change", so long as the new mod set is better than the old at all
				(globalSettings.modChangeThreshold === 0 &&
					foundLoadout.score >= oldLoadoutScore) ||
				// If the new set is the same mods as the old set
				(foundLoadout.loadout.length === oldLoadoutForCharacter.length &&
					oldLoadoutForCharacter.every((oldMod) =>
						foundLoadout.loadout.find((newMod) => newMod.id === oldMod.id),
					)) ||
				// If the old set doesn't satisfy the character/target restrictions, but the new set does
				(!loadoutSatisfiesCharacterRestrictions(
					oldLoadoutForCharacter,
					character,
					realTarget,
				) &&
					loadoutSatisfiesCharacterRestrictions(
						foundLoadout.loadout,
						character,
						realTarget,
					)) ||
				// If the new set is better than the old set
				(foundLoadout.score / oldLoadoutScore) * 100 - 100 >
					globalSettings.modChangeThreshold ||
				// If the new loadout has more mods than the old
				foundLoadout.loadout.length > remainingOldLoadoutForCharacter.length
			) {
				assignedLoadout = foundLoadout.loadout;
				assignmentMessages = foundLoadout.messages;
			} else {
				assignedLoadout = oldLoadoutForCharacter;
				if (
					!loadoutSatisfiesCharacterRestrictions(
						foundLoadout.loadout,
						character,
						realTarget,
					)
				) {
					foundLoadout.score = oldLoadoutScore;
					assignmentMessages.push(
						"Could not find a new mod set that satisfies the given restrictions. Leaving the old mods equipped.",
					);
				}
			}

			// // Check the goal stats and add any messages related to missing goals
			// assignmentMessages.push(...getMissingGoalStatMessages(newLoadoutForCharacter, character, goalStats, target));

			// Remove any assigned mods from the available pool (O(n) with Set membership)
			const assignedSet = new Set(assignedLoadout);
			let writeIndex = 0;
			for (let readIndex = 0; readIndex < usableMods.length; readIndex++) {
				const mod = usableMods[readIndex];
				if (!assignedSet.has(mod)) {
					usableMods[writeIndex++] = mod;
				}
			}
			if (writeIndex < usableMods.length) usableMods.length = writeIndex;

			modSuggestions.push({
				characterId: characterID,
				target: target,
				assignedMods: assignedLoadout.map((mod) => mod.id),
				messages: assignmentMessages,
				missedGoals: getMissedGoals(assignedLoadout, character, goalStats),
				currentScore:
					assignedLoadout === foundLoadout.loadout
						? foundLoadout.score
						: oldLoadoutScore,
				previousScore: oldLoadoutScore,
			});

			if (charactersRelatedTo.has(character.id)) {
				const relatedStatValues: Map<string, number> = new Map();
				charactersRelatedTo.get(character.id)?.forEach((relatedStat) => {
					relatedStatValues.set(
						relatedStat,
						getStatValueForCharacterWithMods(
							assignedLoadout,
							character,
							relatedStat,
						),
					);
				});
				cache.relatedStatValues.set(character.id, relatedStatValues);
			}

			resetCaches();
			return modSuggestions;
		},
		[],
	);

	return optimizerResults;
}

/**
 * Given a target for a character, update any relative target stats to asbolute
 * target stats by adding the base values from the relative character
 *
 * @param modSuggestions {Array<Object>} An array of previously optimized characters
 * @param character {Object<String, Character>} A map of character IDs to character objects
 * @param lockedCharacters {Array<String>} An array containing all of the locked character IDs
 * @param allMods {Array<Mod>} An array of all mods, used to find equipped mods for a character when they are locked
 * @param target {OptimizationPlan} The target that is being changed
 * @param character {Character} The character currently being optimized
 */
function changeRelativeTargetStatsToAbsolute(
	target: OptimizationPlan,
): OptimizationPlan {
	const oldTargetStats = target.targetStats;

	return {
		...target,
		targetStats: oldTargetStats.map((targetStat: TargetStat) => {
			if (targetStat.relativeCharacterId === "null") {
				return targetStat;
			}

			//			clearCache();

			const characterStatValue =
				cache.relatedStatValues
					.get(targetStat.relativeCharacterId)
					?.get(targetStat.stat) ?? 0;

			let minimum: number;
			let maximum: number;

			if (targetStat.type === "*") {
				minimum = (characterStatValue * targetStat.minimum) / 100;
				maximum = (characterStatValue * targetStat.maximum) / 100;
			} else {
				minimum = characterStatValue + targetStat.minimum;
				maximum = characterStatValue + targetStat.maximum;
			}

			return {
				id: targetStat.id,
				minimum: minimum,
				maximum: maximum,
				stat: targetStat.stat,
				relativeCharacterId: "null",
				type: "+",
				optimizeForTarget: targetStat.optimizeForTarget,
			};
		}),
	};
}

/**
 * Combine multiple iterations of a target stat into a single target by taking the intersection of the
 * ranges. If there is no intersection, throw an error
 *
 * @param target {OptimizationPlan}
 * @param character {Character}
 */
function combineTargetStats(
	target: OptimizationPlan,
	character: Character.Character,
) {
	const targetStatMap: Partial<Record<TargetStatsNames, TargetStat>> = {};

	for (const targetStat of target.targetStats) {
		const statName = targetStat.stat;

		if (!Object.hasOwn(targetStatMap, statName)) {
			targetStatMap[statName] = targetStat;
			continue;
		}

		const currentStat = targetStatMap[statName];
		if (currentStat) {
			const newMinimum = Math.max(currentStat.minimum ?? 0, targetStat.minimum);
			const newMaximum = Math.min(currentStat.maximum ?? 0, targetStat.maximum);

			if (newMinimum > newMaximum) {
				throw new Error(
					`
          The multiple ${statName} targets on ${character.id} don't have any solution. Please adjust the targets.
          First Target: ${currentStat.minimum}-${currentStat.maximum}.
          Second Target: ${targetStat.minimum}-${targetStat.maximum}.
        `.trim(),
				);
			}

			currentStat.minimum = newMinimum;
			currentStat.maximum = newMaximum;
		}
	}

	return {
		...target,
		targetStats: Object.values(targetStatMap),
	};
}

/**
 * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
 * such that the values in the plan are optimized.
 *
 * @param mods {Array<Mod>} The set of mods that is available to be used for this character
 * @param character {Character} A Character object that represents all of the base stats required
 *                              for percentage calculations
 * @param target {OptimizationPlan}
 * @returns {{messages: Array<String>, loadout: Array<Mod>}}
 */
function findBestLoadoutForCharacter(
	mods: Mod[],
	character: Character.Character,
	characterCount: number,
	characterIndex: number,
	target: OptimizationPlan,
) {
	const setRestrictions = target.setRestrictions;
	const targetStats = target.targetStats;

	let foundLoadout: LoadoutAndMessages = {
		id: "",
		loadout: [],
		messages: [],
		score: 0,
	};

	// First, check to see if there is any target stat
	if (0 < targetStats.length) {
		foundLoadout = findBestLoadoutFulfillingTargetStats(
			mods,
			character,
			characterCount,
			characterIndex,
			target,
		);

		if (foundLoadout.loadout.length === 0) {
			foundLoadout.messages.push("Could not fulfill targetstats restriction");
		}

		return foundLoadout;
	}
	// Filter out any mods that don't meet primary or set restrictions. This can vastly speed up this process
	const setRestrictionsNames = getSetRestrictionsNames(setRestrictions);
	const openModSlots = getOpenModSlots(setRestrictions);
	addPossibleSetRestrictionsNames(setRestrictionsNames, openModSlots);
	modFilters.target = target;
	modFilters.openModSlots = openModSlots;
	modFilters.setNames = setRestrictionsNames;
	const usableMods = mods.filter(
		combineModFilters([
			modFilters.hasMinimumDots,
			modFilters.hasRestrictedPrimaryStat,
			modFilters.hasSet,
			character.playerValues.gearLevel < 12
				? modFilters.no6Dot
				: modFilters.noFilter,
		]),
	);

	progressMessage(
		character.id,
		characterCount,
		characterIndex,
		1,
		0,
		"",
		1,
		0,
		"Finding the best loadout",
		0,
	);
	foundLoadout = findBestLoadoutWithoutChangingRestrictions(
		usableMods,
		character,
		target,
		setRestrictions,
	);
	if (foundLoadout.loadout.length === 0) {
		foundLoadout.messages.push("Could not fulfill restrictions");
	}

	return foundLoadout;
}

function buildModsetCompositionsRequirements(
	setRestrictions: SetRestrictions,
	target: OptimizationPlan,
) {
	const modsetRequirement: ModsetCompositionRequirement = new Uint8Array([
		Math.max(setRestrictions["Critical Chance %"] || 0, 0) * 2,
		Math.max(setRestrictions["Critical Damage %"] || 0, 0) * 4,
		Math.max(setRestrictions["Defense %"] || 0, 0) * 2,
		Math.max(setRestrictions["Health %"] || 0, 0) * 2,
		Math.max(setRestrictions["Offense %"] || 0, 0) * 4,
		Math.max(setRestrictions["Potency %"] || 0, 0) * 2,
		Math.max(setRestrictions["Speed %"] || 0, 0) * 4,
		Math.max(setRestrictions["Tenacity %"] || 0, 0) * 2,
	]);
	const modsetRequirements: ModsetCompositionRequirement[] = [
		modsetRequirement,
	];
	const openModSlots = getOpenModSlots(setRestrictions);
	if (openModSlots < 2) return modsetRequirements;

	const modsetsNeededForScoringOrTargetStats = Object.values(setBonuses).filter(
		(setBonus) =>
			setRestrictions[setBonus.name] !== -1 &&
			affectedOptimizableStatsBySet[setBonus.name].some(
				(stat) =>
					(target[stat] !== undefined && target[stat] !== 0) ||
					target.targetStats.some((targetStat) => targetStat.stat === stat),
			),
	);

	const addCompositions = (
		startIndex: number,
		remainingSlots: number,
		composition: ModsetCompositionRequirement,
	) => {
		for (
			let index = startIndex;
			index < modsetsNeededForScoringOrTargetStats.length;
			index++
		) {
			const setBonus = modsetsNeededForScoringOrTargetStats[index];
			if (setBonus.numberOfModsRequired > remainingSlots) continue;

			const updatedComposition = composition.slice();
			const setIndex =
				modsetCompositionRequirementsIndicesBySetName[setBonus.name];
			updatedComposition[setIndex] += setBonus.numberOfModsRequired;
			modsetRequirements.push(updatedComposition);

			const slotsLeft = remainingSlots - setBonus.numberOfModsRequired;
			if (slotsLeft >= 2) {
				addCompositions(index, slotsLeft, updatedComposition);
			}
		}
	};

	addCompositions(0, openModSlots, modsetRequirement);

	return modsetRequirements;
}

function* generateModsetDistributions(
	composition: ModsetCompositionRequirement,
	baseModsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	scoredSetNames: GIMOSetStatNames[],
	character: Character.Character,
	target: OptimizationPlan,
): Generator<ModsetDistribution> {
	const distribution: ModsetDistribution = Array(gimoSlots.length).fill(null);
	const counts = new Uint8Array(modsetNames.length);
	const maximumCounts = composition.slice();
	const scoredSetIndices = new Set(
		scoredSetNames.map((setName) => modsetIndexByName[setName]),
	);
	const trackedSetNames = modsetNames
		.filter((setName) => {
			const setIndex = modsetIndexByName[setName];
			return scoredSetIndices.has(setIndex) || composition[setIndex] > 0;
		})
		.map((setName) => setName as GIMOSetStatNames);
	const compositionSlots = composition.reduce(
		(total, modCount) => total + modCount,
		0,
	);
	const openSlotsAfterComposition = gimoSlots.length - compositionSlots;
	const constraintTargetStats = target.targetStats.filter((targetStat) => {
		if (targetStat.stat === "Health+Protection") return false;
		const property = display2CSGIMOStatNamesMap[
			targetStat.stat
		][0] as OptimizableStats;
		return target[property] === 0;
	});
	const fixedSetValues = constraintTargetStats.map((targetStat) => {
		let value = 0;
		for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
			if (composition[setIndex] === 0) continue;
			value +=
				getStatsValueForTargetStat(
					cache.modsetStats(modsetNames[setIndex], "full", character),
					targetStat.stat,
				) *
				(composition[setIndex] / requiredModsOfModsets[setIndex]);
		}
		return value;
	});
	const optionalSetValues = constraintTargetStats.length
		? getMaximumOptionalSetValues(composition, character, target)
		: new Float64Array();
	for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
		maximumCounts[setIndex] = scoredSetIndices.has(setIndex)
			? composition[setIndex] +
				Math.min(openSlotsAfterComposition, requiredModsOfModsets[setIndex] - 1)
			: trackedSetNames.includes(modsetNames[setIndex])
				? gimoSlots.length
				: 0;
	}

	const hasAvailableMod = (
		slot: ModTypes.GIMOSlots,
		setName: GIMOSetStatNames | null,
	) =>
		baseModsBySlot[slot].some((mod) =>
			setName === null
				? !scoredSetNames.includes(mod.modset.name)
				: mod.modset.name === setName,
		);

	const canStillCompleteComposition = (nextSlotIndex: number) => {
		const remainingSlots = gimoSlots.length - nextSlotIndex;
		let requiredSlots = 0;
		for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
			requiredSlots += Math.max(0, composition[setIndex] - counts[setIndex]);
		}
		return requiredSlots <= remainingSlots;
	};
	const candidateSetNamesForSlot = () => {
		const candidateSetNames = trackedSetNames.filter((setName) => {
			const setIndex = modsetIndexByName[setName];
			return (
				counts[setIndex] < maximumCounts[setIndex] &&
				(scoredSetIndices.has(setIndex) && composition[setIndex] > 0
					? true
					: scoredSetIndices.has(setIndex)
						? requiredModsOfModsets[setIndex] <= openSlotsAfterComposition
						: true)
			);
		});
		candidateSetNames.push(null as unknown as GIMOSetStatNames);
		return candidateSetNames;
	};

	const canPartialDistributionReachTargets = (nextSlotIndex: number) => {
		for (
			let targetStatIndex = 0;
			targetStatIndex < constraintTargetStats.length;
			targetStatIndex++
		) {
			const targetStat = constraintTargetStats[targetStatIndex];
			const [minimum, maximum] = getTargetStatBounds(targetStat, character);
			let minimumModsValue = 0;
			let maximumModsValue = 0;
			for (let slotIndex = 0; slotIndex < gimoSlots.length; slotIndex++) {
				const slot = gimoSlots[slotIndex];
				let possibleMods = baseModsBySlot[slot];
				if (slotIndex < nextSlotIndex) {
					const assignedSet = distribution[slotIndex];
					possibleMods = baseModsBySlot[slot].filter((mod) =>
						assignedSet === null
							? !scoredSetIndices.has(modsetIndexByName[mod.modset.name])
							: mod.modset.name === assignedSet,
					);
				}
				if (possibleMods.length === 0) return false;
				const values = possibleMods.map((mod) =>
					getStatsValueForTargetStat(cache.modStats.get(mod), targetStat.stat),
				);
				minimumModsValue += Math.min(...values);
				maximumModsValue += Math.max(...values);
			}
			if (
				maximumModsValue +
					fixedSetValues[targetStatIndex] +
					(optionalSetValues[targetStatIndex] ?? 0) <
					minimum ||
				minimumModsValue + fixedSetValues[targetStatIndex] > maximum
			) {
				return false;
			}
		}
		return true;
	};

	function* recurse(slotIndex: number): Generator<ModsetDistribution> {
		if (!canPartialDistributionReachTargets(slotIndex)) return;
		if (slotIndex === gimoSlots.length) {
			for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
				const completedSets = Math.floor(
					counts[setIndex] / requiredModsOfModsets[setIndex],
				);
				const requiredSets = Math.floor(
					composition[setIndex] / requiredModsOfModsets[setIndex],
				);
				if (
					scoredSetIndices.has(setIndex) &&
					Math.floor(counts[setIndex] / requiredModsOfModsets[setIndex]) !==
						requiredSets
				) {
					return;
				}
				if (
					!scoredSetIndices.has(setIndex) &&
					composition[setIndex] > 0 &&
					completedSets < requiredSets
				) {
					return;
				}
			}
			yield distribution.slice();
			return;
		}

		const slot = gimoSlots[slotIndex];
		const candidateSetNames = candidateSetNamesForSlot();

		for (const setName of candidateSetNames) {
			if (!hasAvailableMod(slot, setName)) continue;
			if (setName === null) {
				distribution[slotIndex] = null;
				yield* recurse(slotIndex + 1);
				continue;
			}

			const setIndex = modsetIndexByName[setName];
			counts[setIndex]++;
			if (canStillCompleteComposition(slotIndex + 1)) {
				distribution[slotIndex] = setName;
				yield* recurse(slotIndex + 1);
			}
			counts[setIndex]--;
		}
	}

	yield* recurse(0);
}

function createMaxHeap<T>(compare: (left: T, right: T) => number) {
	const values: T[] = [];
	const swap = (left: number, right: number) => {
		const value = values[left];
		values[left] = values[right];
		values[right] = value;
	};

	return {
		get size() {
			return values.length;
		},
		push(value: T) {
			values.push(value);
			let index = values.length - 1;
			while (index > 0) {
				const parent = Math.floor((index - 1) / 2);
				if (compare(values[parent], values[index]) >= 0) break;
				swap(parent, index);
				index = parent;
			}
		},
		pop() {
			if (values.length === 0) return undefined;
			const first = values[0];
			const last = values.pop();
			if (values.length > 0 && last !== undefined) {
				values[0] = last;
				let index = 0;
				while (true) {
					const left = index * 2 + 1;
					const right = left + 1;
					let largest = index;
					if (
						left < values.length &&
						compare(values[left], values[largest]) > 0
					) {
						largest = left;
					}
					if (
						right < values.length &&
						compare(values[right], values[largest]) > 0
					) {
						largest = right;
					}
					if (largest === index) break;
					swap(index, largest);
					index = largest;
				}
			}
			return first;
		},
	};
}

function getCompositionSetScore(
	composition: ModsetCompositionRequirement,
	target: OptimizationPlan,
) {
	let score = 0;
	for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
		const modCount = composition[setIndex];
		if (modCount === 0) continue;
		const setName = modsetNames[setIndex];
		const setCount = modCount / requiredModsOfModsets[setIndex];
		score += cache.modsetScore.get(setName, target, setCount * 2).score;
	}
	return score;
}

function getCompositionFractionalScoreUpperBound(
	composition: ModsetCompositionRequirement,
	modsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	target: OptimizationPlan,
) {
	const maximumFractions: Partial<Record<DisplayStatNames, number>> = {};
	for (const slot of gimoSlots) {
		const slotMaximums: Partial<Record<DisplayStatNames, number>> = {};
		for (const mod of modsBySlot[slot]) {
			for (const stat of cache.modScores.get(mod).partiallyScoredStats) {
				slotMaximums[stat.displayType] = Math.max(
					slotMaximums[stat.displayType] ?? 0,
					stat.fractional,
				);
			}
		}
		for (const [stat, fraction] of Object.entries(slotMaximums)) {
			maximumFractions[stat as DisplayStatNames] =
				(maximumFractions[stat as DisplayStatNames] ?? 0) + fraction;
		}
	}

	for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
		const modCount = composition[setIndex];
		if (modCount === 0) continue;
		const setName = modsetNames[setIndex];
		for (const stat of cache.modsetScore.get(
			setName,
			target,
			(modCount / requiredModsOfModsets[setIndex]) * 2,
		).partiallyScoredStats) {
			maximumFractions[stat.displayType] =
				(maximumFractions[stat.displayType] ?? 0) + stat.fractional;
		}
	}

	let score = 0;
	for (const [stat, fraction] of Object.entries(maximumFractions)) {
		const targetProperty = display2CSGIMOStatNameMap[stat as DisplayStatNames];
		const weight = target[targetProperty];
		if (weight > 0) score += weight * Math.trunc(fraction);
	}
	return score;
}

function getTargetStatBounds(
	targetStat: TargetStat,
	character: Character.Character,
): [number, number] {
	if (targetStat.stat === "Health+Protection") {
		const baseValue =
			currentCharacterStats.Health + currentCharacterStats.Protection;
		return [targetStat.minimum - baseValue, targetStat.maximum - baseValue];
	}

	const property = display2CSGIMOStatNamesMap[targetStat.stat][0];
	if (property === "Armor" || property === "Resistance") {
		const baseDefense = character.playerValues.level * 7.5;
		const toRawValue = (percentage: number) =>
			percentage >= 100
				? Number.POSITIVE_INFINITY
				: (percentage * baseDefense) / (100 - percentage);
		return [
			toRawValue(targetStat.minimum) - currentCharacterStats[property],
			toRawValue(targetStat.maximum) - currentCharacterStats[property],
		];
	}

	return [
		targetStat.minimum - currentCharacterStats[property],
		targetStat.maximum - currentCharacterStats[property],
	];
}

function getStatsValueForTargetStat(
	stats: StatValue[],
	targetStat: TargetStatsNames,
) {
	return targetStat === "Health+Protection"
		? (stats.find((stat) => stat.displayType === "Health")?.value ?? 0) +
				(stats.find((stat) => stat.displayType === "Protection")?.value ?? 0)
		: (stats.find((stat) => stat.displayType === targetStat)?.value ?? 0);
}

function pruneModsByTargetStats(
	modsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	character: Character.Character,
	target: OptimizationPlan,
	composition: ModsetCompositionRequirement,
) {
	if (target.targetStats.length === 0) return;

	const valuesByTargetStat = new Map<TargetStatsNames, Map<string, number>>();
	const fixedSetValues = target.targetStats.map((targetStat) => {
		let value = 0;
		for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
			if (composition[setIndex] === 0) continue;
			value +=
				getStatsValueForTargetStat(
					cache.modsetStats(modsetNames[setIndex], "full", character),
					targetStat.stat,
				) *
				(composition[setIndex] / requiredModsOfModsets[setIndex]);
		}
		return value;
	});
	const optionalSetValues = getMaximumOptionalSetValues(
		composition,
		character,
		target,
	);
	const targetBounds = new Map<TargetStatsNames, [number, number]>();

	for (const targetStat of target.targetStats) {
		const values = new Map<string, number>();
		for (const slot of gimoSlots) {
			for (const mod of modsBySlot[slot]) {
				values.set(
					mod.id,
					getStatsValueForTargetStat(cache.modStats.get(mod), targetStat.stat),
				);
			}
		}
		valuesByTargetStat.set(targetStat.stat, values);
		targetBounds.set(
			targetStat.stat,
			getTargetStatBounds(targetStat, character),
		);
	}

	let changed = true;
	while (changed) {
		changed = false;
		for (
			let targetStatIndex = 0;
			targetStatIndex < target.targetStats.length;
			targetStatIndex++
		) {
			const targetStat = target.targetStats[targetStatIndex];
			const values = valuesByTargetStat.get(targetStat.stat);
			const bounds = targetBounds.get(targetStat.stat);
			if (!values || !bounds) continue;

			const minBySlot = new Map<ModTypes.GIMOSlots, number>();
			const maxBySlot = new Map<ModTypes.GIMOSlots, number>();
			let totalMinimum = 0;
			let totalMaximum = 0;
			for (const slot of gimoSlots) {
				const slotValues = modsBySlot[slot].map(
					(mod) => values.get(mod.id) ?? 0,
				);
				const slotMinimum = Math.min(...slotValues);
				const slotMaximum = Math.max(...slotValues);
				minBySlot.set(slot, slotMinimum);
				maxBySlot.set(slot, slotMaximum);
				totalMinimum += slotMinimum;
				totalMaximum += slotMaximum;
			}

			for (const slot of gimoSlots) {
				const retainedMods = modsBySlot[slot].filter((mod) => {
					const value = values.get(mod.id) ?? 0;
					const maximumReachable =
						value +
						(totalMaximum - (maxBySlot.get(slot) ?? 0)) +
						fixedSetValues[targetStatIndex] +
						optionalSetValues[targetStatIndex];
					const minimumReachable =
						value +
						totalMinimum -
						(minBySlot.get(slot) ?? 0) +
						fixedSetValues[targetStatIndex];
					return maximumReachable >= bounds[0] && minimumReachable <= bounds[1];
				});
				if (retainedMods.length !== modsBySlot[slot].length) {
					changed = true;
					modsBySlot[slot] = retainedMods;
				}
			}
		}
		if (gimoSlots.some((slot) => modsBySlot[slot].length === 0)) return;
	}
}

function pruneModsCrossTargetStats(
	modsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	character: Character.Character,
	target: OptimizationPlan,
	composition: ModsetCompositionRequirement,
) {
	if (target.targetStats.length < 2) return;
	if (gimoSlots.some((slot) => modsBySlot[slot].length === 0)) return;

	const targetStatCount = target.targetStats.length;

	const fixedSetValues = new Float64Array(targetStatCount);
	for (let t = 0; t < targetStatCount; t++) {
		const targetStat = target.targetStats[t];
		for (let s = 0; s < modsetNames.length; s++) {
			if (composition[s] === 0) continue;
			fixedSetValues[t] +=
				getStatsValueForTargetStat(
					cache.modsetStats(modsetNames[s], "full", character),
					targetStat.stat,
				) *
				(composition[s] / requiredModsOfModsets[s]);
		}
	}
	const optionalSetValues = getMaximumOptionalSetValues(
		composition,
		character,
		target,
	);

	const lowerBounds = new Float64Array(targetStatCount);
	const upperBounds = new Float64Array(targetStatCount);
	for (let t = 0; t < targetStatCount; t++) {
		const [lower, upper] = getTargetStatBounds(
			target.targetStats[t],
			character,
		);
		lowerBounds[t] = lower;
		upperBounds[t] = upper;
	}

	const slotCount = gimoSlots.length;
	const modValues: Float64Array[] = [];
	const slotMin: Float64Array[] = [];
	const slotMax: Float64Array[] = [];

	for (let si = 0; si < slotCount; si++) {
		const slotMods = modsBySlot[gimoSlots[si]];
		const values = new Float64Array(slotMods.length * targetStatCount);
		const min = new Float64Array(targetStatCount).fill(
			Number.POSITIVE_INFINITY,
		);
		const max = new Float64Array(targetStatCount).fill(
			Number.NEGATIVE_INFINITY,
		);

		for (let mi = 0; mi < slotMods.length; mi++) {
			const modStats = cache.modStats.get(slotMods[mi]);
			for (let t = 0; t < targetStatCount; t++) {
				const v = getStatsValueForTargetStat(
					modStats,
					target.targetStats[t].stat,
				);
				values[mi * targetStatCount + t] = v;
				if (v < min[t]) min[t] = v;
				if (v > max[t]) max[t] = v;
			}
		}

		modValues[si] = values;
		slotMin[si] = min;
		slotMax[si] = max;
	}

	const remainingMin: Float64Array[][] = [];
	const remainingMax: Float64Array[][] = [];

	for (let si = 0; si < slotCount; si++) {
		remainingMin[si] = [];
		remainingMax[si] = [];
		for (let oi = 0; oi < slotCount; oi++) {
			if (oi === si) {
				remainingMin[si][oi] = new Float64Array(targetStatCount);
				remainingMax[si][oi] = new Float64Array(targetStatCount);
				continue;
			}
			const min = new Float64Array(targetStatCount);
			const max = new Float64Array(targetStatCount);
			for (let ri = 0; ri < slotCount; ri++) {
				if (ri === si || ri === oi) continue;
				for (let t = 0; t < targetStatCount; t++) {
					min[t] += slotMin[ri][t];
					max[t] += slotMax[ri][t];
				}
			}
			remainingMin[si][oi] = min;
			remainingMax[si][oi] = max;
		}
	}

	for (let si = 0; si < slotCount; si++) {
		const slot = gimoSlots[si];
		const slotMods = modsBySlot[slot];
		const slotModValues = modValues[si];

		const retained: Mod[] = [];
		for (let mi = 0; mi < slotMods.length; mi++) {
			let isValid = true;

			for (let oi = 0; oi < slotCount && isValid; oi++) {
				if (oi === si) continue;

				const otherSlotMods = modsBySlot[gimoSlots[oi]];
				const otherSlotModValues = modValues[oi];
				const remMin = remainingMin[si][oi];
				const remMax = remainingMax[si][oi];

				let hasCompatible = false;
				for (let omi = 0; omi < otherSlotMods.length; omi++) {
					let compatible = true;
					for (let t = 0; t < targetStatCount; t++) {
						const modValue = slotModValues[mi * targetStatCount + t];
						const otherModValue = otherSlotModValues[omi * targetStatCount + t];
						const reqMax = upperBounds[t] - modValue - fixedSetValues[t];
						const reqMin =
							lowerBounds[t] -
							modValue -
							fixedSetValues[t] -
							optionalSetValues[t];

						if (
							otherModValue + remMin[t] > reqMax ||
							otherModValue + remMax[t] < reqMin
						) {
							compatible = false;
							break;
						}
					}
					if (compatible) {
						hasCompatible = true;
						break;
					}
				}

				if (!hasCompatible) {
					isValid = false;
				}
			}

			if (isValid) retained.push(slotMods[mi]);
		}

		if (retained.length !== slotMods.length) {
			modsBySlot[slot] = retained;
		}
	}
}
function deduplicateEquivalentModsBySlot(
	modsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	character: Character.Character,
	target: OptimizationPlan,
) {
	for (const slot of gimoSlots) {
		const bestBySignature = new Map<string, Mod>();
		for (const mod of modsBySlot[slot]) {
			const modScore = cache.modScores.get(mod);
			const targetValues = target.targetStats.map((targetStat) =>
				getStatsValueForTargetStat(cache.modStats.get(mod), targetStat.stat),
			);
			const fractionalValues = modScore.partiallyScoredStats
				.map((stat) => [stat.displayType, stat.fractional] as const)
				.sort(([left], [right]) => left.localeCompare(right));
			const signature = JSON.stringify([
				mod.modset.name,
				targetValues,
				fractionalValues,
			]);
			const existing = bestBySignature.get(signature);
			if (
				existing === undefined ||
				modScore.score > cache.modScores.get(existing).score ||
				(modScore.score === cache.modScores.get(existing).score &&
					mod.characterID === character.id &&
					existing.characterID !== character.id)
			) {
				bestBySignature.set(signature, mod);
			}
		}
		modsBySlot[slot] = Array.from(bestBySignature.values()).sort(
			modSort(character),
		);
	}
}

function getMaximumOptionalSetValues(
	composition: ModsetCompositionRequirement,
	character: Character.Character,
	target: OptimizationPlan,
) {
	const compositionSlots = composition.reduce(
		(total, modCount) => total + modCount,
		0,
	);
	const remainingSlots = 6 - compositionSlots;
	return Float64Array.from(
		target.targetStats.map((targetStat) => {
			const maximumValues = new Array<number>(remainingSlots + 1).fill(0);
			for (let slots = 1; slots <= remainingSlots; slots++) {
				for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
					if (composition[setIndex] > 0) continue;
					const setName = modsetNames[setIndex];
					if (
						affectedOptimizableStatsBySet[setName].some(
							(stat) => target[stat] !== undefined && target[stat] !== 0,
						)
					) {
						continue;
					}
					const requiredSlots = requiredModsOfModsets[setIndex];
					if (requiredSlots > slots) continue;
					const setValue = Math.max(
						getStatsValueForTargetStat(
							cache.modsetStats(setName, "full", character),
							targetStat.stat,
						),
						0,
					);
					maximumValues[slots] = Math.max(
						maximumValues[slots],
						maximumValues[slots - requiredSlots] + setValue,
					);
				}
			}
			return maximumValues[remainingSlots];
		}),
	);
}

function canCompositionReachTargetStats(
	composition: ModsetCompositionRequirement,
	modsBySlot: Record<ModTypes.GIMOSlots, Mod[]>,
	character: Character.Character,
	target: OptimizationPlan,
) {
	const maximumOptionalSetValues = getMaximumOptionalSetValues(
		composition,
		character,
		target,
	);
	const fixedSetValues = target.targetStats.map((targetStat) => {
		let value = 0;
		for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
			const modCount = composition[setIndex];
			if (modCount === 0) continue;
			value +=
				getStatsValueForTargetStat(
					cache.modsetStats(modsetNames[setIndex], "full", character),
					targetStat.stat,
				) *
				(modCount / requiredModsOfModsets[setIndex]);
		}
		return value;
	});

	for (
		let targetStatIndex = 0;
		targetStatIndex < target.targetStats.length;
		targetStatIndex++
	) {
		const targetStat = target.targetStats[targetStatIndex];
		const [minimum, maximum] = getTargetStatBounds(targetStat, character);
		let minimumModsValue = 0;
		let maximumModsValue = 0;

		for (const slot of gimoSlots) {
			const values = modsBySlot[slot].map((mod) =>
				getStatsValueForTargetStat(cache.modStats.get(mod), targetStat.stat),
			);
			if (values.length === 0) return false;
			minimumModsValue += Math.min(...values);
			maximumModsValue += Math.max(...values);
		}

		if (
			maximumModsValue +
				fixedSetValues[targetStatIndex] +
				maximumOptionalSetValues[targetStatIndex] <
				minimum ||
			minimumModsValue + fixedSetValues[targetStatIndex] > maximum
		) {
			return false;
		}
	}

	return true;
}

function getModsetValuesForCounts(
	counts: Uint8Array,
	character: Character.Character,
	target: OptimizationPlan,
) {
	const values = {} as Record<TargetStatsNames, number>;
	for (const targetStat of target.targetStats) {
		let value = 0;
		for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
			const completedSets = Math.floor(
				counts[setIndex] / requiredModsOfModsets[setIndex],
			);
			if (completedSets === 0) continue;
			value +=
				getStatsValueForTargetStat(
					cache.modsetStats(modsetNames[setIndex], "full", character),
					targetStat.stat,
				) * completedSets;
		}
		values[targetStat.stat] = value;
	}
	return values;
}

function findBestLoadoutFulfillingTargetStats(
	mods: Mod[],
	character: Character.Character,
	characterCount: number,
	characterIndex: number,
	target: OptimizationPlan,
) {
	let bestLoadoutAndMessages: LoadoutAndMessages = {
		id: "",
		loadout: [],
		messages: [],
		score: 0,
	};
	const setRestrictions = target.setRestrictions;
	const compositions = buildModsetCompositionsRequirements(
		setRestrictions,
		target,
	);

	const baseModsBySlot = getBaseModsBySlot(character, target, mods);
	const scoredSetNames = getScoredSetNames(target);
	const scoredSets = new Set(
		scoredSetNames.map((setName) => modsetIndexByName[setName]),
	);

	const targetStatCount = target.targetStats.length;

	let bestScore = Number.NEGATIVE_INFINITY;
	progressMessage(
		character.id,
		characterCount,
		characterIndex,
		compositions.length,
		0,
		"",
		1,
		0,
		"Finding target-stat loadouts",
		0,
	);

	for (const composition of compositions) {
		if (
			!canCompositionReachTargetStats(
				composition,
				baseModsBySlot,
				character,
				target,
			)
		) {
			continue;
		}
		const compositionIndex = compositions.indexOf(composition);

		for (const distribution of generateModsetDistributions(
			composition,
			baseModsBySlot,
			scoredSetNames,
			character,
			target,
		)) {
			const modsBySlot: Record<ModTypes.GIMOSlots, Mod[]> = {
				square: [],
				arrow: [],
				diamond: [],
				triangle: [],
				circle: [],
				cross: [],
			};
			let hasEmptySlot = false;
			for (let slotIndex = 0; slotIndex < gimoSlots.length; slotIndex++) {
				const slot = gimoSlots[slotIndex];
				const assignedSet = distribution[slotIndex];
				modsBySlot[slot] = baseModsBySlot[slot].filter((mod) =>
					assignedSet === null
						? !scoredSets.has(modsetIndexByName[mod.modset.name])
						: mod.modset.name === assignedSet,
				);
				if (modsBySlot[slot].length === 0) {
					hasEmptySlot = true;
					break;
				}
			}
			if (hasEmptySlot) continue;

			pruneModsByTargetStats(modsBySlot, character, target, composition);
			pruneModsCrossTargetStats(modsBySlot, character, target, composition);
			deduplicateEquivalentModsBySlot(modsBySlot, character, target);
			if (gimoSlots.some((slot) => modsBySlot[slot].length === 0)) continue;

			const modTargetValues = new Map<string, Float64Array>();
			for (const slot of gimoSlots) {
				for (const mod of modsBySlot[slot]) {
					modTargetValues.set(
						mod.id,
						Float64Array.from(
							target.targetStats.map((targetStat) =>
								getStatsValueForTargetStat(
									cache.modStats.get(mod),
									targetStat.stat,
								),
							),
						),
					);
				}
			}

			const suffixMinimums = target.targetStats.map((_, targetStatIndex) =>
				gimoSlots.map((slot) => {
					const values = new Float64Array(modsBySlot[slot].length + 1);
					values[values.length - 1] = Number.POSITIVE_INFINITY;
					for (let index = values.length - 2; index >= 0; index--) {
						values[index] = Math.min(
							modTargetValues.get(modsBySlot[slot][index].id)?.[
								targetStatIndex
							] ?? 0,
							values[index + 1],
						);
					}
					return values;
				}),
			);
			const suffixMaximums = target.targetStats.map((_, targetStatIndex) =>
				gimoSlots.map((slot) => {
					const values = new Float64Array(modsBySlot[slot].length + 1);
					values[values.length - 1] = Number.NEGATIVE_INFINITY;
					for (let index = values.length - 2; index >= 0; index--) {
						values[index] = Math.max(
							modTargetValues.get(modsBySlot[slot][index].id)?.[
								targetStatIndex
							] ?? 0,
							values[index + 1],
						);
					}
					return values;
				}),
			);

			const fixedCompositionSetValues = compositions.map((composition) =>
				Float64Array.from(
					target.targetStats.map((targetStat) => {
						let value = 0;
						for (let setIndex = 0; setIndex < modsetNames.length; setIndex++) {
							const modCount = composition[setIndex];
							if (modCount === 0) continue;
							value +=
								getStatsValueForTargetStat(
									cache.modsetStats(modsetNames[setIndex], "full", character),
									targetStat.stat,
								) *
								(modCount / requiredModsOfModsets[setIndex]);
						}
						return value;
					}),
				),
			);
			const maximumOptionalSetValues = compositions.map((composition) =>
				getMaximumOptionalSetValues(composition, character, target),
			);
			const canDescendantReachTarget = (
				node: TargetStatHeapNode,
				compositionIndex: number,
			) => {
				const fixedSetValues = fixedCompositionSetValues[compositionIndex];
				const optionalSetValues = maximumOptionalSetValues[compositionIndex];

				for (
					let targetStatIndex = 0;
					targetStatIndex < targetStatCount;
					targetStatIndex++
				) {
					const [minimum, maximum] = getTargetStatBounds(
						target.targetStats[targetStatIndex],
						character,
					);
					let minimumModsValue = 0;
					let maximumModsValue = 0;
					for (let slotIndex = 0; slotIndex < gimoSlots.length; slotIndex++) {
						minimumModsValue +=
							suffixMinimums[targetStatIndex][slotIndex][
								node.indices[slotIndex]
							];
						maximumModsValue +=
							suffixMaximums[targetStatIndex][slotIndex][
								node.indices[slotIndex]
							];
					}
					if (
						maximumModsValue +
							fixedSetValues[targetStatIndex] +
							optionalSetValues[targetStatIndex] <
							minimum ||
						minimumModsValue + fixedSetValues[targetStatIndex] > maximum
					) {
						return false;
					}
				}
				return true;
			};

			const getInitialNode = (): TargetStatHeapNode => {
				const indices = new Uint16Array(gimoSlots.length);
				const counts = new Uint8Array(modsetNames.length);
				const targetValues = new Float64Array(targetStatCount);
				let modScore = 0;
				for (let slotIndex = 0; slotIndex < gimoSlots.length; slotIndex++) {
					const mod = modsBySlot[gimoSlots[slotIndex]][0];
					modScore += cache.modScores.get(mod).score;
					counts[modsetIndexByName[mod.modset.name]]++;
					const values = modTargetValues.get(mod.id);
					if (values) {
						for (
							let targetStatIndex = 0;
							targetStatIndex < targetStatCount;
							targetStatIndex++
						) {
							targetValues[targetStatIndex] += values[targetStatIndex];
						}
					}
				}
				return { indices, counts, targetValues, modScore };
			};

			const heap = createMaxHeap<TargetStatHeapNode>(
				(left, right) => left.modScore - right.modScore,
			);
			const visited = new Set<string>();
			const initialNode = getInitialNode();
			const fixedSetScore = getCompositionSetScore(composition, target);
			const fractionalScoreUpperBound = getCompositionFractionalScoreUpperBound(
				composition,
				modsBySlot,
				target,
			);
			if (!canDescendantReachTarget(initialNode, compositionIndex)) continue;
			heap.push(initialNode);
			visited.add(initialNode.indices.join(","));
			const modsetValuesCache = new Map<
				string,
				Record<TargetStatsNames, number>
			>();

			while (heap.size > 0) {
				const node = heap.pop();
				if (!node) break;
				if (
					bestScore !== Number.NEGATIVE_INFINITY &&
					node.modScore + fixedSetScore + fractionalScoreUpperBound <= bestScore
				)
					break;

				const loadout = gimoSlots.map(
					(slot, slotIndex) => modsBySlot[slot][node.indices[slotIndex]],
				);
				const countsKey = node.counts.join(",");
				let statValuesOfModsets = modsetValuesCache.get(countsKey);
				if (statValuesOfModsets === undefined) {
					statValuesOfModsets = getModsetValuesForCounts(
						node.counts,
						character,
						target,
					);
					modsetValuesCache.set(countsKey, statValuesOfModsets);
				}
				if (
					loadoutFulfillsTargetStatRestriction(
						loadout,
						character,
						target,
						statValuesOfModsets,
					)
				) {
					const score = getLoadoutScore(loadout, target);
					let isBestScoreBeaten = false;
					if (score > bestScore) {
						isBestScoreBeaten = true;
					} else if (score === bestScore) {
						const unmovedMods = loadout.filter(
							(mod) => mod.characterID === character.id,
						).length;
						const bestUnmovedMods = bestLoadoutAndMessages.loadout.filter(
							(mod) => mod.characterID === character.id,
						).length;
						if (
							unmovedMods > bestUnmovedMods ||
							(unmovedMods === bestUnmovedMods &&
								loadout.length > bestLoadoutAndMessages.loadout.length)
						) {
							isBestScoreBeaten = true;
						}
					}
					if (isBestScoreBeaten) {
						bestScore = score;
						bestLoadoutAndMessages = {
							id: generateLoadoutId(loadout),
							loadout,
							messages: [],
							score,
						};
					}
				}

				for (let slotIndex = 0; slotIndex < gimoSlots.length; slotIndex++) {
					const slot = gimoSlots[slotIndex];
					const nextIndex = node.indices[slotIndex] + 1;
					if (nextIndex >= modsBySlot[slot].length) continue;
					const childIndices = node.indices.slice();
					childIndices[slotIndex] = nextIndex;
					const key = childIndices.join(",");
					if (visited.has(key)) continue;
					visited.add(key);
					const oldMod = modsBySlot[slot][node.indices[slotIndex]];
					const newMod = modsBySlot[slot][nextIndex];
					const childCounts = node.counts.slice();
					childCounts[modsetIndexByName[oldMod.modset.name]]--;
					childCounts[modsetIndexByName[newMod.modset.name]]++;
					const childTargetValues = node.targetValues.slice();
					const oldTargetValues = modTargetValues.get(oldMod.id);
					const newTargetValues = modTargetValues.get(newMod.id);
					if (oldTargetValues && newTargetValues) {
						for (
							let targetStatIndex = 0;
							targetStatIndex < targetStatCount;
							targetStatIndex++
						) {
							childTargetValues[targetStatIndex] +=
								newTargetValues[targetStatIndex] -
								oldTargetValues[targetStatIndex];
						}
					}
					const childNode: TargetStatHeapNode = {
						indices: childIndices,
						counts: childCounts,
						targetValues: childTargetValues,
						modScore:
							node.modScore +
							cache.modScores.get(newMod).score -
							cache.modScores.get(oldMod).score,
					};
					if (!canDescendantReachTarget(childNode, compositionIndex)) continue;
					heap.push(childNode);
				}
			}
		}
	}

	return bestLoadoutAndMessages;
}

function getBaseModsBySlot(
	character: Character.Character,
	target: OptimizationPlan,
	mods: Mod[],
) {
	const setRestrictions = target.setRestrictions;
	const setNames = getSetRestrictionsNames(setRestrictions);
	addPossibleSetRestrictionsNames(setNames, getOpenModSlots(setRestrictions));
	for (const [setName, count] of Object.entries(
		setRestrictions,
	) as SetRestrictionsEntries) {
		if (count === -1) setNames.delete(setName);
	}

	modFilters.target = target;
	modFilters.openModSlots = getOpenModSlots(setRestrictions);
	modFilters.setNames = setNames;
	const baseModsBySlot = filterMods(
		mods
			.filter(
				combineModFilters([
					(mod) => mod.level === 15,
					modFilters.hasMinimumDots,
					modFilters.hasRestrictedPrimaryStat,
					modFilters.hasSet,
					character.playerValues.gearLevel < 12
						? modFilters.no6Dot
						: modFilters.noFilter,
				]),
			)
			.slice(),
	);
	for (const slot of gimoSlots) baseModsBySlot[slot].sort(modSort(character));

	return baseModsBySlot;
}

function getScoredSetNames(target: OptimizationPlan) {
	const setRestrictions = target.setRestrictions;
	return Object.values(setBonuses)
		.filter(
			(setBonus) =>
				setRestrictions[setBonus.name] !== -1 &&
				affectedOptimizableStatsBySet[setBonus.name].some(
					(stat) => target[stat] !== undefined && target[stat] !== 0,
				),
		)
		.map((setBonus) => setBonus.name);
}

function generateLoadoutId(loadout: Mod[]) {
	return loadout.map((mod) => mod.id).join("-");
}

// Hybrid filter: bucket by slot once, then per-slot early-exit filters
function filterMods(mods: Mod[]) {
	const bySlot: Record<ModTypes.GIMOSlots, Mod[]> = {
		square: [],
		arrow: [],
		diamond: [],
		triangle: [],
		circle: [],
		cross: [],
	};
	for (const mod of mods) bySlot[mod.slot].push(mod);
	return bySlot;
}

/**
 * Given a sorted array of mods, return either the first mod (if it has a non-negative score) or null. This allows
 * for empty slots on characters where the mods might be better used elsewhere.
 * @param candidates Array[Mod]
 * @returns Mod
 */
const topMod = (candidates: Mod[]) => {
	const mod: Mod | null = firstOrNull(candidates);
	if (mod && (cache.modScores.get(mod)?.score ?? 0) >= 0) {
		return mod;
	}
	return null;
};

function getSetsBySlot(
	squares: Mod[],
	arrows: Mod[],
	diamonds: Mod[],
	triangles: Mod[],
	circles: Mod[],
	crosses: Mod[],
): Record<ModTypes.GIMOSlots, Set<GIMOSetStatNames>> {
	const squareSets = new Set<GIMOSetStatNames>();
	const arrowSets = new Set<GIMOSetStatNames>();
	const diamondSets = new Set<GIMOSetStatNames>();
	const triangleSets = new Set<GIMOSetStatNames>();
	const circleSets = new Set<GIMOSetStatNames>();
	const crossSets = new Set<GIMOSetStatNames>();

	for (const mod of squares) {
		squareSets.add(mod.modset.name);
	}
	for (const mod of arrows) {
		arrowSets.add(mod.modset.name);
	}
	for (const mod of diamonds) {
		diamondSets.add(mod.modset.name);
	}
	for (const mod of triangles) {
		triangleSets.add(mod.modset.name);
	}
	for (const mod of circles) {
		circleSets.add(mod.modset.name);
	}
	for (const mod of crosses) {
		crossSets.add(mod.modset.name);
	}
	return {
		square: squareSets,
		arrow: arrowSets,
		diamond: diamondSets,
		triangle: triangleSets,
		circle: circleSets,
		cross: crossSets,
	};
}

function narrowToAvailableSets(
	setsToUse: SetRestrictions,
	useOnlyFullSets: boolean,
	squares: Mod[],
	arrows: Mod[],
	diamonds: Mod[],
	triangles: Mod[],
	circles: Mod[],
	crosses: Mod[],
): {
	canFulfillSetRestrictions: boolean;
	availableSetsToUse: SetRestrictions;
	squares: Mod[];
	arrows: Mod[];
	diamonds: Mod[];
	triangles: Mod[];
	circles: Mod[];
	crosses: Mod[];
	failedSet: string;
} {
	const setsBySlot = getSetsBySlot(
		squares,
		arrows,
		diamonds,
		triangles,
		circles,
		crosses,
	);

	// Track current assignment per slot (if a slot is forced to a single set)
	const assignedSetBySlot: Partial<
		Record<ModTypes.GIMOSlots, GIMOSetStatNames>
	> = {};

	// Compute required slots per set from setsToUse (ignore -1 which means avoid)
	const requiredSlotsBySet = new Map<GIMOSetStatNames, number>();
	for (const [setName, count] of Object.entries(
		setsToUse,
	) as SetRestrictionsEntries) {
		if ((count ?? 0) > 0) {
			const need = (setBonuses[setName].numberOfModsRequired * count) as number;
			requiredSlotsBySet.set(setName, need);
		}
	}

	// Helper to count how many slots currently allow a given set, and how many are already assigned to it

	const countAvailability = (setName: GIMOSetStatNames) => {
		let possible = 0;
		let assigned = 0;
		for (const slot of gimoSlots) {
			if (setsBySlot[slot].has(setName)) {
				possible++;
				if (assignedSetBySlot[slot] === setName) assigned++;
			}
		}
		return { possible, assigned };
	};

	// Initialize assignments for slots that already have only one possible set
	for (const slot of gimoSlots) {
		const allowed = setsBySlot[slot];
		if (allowed.size === 1) {
			const only = allowed.values().next().value as GIMOSetStatNames;
			assignedSetBySlot[slot] = only;
		}
	}

	// Constraint propagation loop
	let changed = true;
	while (changed) {
		changed = false;
		// For each required set, ensure feasibility and propagate forced assignments
		for (const [setName, requiredSlots] of requiredSlotsBySet.entries()) {
			// Quick feasibility check
			const { possible, assigned } = countAvailability(setName);
			if (possible < requiredSlots) {
				return {
					canFulfillSetRestrictions: false,
					availableSetsToUse: {},
					squares,
					arrows,
					diamonds,
					triangles,
					circles,
					crosses,
					failedSet: setName,
				};
			}
			const remaining = requiredSlots - assigned;
			if (remaining <= 0) continue;

			// Determine variable slots that can still take this set
			const variableSlots: ModTypes.GIMOSlots[] = [];
			for (const slot of gimoSlots) {
				if (assignedSetBySlot[slot]) continue;
				if (setsBySlot[slot].has(setName)) variableSlots.push(slot);
			}

			if (variableSlots.length < remaining) {
				return {
					canFulfillSetRestrictions: false,
					availableSetsToUse: {},
					squares,
					arrows,
					diamonds,
					triangles,
					circles,
					crosses,
					failedSet: setName,
				};
			}

			// If exactly the remaining number of variable slots can host this set, they must be this set
			if (variableSlots.length === remaining) {
				for (const slot of variableSlots) {
					if (!assignedSetBySlot[slot]) {
						assignedSetBySlot[slot] = setName;
						setsBySlot[slot].clear();
						setsBySlot[slot].add(setName);
						changed = true;
					}
				}
			}
		}

		// Any slots that now have a single allowed set become assigned
		for (const slot of gimoSlots) {
			if (!assignedSetBySlot[slot] && setsBySlot[slot].size === 1) {
				const only = setsBySlot[slot].values().next().value as GIMOSetStatNames;
				assignedSetBySlot[slot] = only;
				// already single; keep as-is
				changed = true;
			}
		}
	}

	if (useOnlyFullSets) {
		/*
		// Enforce that any partial assignments can be completed and prune/early-exit accordingly
		const getVariableSlotsForSet = (
			setName: GIMOSetStatNames,
		): ModTypes.GIMOSlots[] => {
			const vars: ModTypes.GIMOSlots[] = [];
			for (const slot of gimoSlots) {
				if (!assignedSetBySlot[slot] && setsBySlot[slot].has(setName))
					vars.push(slot);
			}
			return vars;
		};

		// 1) Force-complete any partial set that has exactly as many variable slots as needed.
		let ufChanged = true;
		while (ufChanged) {
			ufChanged = false;
			for (const setName of Object.keys(setBonuses) as GIMOSetStatNames[]) {
				const size = setBonuses[setName].numberOfModsRequired as number;
				let assignedCount = 0;
				for (const slot of gimoSlots)
					if (assignedSetBySlot[slot] === setName) assignedCount++;
				const remainder = assignedCount % size;
				const need = remainder === 0 ? 0 : size - remainder; // mods needed to complete next full set
				if (need === 0) continue;
				const varSlots = getVariableSlotsForSet(setName);
				if (varSlots.length < need) {
					return {
						canFulfillSetRestrictions: false,
						availableSetsToUse: {},
						squares,
						arrows,
						diamonds,
						triangles,
						circles,
						crosses,
					};
				}
				if (varSlots.length === need) {
					// These slots must be this set to satisfy full-set-only constraint
					for (const slot of varSlots) {
						assignedSetBySlot[slot] = setName;
						setsBySlot[slot].clear();
						setsBySlot[slot].add(setName);
					}
					ufChanged = true;
				}
			}
		}

		// 2) Global feasibility: remaining unassigned slots must be fillable by whole sets (2/4 mods)
		let unassignedSlots = 0;
		for (const slot of gimoSlots)
			if (!assignedSetBySlot[slot]) unassignedSlots++;

		let sumNeed = 0; // minimal slots that must be reserved to complete existing partials
		let cap2 = 0; // upper bound of additional 2-piece sets we could form
		let cap4 = 0; // upper bound of additional 4-piece sets we could form
		for (const setName of Object.keys(setBonuses) as GIMOSetStatNames[]) {
			const size = setBonuses[setName].numberOfModsRequired as number;
			let assignedCount = 0;
			for (const slot of gimoSlots)
				if (assignedSetBySlot[slot] === setName) assignedCount++;
			const varSlots = getVariableSlotsForSet(setName);
			const remainder = assignedCount % size;
			const need = remainder === 0 ? 0 : size - remainder;
			if (need > varSlots.length) {
				return {
					canFulfillSetRestrictions: false,
					availableSetsToUse: {},
					squares,
					arrows,
					diamonds,
					triangles,
					circles,
					crosses,
				};
			}
			sumNeed += need;
			const leftover = varSlots.length - need;
			if (size === 2) cap2 += Math.floor(leftover / 2);
			else if (size === 4) cap4 += Math.floor(leftover / 4);
		}

		const L = unassignedSlots - sumNeed;
		if (L < 0) {
			return {
				canFulfillSetRestrictions: false,
				availableSetsToUse: {},
				squares,
				arrows,
				diamonds,
				triangles,
				circles,
				crosses,
			};
		}

		let canFillRemainder = false;
		for (let a = 0; a <= Math.min(cap4, Math.floor(L / 4)); a++) {
			const rem = L - 4 * a;
			if (rem % 2 === 0 && rem / 2 <= cap2) {
				canFillRemainder = true;
				break;
			}
		}
		if (!canFillRemainder) {
			return {
				canFulfillSetRestrictions: false,
				availableSetsToUse: {},
				squares,
				arrows,
				diamonds,
				triangles,
				circles,
				crosses,
			};
		}

		// 3) Light pruning: if a set cannot possibly form a new full set from scratch, drop it where there are other options
		for (const setName of Object.keys(setBonuses) as GIMOSetStatNames[]) {
			const size = setBonuses[setName].numberOfModsRequired as number;
			let assignedCount = 0;
			for (const slot of gimoSlots)
				if (assignedSetBySlot[slot] === setName) assignedCount++;
			const remainder = assignedCount % size;
			if (remainder !== 0) continue; // don't prune if it might help complete an existing partial
			const varSlots = getVariableSlotsForSet(setName);
			if (varSlots.length < size) {
				for (const slot of varSlots) {
					if (setsBySlot[slot].size > 1) {
						setsBySlot[slot].delete(setName);
					}
				}
			}
		}
*/
	}

	// Build updated availableSetsToUse: start from original and bump counts if assignments complete extra full sets
	const availableSetsToUse: SetRestrictions = {
		...(setsToUse as Record<string, number>),
	} as SetRestrictions;
	for (const setName of Object.keys(setBonuses) as GIMOSetStatNames[]) {
		// Count assigned slots for this set
		let assigned = 0;
		for (const slot of gimoSlots) {
			if (assignedSetBySlot[slot] === setName) assigned++;
		}
		if (assigned > 0) {
			const fullSets = Math.floor(
				assigned / setBonuses[setName].numberOfModsRequired,
			);
			if (fullSets > 0) {
				const current = availableSetsToUse[setName] ?? 0;
				if (fullSets > current) availableSetsToUse[setName] = fullSets;
			}
		}
	}

	// Finally, filter each slot's mods list to include only those from currently allowed sets
	const filterByAllowed = (mods: Mod[], slot: ModTypes.GIMOSlots) => {
		const allowed = setsBySlot[slot];
		if (allowed.size === 0) return [];
		if (allowed.size === 8) return mods;
		let w = 0;
		for (let r = 0; r < mods.length; r++) {
			if (allowed.has(mods[r].modset.name)) mods[w++] = mods[r];
		}
		if (w < mods.length) mods.length = w;
		return mods;
	};

	const filteredSquares = filterByAllowed(squares, "square");
	const filteredArrows = filterByAllowed(arrows, "arrow");
	const filteredDiamonds = filterByAllowed(diamonds, "diamond");
	const filteredTriangles = filterByAllowed(triangles, "triangle");
	const filteredCircles = filterByAllowed(circles, "circle");
	const filteredCrosses = filterByAllowed(crosses, "cross");

	return {
		canFulfillSetRestrictions: true,
		availableSetsToUse,
		squares: filteredSquares,
		arrows: filteredArrows,
		diamonds: filteredDiamonds,
		triangles: filteredTriangles,
		circles: filteredCircles,
		crosses: filteredCrosses,
		failedSet: "",
	};
}

/**
 * Find the best configuration of mods from a set of usable mods
 * @param usableMods {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @param setsToUse {Object<String, Number>} The sets to use for this mod set. This function will return null if
 *   these sets can't be used.
 * @returns {{messages: Array<String>, loadout: Array<Mod>}}
 */
const findBestLoadoutWithoutChangingRestrictions = (
	usableMods: Mod[],
	character: Character.Character,
	target: OptimizationPlan,
	setsToUse: SetRestrictions,
) => {
	const potentialUsedSets = new Set<SetBonus>();
	const baseSets: Partial<Record<GIMOSetStatNames, ModBySlot>> = {};
	const messages: string[] = [];
	let squares: Mod[] = [];
	let arrows: Mod[] = [];
	let diamonds: Mod[] = [];
	let triangles: Mod[] = [];
	let circles: Mod[] = [];
	let crosses: Mod[] = [];
	let setlessMods: NullablePartialModBySlot;
	let availableSetsToUse: SetRestrictions = {};
	let canFulfillSetRestrictions = true;
	let failedSet = "";

	// Sort all the mods by score, then break them into sets.
	// For each slot, try to use the most restrictions possible from what has been set for that character
	usableMods.sort(modSort(character));

	({
		square: squares,
		arrow: arrows,
		diamond: diamonds,
		triangle: triangles,
		circle: circles,
		cross: crosses,
	} = filterMods(usableMods));

	if (
		squares.length === 1 &&
		arrows.length === 1 &&
		diamonds.length === 1 &&
		triangles.length === 1 &&
		circles.length === 1 &&
		crosses.length === 1
	) {
		const loadout = [
			squares[0],
			arrows[0],
			diamonds[0],
			triangles[0],
			circles[0],
			crosses[0],
		];
		if (loadoutFulfillsSetRestriction(loadout, setsToUse)) {
			const loadoutId = generateLoadoutId(loadout);
			return {
				id: loadoutId,
				loadout: loadout,
				messages: messages,
				score: getLoadoutScore(loadout, target),
			};
		}
		return { id: "", loadout: [], messages: [] as string[], score: 0 };
	}

	({
		canFulfillSetRestrictions,
		availableSetsToUse,
		squares,
		arrows,
		diamonds,
		triangles,
		circles,
		crosses,
		failedSet,
	} = narrowToAvailableSets(
		setsToUse,
		target.useOnlyFullSets,
		squares,
		arrows,
		diamonds,
		triangles,
		circles,
		crosses,
	));
	if (!canFulfillSetRestrictions) {
		return {
			loadout: [],
			id: "",
			messages: [`Failed to fulfill set restrictions for ${failedSet}`],
			score: 0,
		};
	}
	// Use refined set restrictions going forward
	const effectiveSetsToUse = availableSetsToUse;
	const usedSets = getSetRestrictionsNames(effectiveSetsToUse);
	const openModSlots = getOpenModSlots(effectiveSetsToUse);

	if (0 === openModSlots) {
		// If sets are 100% deterministic, make potentialUsedSets only them
		for (const setName of usedSets) {
			const setBonus = setBonuses[setName];
			potentialUsedSets.add(setBonus);
		}
		setlessMods = null;
	} else if (target.useOnlyFullSets) {
		// If we're only allowed to use full sets, then add every set to potentialUsedSets, but leave setlessMods null
		let setName: GIMOSetStatNames;
		for (setName in setBonuses) {
			const setBonus = setBonuses[setName];
			if (
				setBonus.numberOfModsRequired <= openModSlots &&
				(availableSetsToUse[setName] ?? 0) !== -1
			) {
				potentialUsedSets.add(setBonus);
			}
		}
		setlessMods = null;
	} else {
		// Otherwise, use any allowed set that fits into the remaining slots.
		// Even zero-value sets can unlock better full-loadout combinations than the single
		// setless representative for a slot would expose.
		for (const setBonus of Object.values(setBonuses)) {
			if (
				setBonus.numberOfModsRequired <= openModSlots &&
				(availableSetsToUse[setBonus.name] ?? 0) !== -1
			) {
				potentialUsedSets.add(setBonus);
			}
		}

		// Still make sure that any chosen sets are in the potential used sets
		for (const setName of usedSets) {
			potentialUsedSets.add(setBonuses[setName]);
		}

		// Start with the highest-value mod in each slot. If the highest-value mod has a negative value,
		// leave the slot empty
		setlessMods = {
			square: topMod(squares),
			arrow: topMod(arrows),
			diamond: topMod(diamonds),
			triangle: topMod(triangles),
			circle: topMod(circles),
			cross: topMod(crosses),
		};
	}

	// Go through each set bonus with a positive value, and find the best mod sub-sets
	for (const setBonus of potentialUsedSets) {
		baseSets[setBonus.name] = {
			square: firstOrNull(
				squares.filter((mod) => setBonus.name === mod.modset.name),
			),
			arrow: firstOrNull(
				arrows.filter((mod) => setBonus.name === mod.modset.name),
			),
			diamond: firstOrNull(
				diamonds.filter((mod) => setBonus.name === mod.modset.name),
			),
			triangle: firstOrNull(
				triangles.filter((mod) => setBonus.name === mod.modset.name),
			),
			circle: firstOrNull(
				circles.filter((mod) => setBonus.name === mod.modset.name),
			),
			cross: firstOrNull(
				crosses.filter((mod) => setBonus.name === mod.modset.name),
			),
		};
	}

	// Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set formed
	// without taking sets into account
	const candidateLoadouts = getCandidateLoadoutsGenerator(
		potentialUsedSets,
		baseSets,
		setlessMods,
		effectiveSetsToUse,
	);

	let bestLoadout: Mod[] = [];
	let bestLoadoutScore = Number.NEGATIVE_INFINITY;
	let bestUnmovedMods = -1;

	for (const loadout of candidateLoadouts) {
		const loadoutScore = getLoadoutScore(loadout, target);
		if (loadoutScore > bestLoadoutScore) {
			bestLoadout = loadout;
			bestLoadoutScore = loadoutScore;
			bestUnmovedMods = -1;
		} else if (loadoutScore === bestLoadoutScore) {
			// If both sets have the same value, choose the set that moves the fewest mods
			const unmovedMods = loadout.filter(
				(mod) => mod.characterID === character.id,
			).length;
			if (bestUnmovedMods === -1) {
				bestUnmovedMods = bestLoadout.filter(
					(mod) => mod.characterID === character.id,
				).length;
			}

			if (unmovedMods > bestUnmovedMods) {
				bestLoadout = loadout;
				bestLoadoutScore = loadoutScore;
				bestUnmovedMods = unmovedMods;
			} else if (
				unmovedMods === bestUnmovedMods &&
				loadout.length > bestLoadout.length
			) {
				// If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
				bestLoadout = loadout;
				bestLoadoutScore = loadoutScore;
				bestUnmovedMods = unmovedMods;
			}
		}
	}

	return {
		id: generateLoadoutId(bestLoadout),
		loadout: bestLoadout,
		messages: messages,
		score: bestLoadoutScore,
	};
};

/**
 * Find all the potential combinations of mods to consider by taking into account mod sets and keeping set bonuses
 *
 * @param potentialUsedSets {Set<SetBonus>} The SetBonuses that have sets provided for use
 * @param baseSets {Object<String, Object<String, Mod>>} The best mods available for each SetBonus in potentialUsedSets
 * @param setlessMods {Object<string, Mod>} The best raw mod for each slot, regardless of set
 * @param setsToUse {Object<String, Number>} The sets to fulfill for every candidate set
 * @return {Array<Array<Mod>>}
 */
function* getCandidateLoadoutsGenerator(
	potentialUsedSets: Set<SetBonus>,
	baseSets: Partial<Record<GIMOSetStatNames, ModBySlot>>,
	setlessMods: NullablePartialModBySlot,
	setsToUse: SetRestrictions,
): Generator<Mod[]> {
	/**
	 * Possible sets:
	 *
	 * base set
	 *
	 * 4-mod sets
	 * Set(4) + base set
	 * Set(4) + Set(2)
	 *
	 * 2-mod sets
	 * Set(2) + base set
	 * Set(2 * 2) + base set
	 * Set(2 * 3)
	 * Set(2) + Set(2) + base set
	 * Set(2 * 2) + Set(2)
	 * Set(2) + Set(2) + Set(2)
	 */
	const potentialSetsArray = Array.from(potentialUsedSets.values());
	const fourModSets = potentialSetsArray
		.filter((modset) => 4 === modset.numberOfModsRequired)
		.map((set) => set.name);
	const twoModSets = potentialSetsArray
		.filter((modset) => 2 === modset.numberOfModsRequired)
		.map((set) => set.name);
	const forcedSets: {
		4: GIMOSetStatNames[];
		2: GIMOSetStatNames[];
	} = { 4: [], 2: [] };
	let setName: GIMOSetStatNames;
	for (setName in setsToUse) {
		const count = setsToUse[setName];
		if (count !== undefined) {
			for (let i = 0; i < count; i++) {
				forcedSets[setBonuses[setName].numberOfModsRequired].push(setName);
			}
		}
	}
	Object.freeze(forcedSets);

	// (previous setObjectToArray removed in favor of an allocation-light emitter below)

	// Allocation-light emitters: inline the combination building to avoid inner generator overhead
	const slotIndex: Record<ModTypes.GIMOSlots, number> = {
		square: 0,
		arrow: 1,
		diamond: 2,
		triangle: 3,
		circle: 4,
		cross: 5,
	};
	const scratch: (Mod | null)[] = [null, null, null, null, null, null];

	function nonNullCount(
		map: NullablePartialModBySlot | null | undefined,
	): number {
		if (!map) return 0;
		let c = 0;
		for (const slot of gimoSlots) {
			const m = map[slot];
			if (m !== null && m !== undefined) c++;
		}
		return c;
	}

	function emitFromScratch() {
		const out: Mod[] = [];
		// Convert scratch to compact Mod[] in gimoSlots order
		for (let i = 0; i < 6; i++) {
			const m = scratch[i];
			if (m) out.push(m);
		}
		return out;
	}

	function* yieldTwoSets(
		firstSet: NullablePartialModBySlot,
		secondSet: NullablePartialModBySlot,
		allowFirstSetNulls: boolean,
		allowSecondSetNulls: boolean,
	): Generator<Mod[]> {
		if (!firstSet || !secondSet) return;
		for (const [firstSetSlots, secondSetSlots] of chooseFourOptions) {
			scratch[0] =
				scratch[1] =
				scratch[2] =
				scratch[3] =
				scratch[4] =
				scratch[5] =
					null;
			let invalid = false;
			for (const slot of firstSetSlots) {
				const mod = firstSet[slot] ?? null;
				if (!allowFirstSetNulls && mod === null) {
					invalid = true;
					break;
				}
				scratch[slotIndex[slot]] = mod;
			}
			if (invalid) continue;
			for (const slot of secondSetSlots) {
				const mod = secondSet[slot] ?? null;
				if (!allowSecondSetNulls && mod === null) {
					invalid = true;
					break;
				}
				scratch[slotIndex[slot]] = mod;
			}
			if (invalid) continue;
			yield emitFromScratch();
		}
	}

	function* safeYieldTwoSets(
		firstSet: NullablePartialModBySlot,
		secondSet: NullablePartialModBySlot,
		allowFirstSetNulls: boolean,
		allowSecondSetNulls: boolean,
	): Generator<Mod[]> {
		// Two-sets mode uses chooseFourOptions => first needs 4, second needs 2 unless nulls allowed
		if (!allowFirstSetNulls && nonNullCount(firstSet) < 4) return;
		if (!allowSecondSetNulls && nonNullCount(secondSet) < 2) return;
		yield* yieldTwoSets(
			firstSet,
			secondSet,
			allowFirstSetNulls,
			allowSecondSetNulls,
		);
	}

	function* yieldThreeSets(
		firstSet: NullablePartialModBySlot,
		secondSet: NullablePartialModBySlot,
		thirdSet: NullablePartialModBySlot,
		allowFirstSetNulls: boolean,
		allowSecondSetNulls: boolean,
	): Generator<Mod[]> {
		if (!firstSet || !secondSet || !thirdSet) return;
		for (const [
			firstSetSlots,
			secondSetSlots,
			thirdSetSlots,
		] of chooseTwoOptions) {
			scratch[0] =
				scratch[1] =
				scratch[2] =
				scratch[3] =
				scratch[4] =
				scratch[5] =
					null;
			let invalid = false;
			for (const slot of firstSetSlots) {
				const mod = firstSet[slot] ?? null;
				if (!allowFirstSetNulls && mod === null) {
					invalid = true;
					break;
				}
				scratch[slotIndex[slot]] = mod;
			}
			if (invalid) continue;
			for (const slot of secondSetSlots) {
				const mod = secondSet[slot] ?? null;
				if (!allowSecondSetNulls && mod === null) {
					invalid = true;
					break;
				}
				scratch[slotIndex[slot]] = mod;
			}
			if (invalid) continue;
			for (const slot of thirdSetSlots) {
				const mod = thirdSet[slot] ?? null;
				if (mod === null) {
					invalid = true;
					break;
				}
				scratch[slotIndex[slot]] = mod;
			}
			if (invalid) continue;
			yield emitFromScratch();
		}
	}

	function* safeYieldThreeSets(
		firstSet: NullablePartialModBySlot,
		secondSet: NullablePartialModBySlot,
		thirdSet: NullablePartialModBySlot,
		allowFirstSetNulls: boolean,
		allowSecondSetNulls: boolean,
	): Generator<Mod[]> {
		// Three-sets mode uses chooseTwoOptions => 2 each; 'third' never allows nulls in current calls
		if (!allowFirstSetNulls && nonNullCount(firstSet) < 2) return;
		if (!allowSecondSetNulls && nonNullCount(secondSet) < 2) return;
		if (nonNullCount(thirdSet) < 2) return;
		yield* yieldThreeSets(
			firstSet,
			secondSet,
			thirdSet,
			allowFirstSetNulls,
			allowSecondSetNulls,
		);
	}

	let firstSet: ModBySlot;
	let secondSet: ModBySlot;
	let thirdSet: ModBySlot;
	const emptySet: ModBySlot = {
		square: null,
		arrow: null,
		diamond: null,
		triangle: null,
		circle: null,
		cross: null,
	};

	if (forcedSets[4].length > 0) {
		firstSet = baseSets[forcedSets[4][0]] ?? emptySet;
		if (forcedSets[2].length > 0) {
			secondSet = baseSets[forcedSets[2][0]] ?? emptySet;
			yield* safeYieldTwoSets(firstSet, secondSet, false, false);
		} else {
			yield* safeYieldTwoSets(firstSet, setlessMods, false, true);
			for (const secondSetType of twoModSets) {
				secondSet = baseSets[secondSetType] ?? emptySet;
				yield* safeYieldTwoSets(firstSet, secondSet, false, false);
			}
		}
	} else if (1 === forcedSets[2].length) {
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;
		yield* safeYieldTwoSets(setlessMods, firstSet, true, false);
		for (let i = 0; i < twoModSets.length; i++) {
			secondSet = baseSets[twoModSets[i]] ?? emptySet;
			yield* safeYieldThreeSets(setlessMods, firstSet, secondSet, true, false);
			for (let j = i; j < twoModSets.length; j++) {
				thirdSet = baseSets[twoModSets[j]] ?? emptySet;
				yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
			}
		}
	} else if (2 === forcedSets[2].length) {
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;
		secondSet = baseSets[forcedSets[2][1]] ?? emptySet;
		yield* safeYieldThreeSets(setlessMods, firstSet, secondSet, true, false);
		for (const thirdSetType of twoModSets) {
			thirdSet = baseSets[thirdSetType] ?? emptySet;
			yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
		}
	} else if (3 === forcedSets[2].length) {
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;
		secondSet = baseSets[forcedSets[2][1]] ?? emptySet;
		thirdSet = baseSets[forcedSets[2][2]] ?? emptySet;
		yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
	} else {
		if (setlessMods && nonNullCount(setlessMods) > 0) {
			scratch[0] =
				scratch[1] =
				scratch[2] =
				scratch[3] =
				scratch[4] =
				scratch[5] =
					null;
			for (const slot of gimoSlots) {
				const m = setlessMods[slot];
				if (m !== null) {
					if (m !== undefined) scratch[slotIndex[slot]] = m;
				}
			}
			yield emitFromScratch();
		}
		for (const firstSetType of fourModSets) {
			const firstSet = baseSets[firstSetType] ?? null;
			yield* safeYieldTwoSets(firstSet, setlessMods, false, true);
			for (const secondSetType of twoModSets) {
				const secondSet = baseSets[secondSetType] ?? null;
				yield* safeYieldTwoSets(firstSet, secondSet, false, false);
			}
		}
		for (let i = 0; i < twoModSets.length; i++) {
			const firstSet = baseSets[twoModSets[i]] ?? null;
			yield* safeYieldTwoSets(setlessMods, firstSet, true, false);
			for (let j = i; j < twoModSets.length; j++) {
				const secondSet = baseSets[twoModSets[j]] ?? null;
				yield* safeYieldThreeSets(
					setlessMods,
					firstSet,
					secondSet,
					true,
					false,
				);
				for (let k = j; k < twoModSets.length; k++) {
					const thirdSet = baseSets[twoModSets[k]] ?? null;
					yield* safeYieldThreeSets(
						firstSet,
						secondSet,
						thirdSet,
						false,
						false,
					);
				}
			}
		}
	}
}
