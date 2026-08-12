// state
import { ObservableHint } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { ModTiersEnum } from "#/constants/enums";
import type * as ModTypes from "./types/ModTypes";
import type { GIMOSetStatNames } from "./GIMOStatNames";
import type { Pips } from "./Pips";
import {
	type PrimaryStat,
	createPrimaryStat,
	fromHotUtils as primaryStatFromHotUtils,
	upgradePrimayStat,
} from "./PrimaryStat";
import {
	type Rolls,
	type SecondaryStat,
	cloneStat,
	createSecondaryStat,
	downgradeSecondaryStat,
	upgradeSecondaryStat,
	fromHotUtils as secondaryStatFromHotUtils,
	serializeSecondaryStat,
	calculateScore,
} from "./SecondaryStat";
import { HU2GIMOStatNamesMap } from "./SetStat";

const HU2GIMOSlotsMap: {
	[key in ModTypes.HUSlots]: ModTypes.GIMOSlots;
} = {
	Transmitter: "square",
	Receiver: "arrow",
	Processor: "diamond",
	"Holo-Array": "triangle",
	"Data-Bus": "circle",
	Multiplexer: "cross",
} as const;

interface Mod {
	id: string;
	slot: ModTypes.GIMOSlots;
	modset: GIMOSetStatNames;
	level: ModTypes.Levels;
	pips: Pips;
	primaryStat: PrimaryStat;
	secondaryStats: SecondaryStat[];
	tier: ModTiersEnum;
	characterID: CharacterNames | "null";
	totalRolls: number;
	maxRoll: number;
	assignedID: CharacterNames | "null";
	reRolledCount: number;
	speedRemainder: number;
}

const reRollPrices = [15, 25, 40, 75, 100, 150] as const;

function createMod(
	id: string,
	slot: ModTypes.GIMOSlots,
	modset: GIMOSetStatNames,
	level: ModTypes.Levels,
	pips: Pips,
	primaryStat: PrimaryStat,
	secondaryStats: SecondaryStat[],
	characterID: CharacterNames | "null",
	reRolledCount: number,
	speedRemainder: number,
	tier: ModTiersEnum = 1,
) {
	const mod = {
		slot: slot,
		modset: modset,
		level: level,
		pips: pips,
		primaryStat: primaryStat,
		secondaryStats: secondaryStats,
		characterID: characterID,
		reRolledCount: reRolledCount,
		speedRemainder: speedRemainder,
		tier: tier,
		id: id,
		maxRoll: 0,
		totalRolls: 0,
		assignedID: "null",
	} satisfies Mod;
	/**
	 * 1. Performance: Marking Mod instances as opaque prevents Legend State from recursively
	 *    traversing and wrapping all nested properties (secondaryStats, primaryStat, etc.)
	 * 2. Arrays: We mark arrays of Mods as opaque using ObservableHint.opaque(array), but the
	 *    individual Mod objects within need this symbol set to prevent deep observation of their
	 *    internal structure
	 * 3. With this we can't observe individual properties of Mod instances.
	 *    Just get/peek the whole Mod and access properties on the raw Mod.
	 */
	ObservableHint.opaque(mod);
	for (const stat of mod.secondaryStats) {
		if (mod.pips === 6) {
			const tempStat = downgradeSecondaryStat(stat);
			calculateScore(tempStat);
			stat.score = tempStat.score;
		} else {
			calculateScore(stat);
		}
	}
	mod.totalRolls = mod.secondaryStats.reduce(
		(acc, stat) => acc + stat.rolls,
		0,
	);
	mod.maxRoll =
		mod.secondaryStats
			.map((stat) => stat.rolls)
			.sort()
			.slice(-1)[0] ?? 0;

	return mod as Mod;
}

function cloneMod(mod: Mod): Mod {
	return createMod(
		mod.id,
		mod.slot,
		mod.modset,
		mod.level,
		mod.pips,
		mod.primaryStat,
		mod.secondaryStats.map((stat) => cloneStat(stat)),
		mod.characterID,
		mod.reRolledCount,
		mod.speedRemainder,
		mod.tier,
	);
}

/**
 * Simulate leveling this mod up to level 15, upgrading the primary stat as needed, but not changing any of the
 * secondary stats
 * @returns {Mod}
 */
function levelUpMod(mod: Mod): Mod {
	return createMod(
		mod.id,
		mod.slot,
		mod.modset,
		15,
		mod.pips,
		upgradePrimayStat(mod.primaryStat, mod.pips),
		mod.secondaryStats,
		mod.characterID,
		mod.reRolledCount,
		mod.speedRemainder,
		mod.tier,
	);
}

/**
 * Upgrade all of the stats on this mod to see what it would be like after slicing from 5A to 6E
 * @returns {Mod}
 */
function sliceMod(mod: Mod) {
	return createMod(
		mod.id,
		mod.slot,
		mod.modset,
		mod.level,
		6,
		upgradePrimayStat(mod.primaryStat, 6),
		mod.secondaryStats.map((stat) => upgradeSecondaryStat(stat)),
		mod.characterID,
		mod.reRolledCount,
		mod.speedRemainder,
		1,
	);
}

