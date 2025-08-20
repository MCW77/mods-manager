// Prevent React Refresh in worker context (safe narrowed globals in worker)
declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Global {
		__vite_plugin_react_preamble_installed__?: boolean;
		__REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown;
		$RefreshReg$?: () => void;
		$RefreshSig$?: <T>(type: T) => T;
		window?: Partial<Window> & {
			__registerBeforePerformReactRefresh?: () => void;
			__reactRefreshUtils?: unknown;
		};
	}
}

if (typeof globalThis !== "undefined") {
	(globalThis as Global).__vite_plugin_react_preamble_installed__ = true;
	(globalThis as Global).window = {
		__registerBeforePerformReactRefresh: () => {},
		__reactRefreshUtils: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		location: {
			reload: () => {},
			replace: () => {},
			assign: () => {},
			toString: () => "about:blank",
			href: "about:blank",
			origin: "null",
			protocol: "about:",
			host: "",
			hostname: "",
			port: "",
			pathname: "blank",
			search: "",
			hash: "",
			ancestorOrigins: {
				length: 0,
				contains: () => false,
				item: () => null,
				[Symbol.iterator]: function* () {},
			} as unknown as DOMStringList,
		} as Location,
		console: (globalThis as unknown as { console?: Console }).console || {
			log: () => {},
			warn: () => {},
			error: () => {},
		},
	} as Partial<Window>;
	(globalThis as Global).__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;
	(globalThis as Global).$RefreshReg$ = () => {};
	(globalThis as Global).$RefreshSig$ = <T>(type: T) => type;
}

// utils
import "../utils/globalLegendPersistSettings";
import * as perf from "../utils/performance";

// state
import type { ObservableObject } from "@legendapp/state";

import type { StateLoaderObservable } from "../modules/stateLoader/stateLoader";

import type { CompilationsObservable } from "#/modules/compilations/domain/CompilationsObservable";
import type { ProfilesManagementObservable } from "#/modules/profilesManagement/domain/ProfilesManagement";
import type { IncrementalOptimizationObservable } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusObservable } from "#/modules/lockedStatus/domain/LockedStatusObservable";
import type { OptimizationSettingsObservable } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";

// domain
import type { CharacterNames } from "../constants/CharacterNames";
import { gimoSlots } from "../domain/constants/ModConsts";
import type * as ModTypes from "../domain/types/ModTypes";

import type * as Character from "../domain/Character";
import { PrimaryStats, SecondaryStats, Stats } from "../domain/Stats";
import type {
	OptimizableStats,
	OptimizationPlan,
	PrimaryStatRestrictions,
} from "../domain/OptimizationPlan";
import type { SelectedCharacters } from "../domain/SelectedCharacters";
import type { SetRestrictions } from "../domain/SetRestrictions";
import type {
	TargetStat,
	TargetStats,
	TargetStatsNames,
} from "../domain/TargetStat";
import type {
	FlatCharacterModding,
	FlatCharacterModdings,
} from "../modules/compilations/domain/CharacterModdings";
import type { MissedGoals } from "../modules/compilations/domain/MissedGoals";
import type { OptimizationConditions } from "#/modules/compilations/domain/OptimizationConditions";
import type { ProfileOptimizationSettings } from "../modules/optimizationSettings/domain/ProfileOptimizationSettings";
import type { WithoutCC } from "../modules/profilesManagement/domain/CharacterStatNames";
import type {
	GIMOPrimaryStatNames,
	GIMOSecondaryStatNames,
	GIMOSetStatNames,
} from "#/domain/GIMOStatNames";

// #region types
interface Cache {
	modScores: Map<string, number>;
	modUpgrades: Map<string, Mod>;
	// Generation-tagged cache: entries valid only for current modStatsGen
	modStats: Map<string, { gen: number; value: StatValue[] }>;
	statValues: Map<string, StatValue[]>;
}

interface StatValue {
	displayType: Stats.DisplayStatNames;
	value: number;
}

interface Stat {
	displayType: Stats.DisplayStatNames;
	isPercentVersion?: boolean;
	value: number;
}

interface PrimaryStat {
	type: GIMOPrimaryStatNames;
	displayType: Stats.DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface SecondaryStat {
	type: GIMOSecondaryStatNames;
	displayType: Stats.DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface SetBonus {
	name: GIMOSetStatNames;
	numberOfModsRequired: 2 | 4;
	smallBonus: SetStat;
	maxBonus: SetStat;
}

interface SetStat {
	type: GIMOSetStatNames;
	displayType: Stats.DisplayStatNames;
	value: number;
	isPercentVersion: boolean;
}

interface Mod {
	id: string;
	slot: ModTypes.GIMOSlots;
	modset: SetBonus;
	level: number;
	pips: number;
	primaryStat: PrimaryStat;
	secondaryStats: SecondaryStat[];
	characterID: CharacterNames | "null";
	tier: number;
}

interface LoadoutOrNullAndMessages {
	loadout: Mod[] | null;
	id: string;
	messages: string[];
}

interface LoadoutAndMessages {
	loadout: Mod[];
	id: string;
	messages: string[];
}

type StatValuesCacheKey = `${string}${boolean | undefined}${number}`;
type ModsAndSatisfiedSetRestrictions = [Mod[], SetRestrictions];
type SetValues = Record<
	TargetStatsNames,
	{
		set: SetBonus;
		value: number;
	}
>;
type ModBySlot = Record<ModTypes.GIMOSlots, Mod | null>;
type PartialModBySlot = Partial<ModBySlot>;
type NullablePartialModBySlot = PartialModBySlot | null;
type SetRestrictionsEntries = [GIMOSetStatNames, number][];
// #endregion types

// state

let stateLoader$: ObservableObject<StateLoaderObservable>;
let profilesManagement$: ObservableObject<ProfilesManagementObservable>;
let compilations$: ObservableObject<CompilationsObservable>;
let incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable>;
let lockedStatus$: ObservableObject<LockedStatusObservable>;
let optimizationSettings$: ObservableObject<OptimizationSettingsObservable>;

// #region Messaging
self.onmessage = (message) => {
	if (message.data.type === "Init") {
		import("../modules/stateLoader/stateLoader")
			.then((module) => {
				stateLoader$ = module.stateLoader$;
				profilesManagement$ = stateLoader$.profilesManagement$;
				compilations$ = stateLoader$.compilations$;
				incrementalOptimization$ = stateLoader$.incrementalOptimization$;
				lockedStatus$ = stateLoader$.lockedStatus$;
				optimizationSettings$ = stateLoader$.optimizationSettings$;
				postMessage({
					type: "Ready",
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	if (message.data.type === "Optimize") {
		const lastRun: OptimizationConditions =
			compilations$.defaultCompilation.optimizationConditions.get();
		const profile = profilesManagement$.activeProfile.get();
		const allMods = Array.from(
			profile.modById.values().map((mod) => mod.serialize()),
			deserializeMod,
		);
		//			const allMods = profile.mods.map(deserializeMod);

		const lastRunCharacterById: Partial<Character.CharacterById> = {};

		if (lastRun !== null) {
			if (lastRun.characterById) {
				for (const character of Object.values(lastRun.characterById)) {
					lastRunCharacterById[character.id] = character;
				}

				lastRun.characterById = lastRunCharacterById as Character.CharacterById;
			}

			lastRun.selectedCharacters = Array.isArray(lastRun.selectedCharacters)
				? lastRun.selectedCharacters.map(({ id, target }) => ({
						id: id,
						target: deserializeTarget(target),
					}))
				: lastRun.selectedCharacters;
		}

		const selectedCharacters: SelectedCharacters =
			compilations$.defaultCompilation.selectedCharacters
				.peek()
				.map(({ id, target }) => ({
					id: id,
					target: deserializeTarget(target),
				}));

		const optimizerResults = optimizeMods(
			allMods,
			profile.characterById,
			selectedCharacters,
			incrementalOptimization$.indicesByProfile[profile.allycode].peek(),
			optimizationSettings$.settingsByProfile.peek()[profile.allycode],
			lastRun,
			compilations$.defaultCompilation.flatCharacterModdings.peek(),
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
		performance.now() - lastProgressUpdated > 100
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
	Partial<Record<Stats.DisplayStatNames, Record<number, number>>>
> = Object.freeze({
	Offense: {
		1: 1.88,
		2: 2,
		3: 3.88,
		4: 4,
		5: 5.88,
		6: 8.5,
	},
	Defense: {
		1: 3.75,
		2: 4,
		3: 7.75,
		4: 8,
		5: 11.75,
		6: 20,
	},
	Health: {
		1: 1.88,
		2: 2,
		3: 3.88,
		4: 4,
		5: 5.88,
		6: 16,
	},
	Protection: {
		1: 7.5,
		2: 8,
		3: 15.5,
		4: 16,
		5: 23.5,
		6: 24,
	},
	Speed: {
		1: 17,
		2: 19,
		3: 21,
		4: 26,
		5: 30,
		6: 32,
	},
	Accuracy: {
		1: 7.5,
		2: 8,
		3: 8.75,
		4: 10.5,
		5: 12,
		6: 30,
	},
	"Critical Avoidance": {
		1: 15,
		2: 16,
		3: 18,
		4: 21,
		5: 24,
		6: 35,
	},
	"Critical Chance": {
		1: 7.5,
		2: 8,
		3: 8.75,
		4: 10.5,
		5: 12,
		6: 20,
	},
	"Critical Damage": {
		1: 22.5,
		2: 24,
		3: 27,
		4: 31.5,
		5: 36,
		6: 42,
	},
	Potency: {
		1: 15,
		2: 16,
		3: 18,
		4: 21,
		5: 24,
		6: 30,
	},
	Tenacity: {
		1: 15,
		2: 16,
		3: 18,
		4: 21,
		5: 24,
		6: 35,
	},
});

const statSlicingUpgradeFactors: Readonly<
	Partial<Record<GIMOSecondaryStatNames, number>>
> = Object.freeze({
	"Offense %": 3.02,
	"Defense %": 2.34,
	"Health %": 1.86,
	Defense: 1.63,
	Tenacity: 1.33,
	Potency: 1.33,
	"Protection %": 1.33,
	Health: 1.26,
	Protection: 1.11,
	Offense: 1.1,
	"Critical Chance": 1.04,
});

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

const affectedTargetStatsByPtimaryStat: Record<
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

function areObjectsEquivalent(left: object, right: object): boolean {
	// If either object is null, then Object.getOwnPropertyNames will fail. Do these checks first
	if (left === null) {
		return right === null;
	}
	if (right === null) {
		return false;
	}

	// Create arrays of property names
	const leftProps = Object.getOwnPropertyNames(left);
	const rightProps = Object.getOwnPropertyNames(right);

	// If number of properties is different,
	// objects are not equivalent
	if (leftProps.length !== rightProps.length) {
		return false;
	}

	// Check that every property is equivalent
	return leftProps.every((propName: string) => {
		if ((left as Record<string, unknown>)[propName] instanceof Object) {
			return areObjectsEquivalent(
				(left as Record<string, object>)[propName],
				(right as Record<string, object>)[propName],
			);
		}
		return (
			(left as Record<string, unknown>)[propName] ===
			(right as Record<string, unknown>)[propName]
		);
	});
}

function deserializePrimaryStat(type: GIMOPrimaryStatNames, value: string) {
	const displayType = PrimaryStats.PrimaryStat.GIMO2DisplayStatNamesMap[type];
	const rawValue = value.replace(/[+%]/g, "");
	const realValue = +rawValue;
	const isPercentVersion =
		(type.endsWith("%") || value.endsWith("%")) &&
		Stats.Stat.mixedTypes.includes(displayType);

	return {
		type: type,
		displayType: displayType,
		value: realValue,
		isPercentVersion: isPercentVersion,
	} as PrimaryStat;
}

function deserializeSecondaryStat(type: GIMOSecondaryStatNames, value: string) {
	const displayType =
		SecondaryStats.SecondaryStat.gimo2DisplayStatNamesMap[type];
	const rawValue = value.replace(/[+%]/g, "");
	const realValue = +rawValue;
	const isPercentVersion =
		(type.endsWith("%") || value.endsWith("%")) &&
		Stats.Stat.mixedTypes.includes(displayType);

	return {
		type: type,
		displayType: displayType,
		value: realValue,
		isPercentVersion: isPercentVersion,
	} as SecondaryStat;
}

function deserializeMod(mod: ModTypes.GIMOFlatMod) {
	const primaryStat = deserializePrimaryStat(
		mod.primaryBonusType,
		mod.primaryBonusValue,
	);
	const secondaryStats: SecondaryStat[] = [];

	if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_1, mod.secondaryValue_1),
		);
	}
	if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_2, mod.secondaryValue_2),
		);
	}
	if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_3, mod.secondaryValue_3),
		);
	}
	if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
		secondaryStats.push(
			deserializeSecondaryStat(mod.secondaryType_4, mod.secondaryValue_4),
		);
	}