function getModCalibrationPrice(mod: Mod) {
	const totalCalibrations = mod.tier + 1;
	if (mod.pips < 6) return 0;
	if (mod.reRolledCount >= totalCalibrations) return 0;
	return reRollPrices[mod.reRolledCount];
}

function isModAssigned(mod: Mod) {
	return mod.assignedID !== "null";
}

function fromHotUtils(flatMod: ModTypes.HUFlatMod) {
	type secondaryPos = "1" | "2" | "3" | "4";
	const secondaryStats: SecondaryStat[] = [];
	for (const pos of ["1", "2", "3", "4"] as secondaryPos[]) {
		const typeKey =
			`secondaryType_${pos}` as keyof ModTypes.FlatHUModTypeIndexer;
		const rollKey = `secondaryRoll_${pos}` as keyof ModTypes.FlatModRollIndexer;
		if (
			flatMod[typeKey] !== undefined &&
			flatMod[typeKey] !== null &&
			flatMod[rollKey] !== null
		) {
			secondaryStats.push(
				secondaryStatFromHotUtils(
					pos,
					flatMod[typeKey],
					flatMod[
						`secondaryValue_${pos}` as keyof ModTypes.FlatModValueIndexer
					],
					flatMod[rollKey],
				),
			);
		}
	}

	return createMod(
		flatMod.mod_uid,
		HU2GIMOSlotsMap[flatMod.slot],
		HU2GIMOStatNamesMap[flatMod.set],
		flatMod.level,
		flatMod.pips,
		primaryStatFromHotUtils(
			flatMod.primaryBonusType,
			flatMod.primaryBonusValue,
		),
		secondaryStats,
		flatMod.characterID ?? "null",
		flatMod.reRolledCount,
		0,
		flatMod.tier,
	);
}

/**
 * Convert this mod to a simple JSON object so that it can be stringified
 */
function serializeMod(mod: Mod): ModTypes.GIMOFlatMod {
	const modObject: ModTypes.GIMOFlatMod = {
		mod_uid: mod.id,
		slot: mod.slot,
		set: mod.modset,
		level: mod.level,
		pips: mod.pips,
		characterID: mod.characterID,
		tier: mod.tier,
		reRolledCount: mod.reRolledCount,
		speedRemainder: mod.speedRemainder ?? 0,
		primaryBonusType: mod.primaryStat.type,
		primaryBonusValue: mod.primaryStat.stringValue,
		secondaryType_1: "Health",
		secondaryValue_1: "400",
		secondaryRoll_1: "1",
		secondaryType_2: "Health %",
		secondaryValue_2: "0.8",
		secondaryRoll_2: "1",
		secondaryType_3: "Speed",
		secondaryValue_3: "5",
		secondaryRoll_3: "1",
		secondaryType_4: "Offense",
		secondaryValue_4: "45",
		secondaryRoll_4: "1",
	};

	for (let i = 0; i < 4; i++) {
		if (i < mod.secondaryStats.length) {
			const mO = serializeSecondaryStat(mod.secondaryStats[i]);
			[
				modObject[
					`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer
				],
				modObject[
					`secondaryValue_${i + 1}` as keyof ModTypes.FlatModValueIndexer
				],
				modObject[
					`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer
				],
			] = mO;
		} else {
			modObject[
				`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer
			] = null;
			modObject[
				`secondaryValue_${i + 1}` as keyof ModTypes.FlatModValueIndexer
			] = "";
			modObject[`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer] =
				null;
		}
	}

	return modObject;
}

function deserializeMod(mod: ModTypes.GIMOFlatMod) {
	const primaryStat = createPrimaryStat(
		mod.primaryBonusType,
		mod.primaryBonusValue,
	);
	const secondaryStats: SecondaryStat[] = [];

	if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
		secondaryStats.push(
			createSecondaryStat(
				"1",
				mod.secondaryType_1,
				mod.secondaryValue_1,
				+(mod.secondaryRoll_1 ?? 1) as Rolls,
			),
		);
	}
	if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
		secondaryStats.push(
			createSecondaryStat(
				"2",
				mod.secondaryType_2,
				mod.secondaryValue_2,
				+(mod.secondaryRoll_2 ?? 1) as Rolls,
			),
		);
	}
	if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
		secondaryStats.push(
			createSecondaryStat(
				"3",
				mod.secondaryType_3,
				mod.secondaryValue_3,
				+(mod.secondaryRoll_3 ?? 1) as Rolls,
			),
		);
	}
	if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
		secondaryStats.push(
			createSecondaryStat(
				"4",
				mod.secondaryType_4,
				mod.secondaryValue_4,
				+(mod.secondaryRoll_4 ?? 1) as Rolls,
			),
		);
	}

	return createMod(
		mod.mod_uid,
		mod.slot,
		mod.set,
		mod.level,
		mod.pips,
		primaryStat,
		secondaryStats,
		mod.characterID,
		mod.reRolledCount,
		mod.speedRemainder ?? 0,
		mod.tier,
	);
}

export {
	type Mod,
	cloneMod,
	createMod,
	deserializeMod,
	fromHotUtils,
	levelUpMod,
	serializeMod,
	sliceMod,
	reRollPrices,
	getModCalibrationPrice,
	isModAssigned,
};