	//  const setBonus = setBonuses[mod.set.toLowerCase().replace(' ', '')];
	const setBonus = setBonuses[mod.set];

	return {
		id: mod.mod_uid,
		slot: mod.slot.toLowerCase(),
		modset: setBonus,
		level: mod.level,
		pips: mod.pips,
		primaryStat: primaryStat,
		secondaryStats: secondaryStats,
		characterID: mod.characterID,
		tier: mod.tier,
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
const cache: Cache = {
	modScores: new Map<string, number>(),
	modUpgrades: new Map<string, Mod>(),
	modStats: new Map<string, { gen: number; value: StatValue[] }>(),
	statValues: new Map<string, StatValue[]>(),
};

// Generation counter for character-dependent modStats cache
let modStatsGen = 0;
function bumpModStatsGen() {
	modStatsGen += 1;
}

function clearCache() {
	cache.modScores.clear();
	cache.statValues.clear();
}
// #endregion Caching variables

// #region Utility functions

/**
 * Convert a set of mods into an array of absolute stat values that the set provides to a character
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {{displayType: string, value: number}[]}
 */
function getFlatStatsFromLoadout(
	loadout: Mod[],
	character: Character.Character,
	relativeGen: number,
) {
	const statsFromSetBonus = getSetBonusStatsFromLoadout(loadout);
	const statsDirectlyFromMods: StatValue[] = [];
	const flattenedStats: Stat[] = [];
	const combinedStats: Partial<Record<Stats.DisplayStatNames, Stat>> = {};

	for (const mod of loadout) {
		const entry = cache.modStats.get(mod.id);
		if (entry && entry.gen === relativeGen) {
			statsDirectlyFromMods.push(...entry.value);
		} else {
			statsDirectlyFromMods.push(...[]);
		}
		// Ensure we read character-correct stats via generation-aware accessor
		/*
      statsDirectlyFromMods.push(
        ...getFlatStatsFromMod(mod, character, relativeGen),
      );
      */
	}

	for (const stat of statsFromSetBonus) {
		flattenedStats.push(...flattenStatValues(stat, character));
	}

	for (const stat of statsDirectlyFromMods) {
		flattenedStats.push(...flattenStatValues(stat, character));
	}

	for (const stat of flattenedStats) {
		const oldStat = combinedStats[stat.displayType];
		if (oldStat) {
			combinedStats[stat.displayType] = {
				displayType: stat.displayType,
				isPercentVersion: stat.isPercentVersion,
				value: oldStat.value + stat.value,
			};
		} else {
			combinedStats[stat.displayType] = stat;
		}
	}

	// Truncate any stat that can only have a whole value
	return Object.values(combinedStats).map((stat) => {
		const displayType = stat.displayType;
		if (
			displayType === "Health" ||
			displayType === "Protection" ||
			displayType === "Speed" ||
			displayType === "Physical Damage" ||
			displayType === "Armor" ||
			displayType === "Special Damage" ||
			displayType === "Resistance"
		) {
			return Object.assign(stat, {
				value: Math.trunc(stat.value),
			});
		}
		return stat;
	});
}

/**
 * Convert a mod into an array of Stats that all have absolute values based on a given character
 * @param mod {Mod}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
function getFlatStatsFromMod(
	mod: Mod,
	character: Character.Character,
	relativeGen: number,
) {
	const entry = cache.modStats.get(mod.id);
	if (entry && entry.gen === relativeGen) {
		return entry.value;
	}

	const flattenedStats: StatValue[] = [];
	const workingMod = getUpgradedMod(mod);

	flattenedStats.push(...flattenStatValues(workingMod.primaryStat, character));
	for (const stat of workingMod.secondaryStats) {
		flattenedStats.push(...flattenStatValues(stat, character));
	}

	cache.modStats.set(mod.id, { gen: relativeGen, value: flattenedStats });
	return flattenedStats;
}

/**
 * Get all of the Stats that apply to the set bonuses for a given set of mods
 * @param loadout {Array<Mod>}
 *
 * @return {Array<Stat>}
 */
function getSetBonusStatsFromLoadout(loadout: Mod[]) {
	const setStats: SetStat[] = [];
	const setBonusCounts: Partial<
		Record<
			GIMOSetStatNames,
			{ setBonus: SetBonus; lowCount: number; highCount: number }
		>
	> = {};

	for (const mod of loadout) {
		const setName = mod.modset.name;
		const highCountValue =
			optimizationSettings$.activeSettings.simulateLevel15Mods.peek() ||
			mod.level === 15
				? 1
				: 0;

		setBonusCounts[setName] = {
			setBonus: mod.modset,
			lowCount: (setBonusCounts[setName]?.lowCount ?? 0) + 1,
			highCount: (setBonusCounts[setName]?.highCount ?? 0) + highCountValue,
		};
	}

	for (const { setBonus, lowCount, highCount } of Object.values(
		setBonusCounts,
	)) {
		const maxBonusCount = Math.floor(highCount / setBonus.numberOfModsRequired);
		const smallBonusCount = Math.floor(
			(lowCount - maxBonusCount * setBonus.numberOfModsRequired) /
				setBonus.numberOfModsRequired,
		);

		for (let i = 0; i < maxBonusCount; i++) {
			setStats.push(setBonus.maxBonus);
		}

		for (let i = 0; i < smallBonusCount; i++) {
			setStats.push(setBonus.smallBonus);
		}
	}

	return setStats;
}

/**
 * Take a stat that may be a percentage and return only the name and absolute values
 * of the stats it affects for a character
 * @param stat {Stat}
 * @param character {Character}
 *
 * @returns {Array<Stat>}
 */
function flattenStatValues(stat: Stat, character: Character.Character) {
	const cacheKey: StatValuesCacheKey = `${stat.displayType}${stat.isPercentVersion}${stat.value}`;
	const cacheHit = cache.statValues.get(cacheKey);

	if (cacheHit) {
		return cacheHit;
	}
	//console.log(`Stat Displaytype: ${stat.displayType}`);
	const statPropertyNames =
		Stats.Stat.display2CSGIMOStatNamesMap[stat.displayType];

	const flattenedStats: StatValue[] = statPropertyNames.map((statName) => {
		const displayName = statDisplayNames[statName];

		if (stat.isPercentVersion && character.playerValues.baseStats) {
			return {
				displayType: displayName,
				value: (stat.value * character.playerValues.baseStats[statName]) / 100,
			};
		}
		if (!stat.isPercentVersion) {
			return {
				displayType: displayName,
				value: stat.value,
			};
		}
		throw new Error(
			`Stat is given as a percentage, but ${character.id} has no base stats`,
		);
	});

	cache.statValues.set(cacheKey, flattenedStats);
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
	const loadoutSlots: Partial<Record<ModTypes.GIMOSlots, Mod>> = {};
	for (const mod of loadout) {
		loadoutSlots[mod.slot] = mod;
	}

	return (
		loadout.every((mod) => mod.pips >= minimumDots) &&
		(!Object.hasOwn(target.primaryStatRestrictions, "arrow") ||
			(Object.hasOwn(loadoutSlots, "arrow") &&
				loadoutSlots.arrow?.primaryStat.type ===
					target.primaryStatRestrictions.arrow)) &&
		(!target.primaryStatRestrictions.triangle ||
			(Object.hasOwn(loadoutSlots, "triangle") &&
				loadoutSlots.triangle?.primaryStat.type ===
					target.primaryStatRestrictions.triangle)) &&
		(!target.primaryStatRestrictions.circle ||
			(Object.hasOwn(loadoutSlots, "circle") &&
				loadoutSlots.circle?.primaryStat.type ===
					target.primaryStatRestrictions.circle)) &&
		(!target.primaryStatRestrictions.cross ||
			(Object.hasOwn(loadoutSlots, "cross") &&
				loadoutSlots.cross?.primaryStat.type ===
					target.primaryStatRestrictions.cross)) &&
		(!target.useOnlyFullSets || loadoutFulfillsFullSetRestriction(loadout)) &&
		loadoutFulfillsSetRestriction(loadout, target.setRestrictions) &&
		(satisfiesTargetStats ||
			loadoutFulfillsTargetStatRestriction(loadout, character, target))
	);
};
/*
loadoutSatisfiesCharacterRestrictions = perf.measureTime(
  loadoutSatisfiesCharacterRestrictions,
  "loadoutSatisfiesCharacterRestrictions",
);
*/

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
			modStatsGen,
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

	//console.log(`setCounts: ${JSON.stringify(setCounts)}`);
	return (Object.entries(setCounts) as [GIMOSetStatNames, number][]).every(
		([setName, count]) => {
			//console.log(`741: setName: ${setName}`);
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
) {
	const targetStats = target.targetStats;

	if (0 === targetStats.length) {
		return true;
	}

	// Check each target stat individually
	return targetStats.every((targetStat) => {
		const totalValue = getStatValueForCharacterWithMods(
			loadout,
			character,
			targetStat.stat,
			modStatsGen,
		);
		return totalValue <= targetStat.maximum && totalValue >= targetStat.minimum;
	});
}

/**
 * Find the absolute value that a given stat has for a character, given a set of mods equipped on them
 *
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param stat {String}
 * @param target {OptimizationPlan}
 */
function getStatValueForCharacterWithMods(
	loadout: Mod[],
	character: Character.Character,
	stat: TargetStatsNames,
	relativeGen: number,
) {
	if (
		stat !== "Health+Protection" &&
		Stats.Stat.display2CSGIMOStatNamesMap[stat] &&
		Stats.Stat.display2CSGIMOStatNamesMap[stat].length > 1
	) {
		throw new Error(
			"Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special.",
		);
	}
	if (stat === "Health+Protection") {
		const healthProperty = Stats.Stat.display2CSGIMOStatNamesMap.Health[0];
		const protProperty = Stats.Stat.display2CSGIMOStatNamesMap.Protection[0];
		const baseValue =
			character.playerValues.equippedStats[healthProperty] +
			character.playerValues.equippedStats[protProperty];

		const setStats = getFlatStatsFromLoadout(loadout, character, relativeGen);

		const setValue = setStats.reduce((setValueSum, setStat) => {
			// Check to see if the stat is health or protection. If it is, add its value to the total.
			return setStat.displayType === "Health" ||
				setStat.displayType === "Protection"
				? setValueSum + setStat.value
				: setValueSum;
		}, 0);
		return baseValue + setValue;
	}
	const statProperty = Stats.Stat.display2CSGIMOStatNamesMap[stat][0];
	const baseValue = character.playerValues.equippedStats[statProperty];

	const setStats = getFlatStatsFromLoadout(loadout, character, relativeGen);

	const setValue = setStats.reduce((setValueSum, setStat) => {
		// Check to see if the stat is the target stat. If it is, add its value to the total.
		return setStat.displayType === stat
			? setValueSum + setStat.value
			: setValueSum;
	}, 0);
	let returnValue = baseValue + setValue;

	// Change target stat to a percentage for Armor and Resistance
	// so Reo'Ris shuts up about it in the Discord.
	if (["armor", "resistance"].includes(statProperty)) {
		returnValue =
			(100 * returnValue) / (character.playerValues.level * 7.5 + returnValue);
	}

	return returnValue;
}

/**
 * Given a set of mods and a definition of setRestriction, return only those mods that fit the setRestriction
 *
 * @param allMods {Array<Mod>}
 * @param setRestriction {Object}
 * @returns {Array<Mod>}
 */
function restrictMods(allMods: Mod[], setRestriction: SetRestrictions) {
	const potentialSets = areSetsComplete(setRestriction)
		? Object.entries(setRestriction)
				.filter(([, count]) => count > 0)
				.map(([set]) => set)
		: Object.values(setBonuses).map((setBonus) => setBonus.name);

	return allMods.filter((mod) => potentialSets.includes(mod.modset.name));
}

/**
 * Utility function to determine if a given sets definition covers all 6 mod slots
 *
 * @param setDefinition {Object<SetBonus, Number>}
 * @returns {Boolean}
 */
function areSetsComplete(setDefinition: SetRestrictions) {
	return (
		6 ===
		(Object.entries(setDefinition) as SetRestrictionsEntries)
			.filter(([, setCount]) => -1 !== setCount)
			.reduce(
				(filledSlots, [setName, setCount]) =>
					filledSlots + setBonuses[setName].numberOfModsRequired * setCount,
				0,
			)
	);
}

/**
 * Filter a set of mods based on a minimum dot level and a specified primary stat. If there aren't any mods that fit
 * the filter, then the primary stat restriction will be dropped first, followed by the minimum dot restriction.
 * Return both the filtered mods and any messages to display about changes that were made
 *
 * @param baseMods {Array<Mod>} The set of mods to filter
 * @param slot {String} The slot that the mods have to fill
 * @param minDots {Number} The minimum dot level of the mod
 * @param primaryStat {String} The primary stat that each mod needs to have
 *
 * @returns {mods, messages}
 */
function filterMods(
	baseMods: Mod[],
	slot: ModTypes.GIMOSlots,
	minDots: number,
	primaryStat: GIMOPrimaryStatNames | undefined,
) {
	if (primaryStat) {
		// Only filter if some primary stat restriction is set
		const fullyFilteredMods = baseMods.filter(
			(mod) =>
				mod.slot === slot &&
				mod.pips >= minDots &&
				(primaryStat === undefined
					? true
					: mod.primaryStat.type === primaryStat),
		);
		if (fullyFilteredMods.length > 0) {
			return { mods: fullyFilteredMods, messages: [] };
		}
	}

	const dotFilteredMods = baseMods.filter(
		(mod) => mod.slot === slot && mod.pips >= minDots,
	);
	if (dotFilteredMods.length > 0) {
		return {
			mods: dotFilteredMods,
			// Only pass a message back if primaryStat was actually set
			messages:
				(primaryStat && [
					`No ${primaryStat} ${slot} mods were available, so the primary stat restriction was dropped.`,
				]) ||
				[],
		};
	}

	const slotFilteredMods = baseMods.filter((mod) => mod.slot === slot);
	if (slotFilteredMods.length > 0) {
		return {
			mods: slotFilteredMods,
			messages: primaryStat
				? [
						`No ${primaryStat} or ${minDots}-dot ${slot} mods were available, so both restrictions were dropped.`,
					]
				: [
						`No ${minDots}-dot ${slot} mods were available, so the dots restriction was dropped.`,
					],
		};
	}
	return {
		mods: [],
		messages: [`No ${slot} mods were available to use.`],
	};
}

/**
 * Return a function to sort mods by their scores for a character
 *
 * @param character Character
 */
function modSort(character: Character.Character) {
	return (left: Mod, right: Mod) => {
		if (cache.modScores.get(right.id) === cache.modScores.get(left.id)) {
			// If mods have equal value, then favor the one that's already equipped
			if (left.characterID !== "null" && character.id === left.characterID) {
				return -1;
			}
			if (right.characterID !== "null" && character.id === right.characterID) {
				return 1;
			}
			return 0;
		}
		return (
			(cache.modScores.get(right.id) ?? 0) - (cache.modScores.get(left.id) ?? 0)
		);
	};
}

/**
 * Return how valuable a particular stat is for an Optimization Plan
 * @param stat {Stat}
 * @param target {OptimizationPlan}
 */
function scoreStat(stat: Stat, target: OptimizationPlan) {
	// Because Optimization Plans treat all critical chance the same, we can't break it into physical and special crit
	// chance for scoring. Catch this edge case so that we can properly value crit chance
	//console.log(`951: stat.displayType: ${stat.displayType}`);
	const targetProperties: WithoutCC[] | ["Critical Chance"] = [
		"Critical Chance",
		"Physical Critical Chance",
	].includes(stat.displayType)
		? ["Critical Chance"]
		: (Stats.Stat.display2CSGIMOStatNamesMap[stat.displayType] as WithoutCC[]);
	//console.log(`953: targetProperties: ${targetProperties}`);
	return targetProperties.reduce(
		(acc, targetProperty) =>
			target[targetProperty] ? acc + target[targetProperty] * stat.value : acc,
		0,
	);
}

/**
 * Given a mod and an optimization plan, figure out the value for that mod
 *
 * @param mod {Mod}
 * @param character {Character} Character for whom the mod is being scored
 * @param target {OptimizationPlan} The plan that represents what each stat is worth
 */
function scoreMod(mod: Mod, target: OptimizationPlan) {
	const cacheHit = cache.modScores.get(mod.id);
	if (cacheHit) {
		return cacheHit;
	}

	const modStatsEntry = cache.modStats.get(mod.id);
	const flattenedStatValues =
		modStatsEntry && modStatsEntry.gen === modStatsGen
			? modStatsEntry.value
			: [];

	const modScore = flattenedStatValues.reduce(
		(score, stat) => score + scoreStat(stat, target),
		0,
	);

	cache.modScores.set(mod.id, modScore);
	return modScore;
}

/**
 * Get the stats that a mod would have were it upgraded to level 15 and/or sliced to 6E,
 * based on the optimization target of the given character
 * @param mod {Mod}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {Mod}
 */
function getUpgradedMod(mod: Mod) {
	const cacheHit = cache.modUpgrades.get(mod.id);
	if (cacheHit) {
		return cacheHit;
	}

	const workingMod: Mod = Object.assign({}, mod);

	// Level the mod if the target says to

	if (
		15 > workingMod.level &&
		optimizationSettings$.activeSettings.simulateLevel15Mods.peek()
	) {
		workingMod.primaryStat = {
			displayType: workingMod.primaryStat.displayType,
			isPercentVersion: workingMod.primaryStat.isPercentVersion,
			type: workingMod.primaryStat.type,
			value:
				maxStatPrimaries[workingMod.primaryStat.displayType]?.[
					workingMod.pips
				] ?? 0,
		};
		workingMod.level = 15;
	}

	// Slice the mod to 6E if needed
	if (
		15 === workingMod.level &&
		5 === workingMod.pips &&
		optimizationSettings$.activeSettings.simulate6EModSlice.peek()
	) {
		workingMod.pips = 6;
		workingMod.primaryStat = {
			displayType: workingMod.primaryStat.displayType,
			isPercentVersion: workingMod.primaryStat.isPercentVersion,
			type: workingMod.primaryStat.type,
			value: maxStatPrimaries[workingMod.primaryStat.displayType]?.[6] ?? 0,
		};
		workingMod.secondaryStats = workingMod.secondaryStats.map((stat) => {
			const statName: GIMOSecondaryStatNames = stat.isPercentVersion
				? (`${stat.displayType} %` as GIMOSecondaryStatNames)
				: (stat.displayType as GIMOSecondaryStatNames);

			return {
				displayType: stat.displayType,
				isPercentVersion: stat.isPercentVersion,
				type: stat.type,
				value:
					"Speed" === stat.displayType
						? stat.value + 1
						: (statSlicingUpgradeFactors[statName] ?? 0) * stat.value,
			};
		});
		workingMod.tier = 1;
	}

	cache.modUpgrades.set(mod.id, workingMod);
	return workingMod;
}

/**
 * Given a set of mods, get the value of that set for a character
 *
 * @param loadout {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
function scoreLoadout(
	loadout: Mod[],
	character: Character.Character,
	target: OptimizationPlan,
) {
	return getFlatStatsFromLoadout(loadout, character, modStatsGen).reduce(
		(score, stat) => score + scoreStat(stat, target),
		0,
	);
}

/**
 * Given a set of set restrictions, systematically reduce their severity, returning an array sorted by most to least
 * restrictive
 *
 * @param setRestrictions {Object}
 * @returns {{restriction: Object, messages: Array<String>}[]}
 */
function loosenRestrictions(setRestrictions: SetRestrictions) {
	const restrictionsArray: {
		restriction: SetRestrictions;
		messages: string[];
	}[] = [
		{
			restriction: setRestrictions,
			messages: [],
		},
	];
	// TODO add type for restriction

	// Try without sets
	for (const { restriction, messages } of restrictionsArray) {
		if (Object.entries(restriction).length) {
			restrictionsArray.push({
				restriction: {},
				messages: messages.concat(
					"No mod sets could be found using the given sets, so the sets restriction was removed",
				),
			});
		}
	}

	return restrictionsArray;
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
 * @param previousRun {Object} The settings from the last time the optimizer was run, used to limit expensive
 *                             recalculations for optimizing mods
 * @return {Object} An array with an entry for each item in `order`. Each entry will be of the form
 *                  {id, target, assignedMods, messages}
 */
let optimizeMods = (
	availableMods: Mod[],
	characterById: Character.CharacterById,
	order: SelectedCharacters,
	incrementalOptimizeIndex: number | null,
	globalSettings: ProfileOptimizationSettings,
	previousRun: OptimizationConditions,
	previousModAssignments: FlatCharacterModdings,
) => {
	// We only want to recalculate mods if settings have changed between runs. If global settings or locked
	// characters have changed, recalculate all characters
	let recalculateMods =
		previousRun === undefined ||
		previousRun === null ||
		compilations$.defaultCompilation.hasSelectionChanged.peek() === true ||
		globalSettings.forceCompleteSets !==
			previousRun.globalSettings.forceCompleteSets ||
		globalSettings.lockUnselectedCharacters !==
			previousRun.globalSettings.lockUnselectedCharacters ||
		globalSettings.modChangeThreshold !==
			previousRun.globalSettings.modChangeThreshold ||
		globalSettings.simulate6EModSlice !==
			previousRun.globalSettings.simulate6EModSlice ||
		globalSettings.simulateLevel15Mods !==
			previousRun.globalSettings.simulateLevel15Mods ||
		globalSettings.optimizeWithPrimaryAndSetRestrictions !==
			previousRun.globalSettings.optimizeWithPrimaryAndSetRestrictions ||
		availableMods.length !== previousRun.modCount;

	if (!recalculateMods) {
		let charID: CharacterNames;
		for (charID in characterById) {
			if (!Object.hasOwn(characterById, charID)) {
				continue;
			}
			if (
				!previousRun?.characterById[charID] ||
				previousRun.lockedStatus[charID] !==
					lockedStatus$.ofActivePlayerByCharacterId[charID].peek()
			) {
				recalculateMods = true;
				break;
			}
		}
	}

	// Filter out any mods that are on locked characters, including if all unselected characters are locked
	let usableMods = availableMods.filter(
		(mod) =>
			mod.characterID === "null" ||
			!lockedStatus$.ofActivePlayerByCharacterId[mod.characterID].peek(),
	);

	if (globalSettings.lockUnselectedCharacters) {
		const selectedCharacterIds = order.map(({ id }) => id);
		usableMods = usableMods.filter(
			(mod) =>
				mod.characterID === "null" ||
				selectedCharacterIds.includes(mod.characterID),
		);
	}

	const unselectedCharacters: CharacterNames[] = (
		Object.keys(characterById) as CharacterNames[]
	).filter((characterID) => !order.map(({ id }) => id).includes(characterID));

	const lockedCharacters: CharacterNames[] = (
		Object.keys(characterById) as CharacterNames[]
	)
		.filter((id) => lockedStatus$.ofActivePlayerByCharacterId[id].peek())
		.concat(
			globalSettings.lockUnselectedCharacters ? unselectedCharacters : [],
		);

	if (
		incrementalOptimizeIndex !== null &&
		incrementalOptimizeIndex < order.length
	) {
		order.length = incrementalOptimizeIndex + 1;
	}

	// For each not-locked character in the list, find the best mod set for that character
	const optimizerResults = order.reduce(
		(
			modSuggestions: FlatCharacterModdings,
			{ id: characterID, target },
			index,
		) => {
			const character = characterById[characterID];
			const previousCharacter = previousRun?.characterById[characterID] ?? null;

			// If the character is locked, skip it
			if (lockedStatus$.ofActivePlayerByCharacterId[character.id].peek()) {
				return modSuggestions;
			}

			// For each character, check if the settings for the previous run were the same, and skip the character if so
			if (
				!recalculateMods &&
				previousRun?.selectedCharacters &&
				previousRun.selectedCharacters[index] &&
				characterID === previousRun.selectedCharacters[index].id &&
				previousCharacter &&
				previousCharacter.playerValues &&
				areObjectsEquivalent(
					character.playerValues,
					previousCharacter.playerValues,
				) &&
				areObjectsEquivalent(
					target,
					previousRun.selectedCharacters[index].target,
				) &&
				previousCharacter.targets &&
				lockedStatus$.ofActivePlayerByCharacterId[character.id].peek() ===
					previousRun.lockedStatus[character.id] &&
				previousModAssignments[index]
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
				} as FlatCharacterModding);
				return modSuggestions;
			}
			recalculateMods = true;

			if (globalSettings.optimizeWithPrimaryAndSetRestrictions === false) {
				target.setRestrictions = {};
				target.primaryStatRestrictions = {} as PrimaryStatRestrictions;
			}
			if (globalSettings.forceCompleteSets) {
				target.useOnlyFullSets = true;
			}

			const absoluteTarget = changeRelativeTargetStatsToAbsolute(
				modSuggestions,
				characterById,
				lockedCharacters,
				availableMods,
				target,
				character,
			);

			// Extract any target stats that are set as only goals
			const goalStats = absoluteTarget.targetStats.filter(
				(targetStat) => !targetStat.optimizeForTarget,
			);

			absoluteTarget.targetStats = absoluteTarget.targetStats.filter(
				(targetStat) => targetStat.optimizeForTarget,
			);

			const realTarget = combineTargetStats(absoluteTarget, character);

			const { loadout: newLoadoutForCharacter, messages: characterMessages } =
				findBestLoadoutForCharacter(
					usableMods,
					character,
					order.length,
					index,
					realTarget,
				);

			const oldLoadoutForCharacter = usableMods.filter(
				(mod) => mod.characterID === character.id,
			);

			const newLoadoutValue = scoreLoadout(
				newLoadoutForCharacter,
				character,
				realTarget,
			);
			const oldLoadoutValue = scoreLoadout(
				oldLoadoutForCharacter,
				character,
				realTarget,
			);

			// Assign the new loadout if any of the following are true:
			let assignedLoadout: Mod[] = [];
			let assignmentMessages: string[] = [];
			if (
				// Treat a threshold of 0 as "always change", so long as the new mod set is better than the old at all
				(globalSettings.modChangeThreshold === 0 &&
					newLoadoutValue >= oldLoadoutValue) ||
				// If the new set is the same mods as the old set
				(newLoadoutForCharacter.length === oldLoadoutForCharacter.length &&
					oldLoadoutForCharacter.every((oldMod) =>
						newLoadoutForCharacter.find((newMod) => newMod.id === oldMod.id),
					)) ||
				// If the old set doesn't satisfy the character/target restrictions, but the new set does
				(!loadoutSatisfiesCharacterRestrictions(
					oldLoadoutForCharacter,
					character,
					realTarget,
				) &&
					loadoutSatisfiesCharacterRestrictions(
						newLoadoutForCharacter,
						character,
						realTarget,
					)) ||
				// If the new set is better than the old set
				(newLoadoutValue / oldLoadoutValue) * 100 - 100 >
					globalSettings.modChangeThreshold ||
				// If the old set now has less than 6 mods and the new set has more mods
				(oldLoadoutForCharacter.length < 6 &&
					newLoadoutForCharacter.length > oldLoadoutForCharacter.length)
			) {
				assignedLoadout = newLoadoutForCharacter;
				assignmentMessages = characterMessages;
			} else {
				assignedLoadout = oldLoadoutForCharacter;
				if (
					!loadoutSatisfiesCharacterRestrictions(
						newLoadoutForCharacter,
						character,
						realTarget,
					)
				) {
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
			});

			bumpModStatsGen();
			return modSuggestions;
		},
		[],
	);

	// Delete any cache that we had saved
	clearCache();

	return optimizerResults;
};
optimizeMods = perf.measureTime(optimizeMods, "optimizeMods");
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
	modSuggestions: FlatCharacterModdings,
	characterById: Character.CharacterById,
	lockedCharacters: CharacterNames[],
	allMods: Mod[],
	target: OptimizationPlan,
	character: Character.Character,
): OptimizationPlan {
	const oldTargetStats = target.targetStats;
	// Make a copy of mod suggestions so that we don't modify the original
	const currentModSuggestions = modSuggestions.slice(0);

	return {
		...target,
		targetStats: oldTargetStats.map((targetStat: TargetStat) => {
			if (targetStat.relativeCharacterId === "null") {
				return targetStat;
			}

			const relativeCharacter = characterById[targetStat.relativeCharacterId];
			let characterMods: Mod[];

			if (lockedCharacters.includes(targetStat.relativeCharacterId)) {
				// Get the character's mods from the set of all mods
				characterMods = allMods.filter(
					(mod) => mod.characterID === targetStat.relativeCharacterId,
				);
			} else {
				// Find the character by searching backwards through the modSuggestions array
				const characterModsEntry = currentModSuggestions
					.filter((x) => null !== x)
					.reverse()
					.find(({ characterId: id }) => id === targetStat.relativeCharacterId);
				if (undefined === characterModsEntry) {
					throw new Error(
						`Could not find suggested mods for ${targetStat.relativeCharacterId}.  ` +
							`Make sure they are selected above ${character.id}`,
					);
				}

				characterMods = characterModsEntry.assignedMods
					.map((modId) => allMods.find((mod) => mod.id === modId))
					.filter((mod: Mod | undefined): mod is Mod => !!mod);
			}

			clearCache();
			const relativeCharacterIndex = currentModSuggestions.findLastIndex(
				(item) => item?.characterId === targetStat.relativeCharacterId,
			);
			const characterStatValue = getStatValueForCharacterWithMods(
				characterMods,
				relativeCharacter,
				targetStat.stat,
				relativeCharacterIndex,
			);

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
	const filteredMods =
		character.playerValues.gearLevel < 12
			? mods.filter((mod) => 6 > mod.pips || mod.characterID === character.id)
			: mods;
	const modsToCache = filteredMods;
	const usableMods = filteredMods;

	const setRestrictions = target.setRestrictions;
	const targetStats = target.targetStats;
	// Cclear other caches
	clearCache();
	const loadoutScoreCache = () => {
		const cache = new Map<string, number>();
		return (loadout: Mod[], id: string) => {
			if (cache.has(id)) {
				return cache.get(id) ?? 0;
			}

			const score = scoreLoadout(loadout, character, target);
			cache.set(id, score);
			return score;
		};
	};
	const cachedLoadoutScores = loadoutScoreCache();
	//  cachedLoadoutScores = perf.measureTime(cachedLoadoutScores, "cachedLoadoutScores");

	// Get the flattened stats and score every mod for this character. From that point on, only look at the cache
	// for the rest of the time processing mods for this character.
	for (const mod of modsToCache) {
		getFlatStatsFromMod(mod, character, modStatsGen);
		scoreMod(mod, target);
	}

	let loadout: Mod[];
	let messages: string[];
	let extraMessages: string[] = [];
	const mutableTarget = Object.assign({}, target);
	let reducedTarget: OptimizationPlan = mutableTarget;

	// First, check to see if there is any target stat
	if (0 < targetStats.length) {
		// If so, create an array of potential mod sets that could fill it
		let potentialMods = getPotentialModsToSatisfyTargetStats(
			usableMods,
			character,
			characterCount,
			characterIndex,
			mutableTarget,
		);
		({ loadout: loadout, messages } = findBestLoadoutFromPotentialMods(
			potentialMods,
			character,
			mutableTarget,
			cachedLoadoutScores,
		));
		/*
    perf.logMeasures("cachedLoadoutScores");
    perf.logMeasures("findBestLoadoutWithoutChangingRestrictions");
    perf.logMeasures("getPotentialModsToSatisfyTargetStats");
    perf.logMeasures("targetStatRecursor");
    perf.logMeasures("findBestLoadoutFromPotentialMods");
*/

		// If we couldn't find a mod set that would fulfill the target stat, but we're limiting to only full sets, then
		// try again without that limitation
		if (loadout.length === 0) {
			reducedTarget = mutableTarget.useOnlyFullSets
				? Object.assign({}, mutableTarget, {
						useOnlyFullSets: false,
					})
				: mutableTarget;

			if (mutableTarget.useOnlyFullSets) {
				extraMessages.push(
					"Could not fill the target stat with full sets, so the full sets restriction was dropped",
				);

				potentialMods = getPotentialModsToSatisfyTargetStats(
					usableMods,
					character,
					characterCount,
					characterIndex,
					mutableTarget,
				);
				({ loadout: loadout, messages } = findBestLoadoutFromPotentialMods(
					potentialMods,
					character,
					reducedTarget,
					cachedLoadoutScores,
				));
			}
		}
		if (loadout.length === 0) {
			({ loadout: loadout, messages } =
				findBestLoadoutByLooseningSetRestrictions(
					usableMods,
					character,
					reducedTarget,
					setRestrictions,
					cachedLoadoutScores,
				));
			extraMessages.push(
				"Could not fill the target stats as given, so the target stat restriction was dropped",
			);
		}

		if (loadout.length) {
			// Return the best set and set of messages
			return {
				loadout: loadout,
				messages: messages.concat(extraMessages),
			};
		}

		extraMessages = [
			"Could not fulfill the target stat as given, so the target stat restriction was dropped",
		];
	}

	//    mutableTarget.targetStat = null;
	// If not, simply iterate over all levels of restrictions until a suitable set is found.
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
	({ loadout: loadout, messages } = findBestLoadoutByLooseningSetRestrictions(
		usableMods,
		character,
		mutableTarget,
		setRestrictions,
		cachedLoadoutScores,
	));

	if (loadout.length === 0 && mutableTarget.useOnlyFullSets) {
		reducedTarget = Object.assign({}, mutableTarget, {
			useOnlyFullSets: false,
		});
		extraMessages.push(
			"Could not find a mod set using only full sets, so the full sets restriction was dropped",
		);

		({ loadout: loadout, messages } = findBestLoadoutByLooseningSetRestrictions(
			usableMods,
			character,
			reducedTarget,
			setRestrictions,
			cachedLoadoutScores,
		));
	}

	return {
		loadout: loadout,
		messages: messages.concat(extraMessages),
	};
}

/**
 * Given a set of mods and a target stat, get all of the mod and set restriction combinations that will fit that target
 * @param allMods {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {Array<Array<Mod>,Object<String, Number>>} An array of potential mods that could be used to create a set
 *   that fulfills the target stat as [mods, setRestriction]
 */
// TODO: Refactor this function
// * Create a new function that will loop over each target stat
// * At each iteration, run the equivalent of this function on every mod set from the previous iteration
// * Then, filter out any that are empty
const getPotentialModsToSatisfyTargetStats = function* (
	allMods: Mod[],
	character: Character.Character,
	characterCount: number,
	characterIndex: number,
	target: OptimizationPlan,
) {
	const setRestrictions = target.setRestrictions;
	const statNames = target.targetStats.map((targetStat) => targetStat.stat);
	// A map from the set name to the value the set provides for a target stat
	// {statName: {set, value}}
	const setValues = getSetBonusesThatHaveValueForStats(
		statNames,
		character,
		setRestrictions,
	);

	// First, get the base values of each stat on the character so they can be subtracted
	// from what's needed for the min and max
	// {statName: value}
	const characterValues = getStatValuesForCharacter(character, statNames);

	// Determine the sets of values for each target stat that will satisfy it
	// {statName: {setCount: [{slot: slotValue}]}}
	const modConfigurationsByStat: Record<
		TargetStatsNames,
		Record<number, Record<string, number>[]>
	> = {
		Accuracy: {},
		Armor: {},
		"Critical Avoidance": {},
		"Critical Damage": {},
		Health: {},
		"Health+Protection": {},
		"Physical Critical Chance": {},
		"Physical Damage": {},
		Potency: {},
		Protection: {},
		Resistance: {},
		"Special Critical Chance": {},
		"Special Damage": {},
		Speed: {},
		Tenacity: {},
	};

	const totalModSlotsOpen =
		6 -
		Object.entries<number>(setRestrictions)
			.filter(([, setCount]) => -1 !== setCount)
			.reduce(
				(filledSlots, [setName, setCount]) =>
					filledSlots +
					setBonuses[setName as GIMOSetStatNames].numberOfModsRequired *
						setCount,
				0,
			);

	// Filter out any mods that don't meet primary or set restrictions. This can vastly speed up this process
	let usableMods = filterOutUnusableMods(allMods, target, totalModSlotsOpen);
	//  console.log(`allMods#: ${allMods.length}`);
	//  console.log(`usableMods#: ${usableMods.length}`);

	const [modValues, valuesBySlotByStat] = collectModValuesBySlot(
		usableMods,
		statNames,
	);
	if (
		target.targetStats.length === 1 &&
		target.targetStats[0].stat === "Speed"
	) {
		const groupedUsableMods = Object.groupBy(usableMods, (mod) => {
			let speedValue = 0;
			if (mod.slot === "arrow") {
				speedValue = mod.primaryStat.value;
			} else {
				const speedStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				speedValue = speedStat ? speedStat.value : 0;
			}

			return `${mod.slot}-${mod.modset.name}-${mod.primaryStat.type}-${speedValue}`;
		});
		usableMods = [];
		for (const group of Object.values(groupedUsableMods)) {
			if (group) {
				let bestMod = group[0];
				for (const mod of group) {
					if (
						(cache.modScores.get(mod.id) ?? 0) >
						(cache.modScores.get(bestMod.id) ?? 0)
					) {
						bestMod = mod;
					}
				}
				usableMods.push(bestMod);
			}
		}
	}
	//  console.log(`usableMods#: ${usableMods.length}`);

	for (const targetStat of target.targetStats) {
		const setValue = setValues[targetStat.stat];

		if (setValue) {
			const minSets = setRestrictions[setValue.set.name] || 0;
			const maxSets =
				(setRestrictions[setValue.set.name] || 0) +
				Math.floor(totalModSlotsOpen / setValue.set.numberOfModsRequired);

			for (let numSetsUsed = maxSets; numSetsUsed >= 0; numSetsUsed--) {
				const nonModValue =
					characterValues[targetStat.stat] + setValue.value * numSetsUsed;

				const progressMin =
					((numSetsUsed - minSets) / (maxSets - minSets + 1)) * 100;
				const progressMax =
					((numSetsUsed - minSets + 1) / (maxSets - minSets + 1)) * 100;

				modConfigurationsByStat[targetStat.stat][numSetsUsed] =
					findStatValuesThatMeetTarget(
						valuesBySlotByStat[targetStat.stat],
						targetStat.minimum - nonModValue,
						targetStat.maximum - nonModValue,
						progressMin,
						progressMax,
						character,
						characterCount,
						characterIndex,
					);

				if (
					targetStat.stat !== "Speed" &&
					modConfigurationsByStat[targetStat.stat][numSetsUsed].length === 0
				)
					break;
			}
		} else {
			modConfigurationsByStat[targetStat.stat] = {
				0: findStatValuesThatMeetTarget(
					valuesBySlotByStat[targetStat.stat],
					targetStat.minimum - characterValues[targetStat.stat],
					targetStat.maximum - characterValues[targetStat.stat],
					0,
					100,
					character,
					characterCount,
					characterIndex,
				),
			};
		}
	}

	function modHasScoreForTargetStat(mod: Mod, stat: TargetStatsNames) {
		if (affectedTargetStatsBySet[mod.modset.name].includes(stat)) return true;
		if (affectedTargetStatsByPtimaryStat[mod.primaryStat.type].includes(stat))
			return true;
		if (
			mod.secondaryStats.some((secondaryStat) =>
				affectedTargetStatsBySecondaryStat[secondaryStat.type].includes(stat),
			)
		)
			return true;
		return false;
	}

	/**
	 * Given a set of mods, return only those mods that might be used with the current target. Filter out any mods
	 * that don't have the correct primary stat, don't have enough dots, or aren't in the right sets, if all slots are
	 * taken by the pre-selected sets
	 *
	 * @param mods {Array<Mod>}
	 * @param target {OptimizationPlan}
	 * @param modSlotsOpen {Integer}
	 * @returns {Array<Mod>}
	 */
	function filterOutUnusableMods(
		mods: Mod[],
		target: OptimizationPlan,
		modSlotsOpen: number,
	) {
		const modsInSets =
			modSlotsOpen > 0
				? mods
				: mods.filter((mod) =>
						Object.keys(target.setRestrictions).includes(mod.modset.name),
					);

		const modsWithPrimaries = modsInSets.filter((mod) => {
			if (["square", "diamond"].includes(mod.slot)) return true;
			if (
				target.primaryStatRestrictions[
					mod.slot as ModTypes.VariablePrimarySlots
				] === undefined
			)
				return true;

			return (
				mod.primaryStat.type ===
				target.primaryStatRestrictions[
					mod.slot as ModTypes.VariablePrimarySlots
				]
			);
		});

		const modsWithScoredStats = modsWithPrimaries.filter((mod) =>
			target.targetStats.some((targetStat) =>
				modHasScoreForTargetStat(mod, targetStat.stat),
			),
		);

		return modsWithScoredStats.filter(
			(mod) => mod.pips >= target.minimumModDots,
		);
	}

	/**
	 * Iterate over groups of mods, breaking them into sub-groups that satisfy the target stats
	 *
	 * @param modGroup {Array<[Mods, SetRestrictions]>} A set of mods and set restrictions that satisfy all target stats
	 *                                                  so far.
	 * @param targetStats {Array<TargetStat>} The target stats that still have to be processed
	 * @param topLevel {Boolean} An indicator if this is the first level of mod break-down (for progress reporting)
	 * @returns {Array<Array<Mod>,Object<String, Number>>} An array of potential mods that could be used to create a set
	 *                                                     that fulfills the target stat as [mods, setRestriction]
	 */
	const targetStatRecursor = function* (
		modGroup: ModsAndSatisfiedSetRestrictions,
		targetStats: TargetStats,
		targetStatsCount: number,
	): Generator<ModsAndSatisfiedSetRestrictions> {
		if (0 === targetStats.length) {
			if (
				6 > modGroup[0].length ||
				gimoSlots.reduce((hasSlot, slot) => {
					const slotMod = modGroup[0].find((mod) => mod.slot === slot);
					return hasSlot && !!slotMod;
				}, true) === false
			) {
				// If we don't have enough mods to fill out a set, don't even both checking
				return;
			}
			yield modGroup;
		} else {
			const updatedTargetStats = targetStats.slice(0);
			const currentTarget = updatedTargetStats.pop();
			if (currentTarget === undefined) return;

			const [mods, setRestrictions] = modGroup;
			const setValue = setValues[currentTarget.stat];

			progressMessage(
				character.id,
				characterCount,
				characterIndex,
				1,
				0,
				currentTarget.stat,
				targetStatsCount,
				targetStatsCount - updatedTargetStats.length,
				"Step 2/2: Calculating mod sets to meet target value",
				0,
			);

			// Pre-index
			const bestByKeyByValueBySlot = buildBestModsIndex(
				mods,
				currentTarget.stat,
				modValues,
			);
			const bestArraysBySlot = buildBestModsArrayLookup(bestByKeyByValueBySlot);

			// Find any collection of values that will sum up to the target stat
			// If there is a setValue, repeat finding mods to fill the target for as many sets as can be used
			if (setValue) {
				// Also check to see if any mod set a) provides a value for the stats and b) can be added to the set restrictions
				const modSlotsOpen =
					6 -
					(Object.entries(setRestrictions) as SetRestrictionsEntries)
						.filter(([, setCount]) => -1 !== setCount)
						.reduce(
							(filledSlots, [setName, setCount]) =>
								filledSlots +
								setBonuses[setName].numberOfModsRequired * setCount,
							0,
						);

				const minSets = setRestrictions[setValue.set.name] || 0;
				const maxSets =
					minSets +
					Math.floor(modSlotsOpen / setValue.set.numberOfModsRequired);

				const numConfigurations = Object.values(
					modConfigurationsByStat[currentTarget.stat],
				).reduce(
					(totalConfigurations, configuration) =>
						totalConfigurations + configuration.length,
					0,
				);
				const onePercent = Math.max(1, Math.floor(numConfigurations / 100));
				let currentIteration = 0;

				for (let numSetsUsed = minSets; numSetsUsed <= maxSets; numSetsUsed++) {
					const updatedSetRestriction = Object.assign({}, setRestrictions, {
						// If we want to explicitly avoid a set, use a value of -1
						[setValue.set.name]: numSetsUsed === 0 ? -1 : numSetsUsed,
					});

					const potentialModValues =
						modConfigurationsByStat[currentTarget.stat][numSetsUsed];

					// Build modsThatFitGivenValues via lookups in the pre-indexed map
					for (const potentialModValuesObject of potentialModValues) {
						const modsThatFitGivenValues: Mod[] = [];
						for (const slot of gimoSlots) {
							const desiredValue = potentialModValuesObject[
								slot as keyof typeof potentialModValuesObject
							] as number | undefined;
							if (desiredValue === undefined) continue;
							const arr = bestArraysBySlot.get(slot)?.get(desiredValue);
							if (arr?.length) modsThatFitGivenValues.push(...arr);
						}

						// Send progress messages as we iterate over the possible values
						if (++currentIteration % onePercent === 0) {
							const progressPercent =
								(currentIteration / numConfigurations) * 100;
							progressMessage(
								character.id,
								characterCount,
								characterIndex,
								maxSets - minSets + 1,
								numSetsUsed - minSets + 1,
								currentTarget.stat,
								targetStatsCount,
								targetStatsCount - updatedTargetStats.length,
								"Step 2/2: Calculating mod sets to meet target value",
								progressPercent,
							);
						}

						yield* targetStatRecursor(
							[modsThatFitGivenValues, updatedSetRestriction],
							updatedTargetStats,
							targetStatsCount,
						);
					}
				}
			} else {
				const potentialModValues =
					modConfigurationsByStat[currentTarget.stat][0];
				const numConfigurations = potentialModValues.length;
				const onePercent = Math.max(1, Math.floor(numConfigurations / 100));
				let currentIteration = 0;

				// Build modsThatFitGivenValues via lookups in the pre-indexed map
				for (const potentialModValuesObject of potentialModValues) {
					const modsThatFitGivenValues: Mod[] = [];
					for (const slot of gimoSlots) {
						const desiredValue = potentialModValuesObject[
							slot as keyof typeof potentialModValuesObject
						] as number | undefined;
						if (desiredValue === undefined) continue;
						const arr = bestArraysBySlot.get(slot)?.get(desiredValue);
						if (arr?.length) modsThatFitGivenValues.push(...arr);
					}
					// Send progress messages as we iterate over the possible values
					if (currentIteration++ % onePercent === 0) {
						const progressPercent =
							(currentIteration / numConfigurations) * 100;
						progressMessage(
							character.id,
							characterCount,
							characterIndex,
							1,
							1,
							currentTarget.stat,
							targetStatsCount,
							targetStatsCount - updatedTargetStats.length,
							"Step 2/2: Calculating mod sets to meet target value",
							progressPercent,
						);
					}

					yield* targetStatRecursor(
						[modsThatFitGivenValues, setRestrictions],
						updatedTargetStats,
						targetStatsCount,
					);
				}
			}
		}
	};
	//  targetStatRecursor = perf.measureTime(targetStatRecursor, "targetStatRecursor");

	yield* targetStatRecursor(
		[usableMods, setRestrictions],
		target.targetStats,
		target.targetStats.length,
	);
};
// getPotentialModsToSatisfyTargetStats = perf.measureTime(getPotentialModsToSatisfyTargetStats, "getPotentialModsToSatisfyTargetStats");

/**
 * Given a character and a list of stats, return an object with the character's value for that stat from level, stars,
 * and gear.
 *
 * @param character {Character}
 * @param stats {Array<Stat>}
 */
function getStatValuesForCharacter(
	character: Character.Character,
	stats: TargetStatsNames[],
) {
	const characterValues = {} as Record<TargetStatsNames, number>;
	for (const stat of stats) {
		if (stat === "Health+Protection") {
			throw new Error("Cannot optimize Health+Protection. Use as Report Only.");
		}
		const characterStatProperties = Stats.Stat.display2CSGIMOStatNamesMap[stat];
		if (1 < characterStatProperties.length) {
			throw new Error(
				"Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special.",
			);
		}
		characterValues[stat] =
			character.playerValues.equippedStats[characterStatProperties[0]] || 0;
	}

	return characterValues;
}

/**
 * Find all the set bonuses that provide value to the given stats
 *
 * @param stats {Array<String>}
 * @param character {Character}
 * @param setRestrictions {Object<String, Integer>} An object that maps set names to how many of that set must be used.
 *
 * @returns {Object<String, Object>} A map from stat name to an object showing the set and its value
 */
function getSetBonusesThatHaveValueForStats(
	stats: TargetStatsNames[],
	character: Character.Character,
	setRestrictions: SetRestrictions,
): SetValues {
	const setValues: Partial<SetValues> = {};

	// Figure out any sets that are valuable towards each stat
	for (const setBonus of Object.values(setBonuses)) {
		// Don't use any sets that are restricted
		if (-1 === setRestrictions[setBonus.name]) {
			continue;
		}

		// TODO: Eventually support non-max bonuses
		const setStats = flattenStatValues(setBonus.maxBonus, character);

		for (const stat of stats) {
			// This works on the assumption that only one mod set could ever fill a given stat
			const valuableStat = setStats.find(
				(setStat) => setStat.displayType === stat,
			);

			if (valuableStat) {
				// If the set is one that uses only whole-number values, then take the floor
				// of the stat to get its real value
				const workingValue = [
					"Health %",
					"Defense %",
					"Offense %",
					"Speed %",
				].includes(setBonus.name)
					? Math.floor(valuableStat.value)
					: valuableStat.value;

				setValues[stat] = {
					set: setBonus,
					value: workingValue,
				};
			}
		}
	}

	return setValues as SetValues;
}

/**
 * For a list of mods, create two objects: The first will map stat names to mod ID => value for that stat. The second
 * will map stat names to slot => Set(values), collecting the unique values of all mods for that stat
 *
 * @param mods {Array<Mod>}
 * @param stats {Array<String>}
 *
 * @returns {Array<Object>} [{statName: {modID => value}}, {statName: {slot => Set(values)}}]
 */
function collectModValuesBySlot(
	mods: Mod[],
	stats: TargetStatsNames[],
): [
	Record<TargetStatsNames, Record<string, number>>,
	Record<TargetStatsNames, Record<string, Set<number>>>,
] {
	const modValues: Record<TargetStatsNames, Record<string, number>> = {
		Accuracy: {},
		Armor: {},
		"Critical Avoidance": {},
		"Critical Damage": {},
		Health: {},
		"Health+Protection": {},
		"Physical Critical Chance": {},
		"Physical Damage": {},
		Potency: {},
		Protection: {},
		Resistance: {},
		"Special Critical Chance": {},
		"Special Damage": {},
		Speed: {},
		Tenacity: {},
	};
	const valuesBySlotByStat: Record<
		TargetStatsNames,
		Record<string, Set<number>>
	> = {
		Accuracy: {},
		Armor: {},
		"Critical Avoidance": {},
		"Critical Damage": {},
		Health: {},
		"Health+Protection": {},
		"Physical Critical Chance": {},
		"Physical Damage": {},
		Potency: {},
		Protection: {},
		Resistance: {},
		"Special Critical Chance": {},
		"Special Damage": {},
		Speed: {},
		Tenacity: {},
	};

	// Initialize the sub-objects in each of the above
	for (const stat of stats) {
		const slotValuesForTarget: Partial<
			Record<ModTypes.GIMOSlots, Set<number>>
		> = {};
		for (const slot of gimoSlots) {
			slotValuesForTarget[slot] = new Set([0]);
		}
		valuesBySlotByStat[stat] = slotValuesForTarget;
		modValues[stat] = {};
	}

	// Iterate through all the mods, filling out the objects as we go
	for (const mod of mods) {
		const entry = cache.modStats.get(mod.id);
		const modSummary = entry && entry.gen === modStatsGen ? entry.value : [];

		const combinedModSummary = {} as Record<Stats.DisplayStatNames, StatValue>;

		for (const stat of modSummary) {
			const oldStat = combinedModSummary[stat.displayType];
			if (oldStat) {
				combinedModSummary[stat.displayType] = {
					displayType: stat.displayType,
					value: oldStat.value + stat.value,
				};
			} else {
				combinedModSummary[stat.displayType] = stat;
			}
		}

		for (const stat of stats) {
			if (stat !== "Health+Protection") {
				const statForTarget = combinedModSummary[stat];
				const statValue = statForTarget ? statForTarget.value : 0;

				modValues[stat][mod.id] = statValue;

				valuesBySlotByStat[stat][mod.slot].add(statValue);
			}
		}
	}

	// sort the values in each slot descending
	for (const stat of stats) {
		for (const slot of gimoSlots) {
			valuesBySlotByStat[stat][slot] = new Set(
				Array.from(valuesBySlotByStat[stat][slot]).sort((a, b) => b - a),
			);
		}
	}

	return [modValues, valuesBySlotByStat];
}

// Build a nested index for a given target stat: slot -> value -> key(primary|set|slot) -> best-scoring Mod
type BestModsIndex = Map<ModTypes.GIMOSlots, Map<number, Map<string, Mod>>>;

function buildBestModsIndex(
	mods: Mod[],
	stat: TargetStatsNames,
	modValues: Record<TargetStatsNames, Record<string, number>>,
): BestModsIndex {
	const bestByKeyByValueBySlot: BestModsIndex = new Map();
	// Local alias for faster lookups in hot loop
	const scores = cache.modScores;
	for (const mod of mods) {
		const valueForStat = modValues[stat][mod.id] ?? 0;
		const slot = mod.slot;
		let byValue = bestByKeyByValueBySlot.get(slot);
		if (!byValue) {
			byValue = new Map<number, Map<string, Mod>>();
			bestByKeyByValueBySlot.set(slot, byValue);
		}
		let byKey = byValue.get(valueForStat);
		if (!byKey) {
			byKey = new Map<string, Mod>();
			byValue.set(valueForStat, byKey);
		}
		// Slot is already the outer map key, so it doesn't need to be part of the inner grouping key
		const key = `${mod.primaryStat.type}|${mod.modset.name}`;
		const existing = byKey.get(key);
		if (!existing) {
			byKey.set(key, mod);
		} else {
			const existingScore = scores.get(existing.id) ?? 0;
			const score = scores.get(mod.id) ?? 0;
			if (score > existingScore) byKey.set(key, mod);
		}
	}
	return bestByKeyByValueBySlot;
}

// Create fast array lookups per (slot,value) from the index
type BestModsArrayLookup = Map<ModTypes.GIMOSlots, Map<number, Mod[]>>;
function buildBestModsArrayLookup(index: BestModsIndex): BestModsArrayLookup {
	const bySlotArrays: BestModsArrayLookup = new Map();
	for (const [slot, byValue] of index.entries()) {
		const valueMap = new Map<number, Mod[]>();
		for (const [value, byKey] of byValue.entries()) {
			valueMap.set(value, Array.from(byKey.values()));
		}
		bySlotArrays.set(slot, valueMap);
	}
	return bySlotArrays;
}

/**
 * Given a set of potential values in each slot, find every combination of values that fits the target criteria
 *
 * @param valuesBySlot {Object<String, Set<Number>>}
 * @param targetMin {number}
 * @param targetMax {number}
 * @param progressMin {Number} How far along the overall process is before starting this funciton
 * @param progressMax {Number} How far along the overall process will be after this function completes
 * @param character {Character} The character the values are being calculated for
 * @returns {{square: number, diamond: number, arrow: number, cross: number, circle: number, triangle: number}[]}
 */
function findStatValuesThatMeetTarget(
	valuesBySlot: Record<string, Set<number>>,
	targetMin: number,
	targetMax: number,
	progressMin: number,
	progressMax: number,
	character: Character.Character,
	characterCount: number,
	characterIndex: number,
) {
	const denom = Math.max(1, Math.floor(progressMax - progressMin));
	const total =
		valuesBySlot.square.size *
		valuesBySlot.arrow.size *
		valuesBySlot.diamond.size *
		valuesBySlot.triangle.size *
		valuesBySlot.circle.size *
		valuesBySlot.cross.size;
	const onePercent = Math.max(1, Math.floor(total / denom));
	let iterations = 0;
	let abort = [false, false, false, false, false, false];
	const firstOfSlot = [true, true, true, true, true, true];

	// Precompute per-slot max and suffixMax for early lower-bound pruning.
	// Sets are already in descending order; the first value is the max.
	const maxPerSlot: number[] = gimoSlots.map((slot) => {
		const it = valuesBySlot[slot].values();
		const first = it.next();
		return first.done ? 0 : (first.value as number);
	});
	const suffixMax: number[] = new Array(gimoSlots.length + 1).fill(0);
	for (let i = gimoSlots.length - 1; i >= 0; i--) {
		suffixMax[i] = suffixMax[i + 1] + maxPerSlot[i];
	}

	progressMessage(
		character.id,
		characterCount,
		characterIndex,
		1,
		0,
		"",
		1,
		0,
		"Step 1/2: Finding stat values to meet targets",
		progressMin,
	);

	// This is essentially a fancy nested for loop iterating over each value in each slot.
	// That means this is O(n^6) for 6 mod slots (which is terrible!).
	function* slotRecursor(
		slotIndex: number,
		valuesObject: Partial<Record<ModTypes.GIMOSlots, number>>,
		prefixSum: number,
	): Generator<Partial<Record<ModTypes.GIMOSlots, number>>> {
		if (slotIndex < 6) {
			const currentSlot = gimoSlots[slotIndex];
			firstOfSlot[slotIndex] = true;
			for (const slotValue of valuesBySlot[currentSlot]) {
				// Early lower-bound pruning: even with maximum remaining, can't reach target
				const optimistic = prefixSum + slotValue + suffixMax[slotIndex + 1];
				if (optimistic < targetMin) {
					break; // further values are smaller; break this slot's loop
				}

				// In-place mutation avoids Object.assign churn
				valuesObject[currentSlot] = slotValue;
				yield* slotRecursor(slotIndex + 1, valuesObject, prefixSum + slotValue);
				// Clean up for next iteration to avoid leaking values across branches
				delete valuesObject[currentSlot];
				firstOfSlot[slotIndex] = false;
				if (abort[slotIndex]) {
					return;
				}
			}
		} else {
			if (iterations++ % onePercent === 0) {
				progressMessage(
					character.id,
					characterCount,
					characterIndex,
					1,
					0,
					"",
					1,
					0,
					"Step 1/2: Finding stat values to meet targets",
					progressMin + iterations / onePercent,
				);
			}

			abort = [false, false, false, false, false, false];
			if (prefixSum >= targetMin && prefixSum <= targetMax) {
				// Yield a snapshot to avoid later in-place mutations corrupting prior results
				yield { ...valuesObject };
			} else if (prefixSum < targetMin) {
				abort = [
					firstOfSlot[1] &&
						firstOfSlot[2] &&
						firstOfSlot[3] &&
						firstOfSlot[4] &&
						firstOfSlot[5],
					firstOfSlot[2] && firstOfSlot[3] && firstOfSlot[4] && firstOfSlot[5],
					firstOfSlot[3] && firstOfSlot[4] && firstOfSlot[5],
					firstOfSlot[4] && firstOfSlot[5],
					firstOfSlot[5],
					true,
				];
				return;
			}
		}
	}

	return Array.from(slotRecursor(0, {}, 0));
}

function setAndMessagesHasSet(
	setAndMessages: LoadoutOrNullAndMessages,
): setAndMessages is LoadoutAndMessages {
	return setAndMessages.loadout !== null;
}

const findBestLoadoutFromPotentialMods = (
	potentialLoadouts: Generator<ModsAndSatisfiedSetRestrictions>,
	character: Character.Character,
	target: OptimizationPlan,
	cachedLoadoutScores: (loadout: Mod[], id: string) => number,
) => {
	let bestLoadoutAndMessages: LoadoutAndMessages = {
		loadout: [],
		id: "",
		messages: [],
	};
	let bestSetScore = Number.NEGATIVE_INFINITY;
	let bestUnmovedMods = 0;
	let bestModsSatisfyCharacterRestrictions = false;

	const updateBestSet = (
		loadoutAndMessages: LoadoutAndMessages,
		score: number,
		unmovedMods: number,
		modsSatisfyCharacterRestrictions: boolean,
	) => {
		bestLoadoutAndMessages = loadoutAndMessages;
		bestSetScore = score;
		bestUnmovedMods = unmovedMods;
		bestModsSatisfyCharacterRestrictions = modsSatisfyCharacterRestrictions;
	};
	//  updateBestSet = perf.measureTime(updateBestSet, "updateBestSet");

	for (const [loadout, candidateSetRestrictions] of potentialLoadouts) {
		const loadoutAndMessages: LoadoutOrNullAndMessages =
			findBestLoadoutWithoutChangingRestrictions(
				loadout,
				character,
				target,
				candidateSetRestrictions,
				cachedLoadoutScores,
			);

		if (setAndMessagesHasSet(loadoutAndMessages)) {
			const setScore = cachedLoadoutScores(
				loadoutAndMessages.loadout,
				loadoutAndMessages.id,
			);
			const newModsSatisfyCharacterRestrictions =
				loadoutSatisfiesCharacterRestrictions(
					loadoutAndMessages.loadout,
					character,
					target,
					true,
				);

			// If this set of mods couldn't fulfill all of the character restrictions, then it can only be used if
			// we don't already have a set of mods that does
			if (
				!newModsSatisfyCharacterRestrictions &&
				bestLoadoutAndMessages &&
				bestModsSatisfyCharacterRestrictions
			) {
				continue;
			}

			// We'll accept a new set if it is better than the existing set OR if the existing set doesn't fulfill all of the
			// restrictions and the new set does
			if (
				setScore > bestSetScore ||
				(setScore > 0 &&
					!bestModsSatisfyCharacterRestrictions &&
					newModsSatisfyCharacterRestrictions)
			) {
				updateBestSet(loadoutAndMessages, setScore, 0, true); // TODO check if this works. Las param was null
			} else if (setScore === bestSetScore) {
				// If both sets have the same value, choose the set that moves the fewest mods
				const unmovedMods = loadoutAndMessages.loadout.filter(
					(mod) => mod.characterID === character.id,
				).length;
				if (null === bestUnmovedMods) {
					bestUnmovedMods = bestLoadoutAndMessages.loadout.filter(
						(mod) => mod.characterID === character.id,
					).length;
				}

				if (unmovedMods > bestUnmovedMods) {
					updateBestSet(
						loadoutAndMessages,
						setScore,
						unmovedMods,
						newModsSatisfyCharacterRestrictions,
					);
				} else if (
					unmovedMods === bestUnmovedMods &&
					loadoutAndMessages.loadout.length >
						bestLoadoutAndMessages.loadout.length
				) {
					// If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
					updateBestSet(
						loadoutAndMessages,
						setScore,
						unmovedMods,
						newModsSatisfyCharacterRestrictions,
					);
				}
			}
		}
	}
	/*
  perf.logMeasures("loadoutSatisfiesCharacterRestrictions");
  console.log(`Total time spent finding best mod set: ${totalTime}ms`);
*/

	return bestLoadoutAndMessages;
};
// findBestLoadoutFromPotentialMods = perf.measureTime(findBestLoadoutFromPotentialMods, "findBestLoadoutFromPotentialMods");

/**
 * Figure out what the best set of mods for a character are such that the values in the plan are optimized. Try to
 * satisfy the set restrictions given, but loosen them if no mod set can be found that uses them as-is.
 *
 * @param usableMods {Array<Mod>} The set of mods that is available to be used for this character
 * @param character {Character} A Character object that represents all of the base stats required for percentage
 *                              calculations as well as the optimization plan to use
 * @param target {OptimizationPlan} The optimization plan to use as the basis for the best mod set
 * @param setRestrictions {Object<String, Number>} An object with the number of each set to use
 * @returns {{messages: Array<String>, loadout: Array<Mod>}}
 */
function findBestLoadoutByLooseningSetRestrictions(
	usableMods: Mod[],
	character: Character.Character,
	target: OptimizationPlan,
	setRestrictions: SetRestrictions,
	cachedLoadoutScores: (loadout: Mod[], id: string) => number,
): LoadoutAndMessages {
	// Get a list of the restrictions to iterate over for this character, in order of most restrictive (exactly what was
	// selected) to least restrictive (the last entry will always be no restrictions).
	const possibleRestrictions = loosenRestrictions(setRestrictions);

	// Try to find a mod set using each set of restrictions until one is found
	for (let i = 0; i < possibleRestrictions.length; i++) {
		const { restriction, messages: restrictionMessages } =
			possibleRestrictions[i];

		// Filter the usable mods based on the given restrictions
		const restrictedMods = restrictMods(usableMods, restriction);

		// Try to optimize using this set of mods
		const {
			loadout: bestLoadout,
			id: bestLoadoutId,
			messages: setMessages,
		} = findBestLoadoutWithoutChangingRestrictions(
			restrictedMods,
			character,
			target,
			restriction,
			cachedLoadoutScores,
		);

		if (bestLoadout !== null) {
			return {
				loadout: bestLoadout,
				id: bestLoadoutId,
				messages: restrictionMessages.concat(setMessages),
			};
		}
	}

	return {
		loadout: [],
		id: "",
		messages: [`No mod sets could be found for ${character.id}`],
	};
}

function generateLoadoutId(loadout: Mod[]) {
	return loadout.map((mod) => mod.id).join("-");
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
	cachedLoadoutScores: (loadout: Mod[], id: string) => number,
): LoadoutOrNullAndMessages => {
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
	let subMessages: string[];

	// Sort all the mods by score, then break them into sets.
	// For each slot, try to use the most restrictions possible from what has been set for that character
	usableMods.sort(modSort(character));

	({ mods: squares, messages: subMessages } = filterMods(
		usableMods,
		"square",
		target.minimumModDots,
		"Offense %",
	));
	messages.push(...subMessages);
	({ mods: arrows, messages: subMessages } = filterMods(
		usableMods,
		"arrow",
		target.minimumModDots,
		target.primaryStatRestrictions.arrow,
	));
	messages.push(...subMessages);
	({ mods: diamonds, messages: subMessages } = filterMods(
		usableMods,
		"diamond",
		target.minimumModDots,
		"Defense %",
	));
	messages.push(...subMessages);
	({ mods: triangles, messages: subMessages } = filterMods(
		usableMods,
		"triangle",
		target.minimumModDots,
		target.primaryStatRestrictions.triangle,
	));
	messages.push(...subMessages);
	({ mods: circles, messages: subMessages } = filterMods(
		usableMods,
		"circle",
		target.minimumModDots,
		target.primaryStatRestrictions.circle,
	));
	messages.push(...subMessages);
	({ mods: crosses, messages: subMessages } = filterMods(
		usableMods,
		"cross",
		target.minimumModDots,
		target.primaryStatRestrictions.cross,
	));
	messages.push(...subMessages);

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
			return {
				loadout: loadout,
				id: generateLoadoutId(loadout),
				messages: messages,
			};
		}
		return { loadout: null, id: "", messages: [] as string[] };
	}

	/**
	 * Given a sorted array of mods, return either the first mod (if it has a non-negative score) or null. This allows
	 * for empty slots on characters where the mods might be better used elsewhere.
	 * @param candidates Array[Mod]
	 * @returns Mod
	 */
	const topMod = (candidates: Mod[]) => {
		const mod: Mod | null = firstOrNull(candidates);
		if (mod && (cache.modScores.get(mod.id) ?? 0) >= 0) {
			return mod;
		}
		return null;
	};

	const usedSets = (Object.entries(setsToUse) as SetRestrictionsEntries)
		.filter(([, count]) => count > 0)
		.map(([setName]) => setName);

	const modSlotsOpen =
		6 -
		(Object.entries(setsToUse) as SetRestrictionsEntries)
			.filter(([, setCount]) => -1 !== setCount)
			.reduce(
				(filledSlots, [setName, setCount]) =>
					filledSlots + setBonuses[setName].numberOfModsRequired * setCount,
				0,
			);

	if (0 === modSlotsOpen) {
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
			potentialUsedSets.add(setBonus);
		}
		setlessMods = null;
	} else {
		// Otherwise, use any set bonus with positive value that fits into the set restriction
		for (const setBonus of Object.values(setBonuses)) {
			if (
				setBonus.numberOfModsRequired <= modSlotsOpen &&
				scoreStat(setBonus.maxBonus, target) > 0
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
		setsToUse,
	);

	let bestLoadout: Mod[] = [];
	let bestLoadoutScore = Number.NEGATIVE_INFINITY;
	let bestUnmovedMods = -1;

	for (const loadout of candidateLoadouts) {
		const loadoutScore = cachedLoadoutScores(
			loadout,
			generateLoadoutId(loadout),
		);
		//     scoreLoadout(loadout, character, target);
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
		loadout: bestLoadout,
		id: generateLoadoutId(bestLoadout),
		messages: messages,
	};
};
// findBestLoadoutWithoutChangingRestrictions = perf.measureTime(findBestLoadoutWithoutChangingRestrictions, "findBestLoadoutWithoutChangingRestrictions");

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
			// reset scratch
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
			// reset scratch
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

	// If there's a forced 4-mod set
	if (forcedSets[4].length > 0) {
		firstSet = baseSets[forcedSets[4][0]] ?? emptySet;

		if (forcedSets[2].length > 0) {
			// Every set is completely deterministic. Combine the first and second sets in every way possible
			secondSet = baseSets[forcedSets[2][0]] ?? emptySet;
			yield* safeYieldTwoSets(firstSet, secondSet, false, false);
		} else {
			// The sets aren't completely deterministic. We need to check...
			// The four-mod set plus setless mods
			yield* safeYieldTwoSets(firstSet, setlessMods, false, true);

			// The four-mod set plus any two-mod sets with value
			for (const secondSetType of twoModSets) {
				secondSet = baseSets[secondSetType] ?? emptySet;
				yield* safeYieldTwoSets(firstSet, secondSet, false, false);
			}
		}
	} else if (1 === forcedSets[2].length) {
		// If there's exactly one forced 2-mod set, there should be 4 slots open
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;

		// The two-mod set plus setless mods
		yield* safeYieldTwoSets(setlessMods, firstSet, true, false);

		// The two-mod set plus any two two-mod sets with value
		for (let i = 0; i < twoModSets.length; i++) {
			secondSet = baseSets[twoModSets[i]] ?? emptySet;

			// The forced set plus the second set plus setless mods
			yield* safeYieldThreeSets(setlessMods, firstSet, secondSet, true, false);

			for (let j = i; j < twoModSets.length; j++) {
				thirdSet = baseSets[twoModSets[j]] ?? emptySet;

				// The forced set plus the two other sets
				yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
			}
		}
	} else if (2 === forcedSets[2].length) {
		// With 2 forced 2-mod sets, there should be 2 slots open
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;
		secondSet = baseSets[forcedSets[2][1]] ?? emptySet;

		// The two sets plus setless mods
		yield* safeYieldThreeSets(setlessMods, firstSet, secondSet, true, false);

		// The two sets plus any two-mod sets with value
		for (const thirdSetType of twoModSets) {
			thirdSet = baseSets[thirdSetType] ?? emptySet;
			yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
		}
	} else if (3 === forcedSets[2].length) {
		// Every set is deterministic
		firstSet = baseSets[forcedSets[2][0]] ?? emptySet;
		secondSet = baseSets[forcedSets[2][1]] ?? emptySet;
		thirdSet = baseSets[forcedSets[2][2]] ?? emptySet;
		yield* safeYieldThreeSets(firstSet, secondSet, thirdSet, false, false);
	} else {
		// If no sets are forced, we can check every possible combination
		// The base set
		if (setlessMods && nonNullCount(setlessMods) > 0) {
			// Emit the base set from setlessMods
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
					// m can be Mod or undefined; only assign when it's a Mod
					if (m !== undefined) scratch[slotIndex[slot]] = m;
				}
			}
			yield emitFromScratch();
		}

		for (const firstSetType of fourModSets) {
			const firstSet = baseSets[firstSetType] ?? null; // TODO check if the not undefined bang is ok

			// the whole set plus setless mods
			yield* safeYieldTwoSets(firstSet, setlessMods, false, true);

			// the whole set plus any 2-mod set
			for (const secondSetType of twoModSets) {
				const secondSet = baseSets[secondSetType] ?? null; // TODO check if the not undefined bang is ok
				yield* safeYieldTwoSets(firstSet, secondSet, false, false);
			}
		}

		for (let i = 0; i < twoModSets.length; i++) {
			const firstSet = baseSets[twoModSets[i]] ?? null; // TODO check if the not undefined bang is ok

			// the whole set plus setless mods
			yield* safeYieldTwoSets(setlessMods, firstSet, true, false);

			// the whole set plus a set of 4 from any 2-mod sets and the base set
			for (let j = i; j < twoModSets.length; j++) {
				const secondSet = baseSets[twoModSets[j]] ?? null; // TODO check if the not undefined bang is ok

				// the first set plus the second set plus setless mods
				yield* safeYieldThreeSets(
					setlessMods,
					firstSet,
					secondSet,
					true,
					false,
				);

				// the first set plus the second set plus another set
				for (let k = j; k < twoModSets.length; k++) {
					const thirdSet = baseSets[twoModSets[k]] ?? null; // TODO check if the not undefined bang is ok
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
