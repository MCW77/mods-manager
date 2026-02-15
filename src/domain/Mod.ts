// utils
import {
	toScaled,
	fromScaled,
	mulScaled,
	divScaled,
} from "../utils/scaledNumber";

// state
import { ObservableHint } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { ModTiersEnum } from "#/constants/enums";
import type * as ModTypes from "./types/ModTypes";
import type {
	GIMOPrimaryStatNames,
	GIMOSecondaryStatNames,
	GIMOSetStatNames,
} from "./GIMOStatNames";
import type { Pips } from "./Pips";
import { PrimaryStat } from "./PrimaryStat";
import { type Rolls, SecondaryStat } from "./SecondaryStat";
import { SetStat } from "./SetStat";

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

export class Mod {
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
	scores: {
		[key: string]: number;
	} = {};
	assignedID: CharacterNames | "null";
	reRolledCount: number;
	speedRemainder = 0;

	static reRollPrices = [15, 25, 40, 75, 100, 150];

	constructor(
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
		this.id = id;
		this.slot = slot;
		this.modset = modset;
		this.level = level;
		this.pips = pips;
		this.primaryStat = primaryStat;
		this.secondaryStats = secondaryStats;
		this.characterID = characterID;
		this.reRolledCount = reRolledCount;
		this.speedRemainder = speedRemainder;
		this.tier = tier;

		/**
		 * 1. Performance: Marking Mod instances as opaque prevents Legend State from recursively
		 *    traversing and wrapping all nested properties (secondaryStats, primaryStat, etc.)
		 * 2. Arrays: We mark arrays of Mods as opaque using ObservableHint.opaque(array), but the
		 *    individual Mod objects within need this symbol set to prevent deep observation of their
		 *    internal structure
		 * 3. With this we can't observe individual properties of Mod instances.
		 *    Just get/peek the whole Mod and access properties on the raw Mod.
		 */
		ObservableHint.opaque(this);
		for (const stat of this.secondaryStats) {
			if (this.pips === 6) {
				const tempStat = stat.downgrade();
				tempStat.calcScore();
				stat.score = tempStat.score;
			} else {
				stat.calcScore();
			}
		}
		this.totalRolls = this.secondaryStats.reduce(
			(acc, stat) => acc + stat.rolls,
			0,
		);
		this.maxRoll =
			this.secondaryStats
				.map((stat) => stat.rolls)
				.sort()
				.slice(-1)[0] ?? 0;
		this.calculateScores();
		this.assignedID = "null";
	}

	isAssigned() {
		return this.assignedID !== "null";
	}

	calculateScores(): void {
		for (const scoreDef of modScores) {
			this.scores[scoreDef.name] = scoreDef.scoringAlgorithm(this);
		}
	}

	equip(characterID: CharacterNames) {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			this.pips,
			this.primaryStat,
			this.secondaryStats,
			characterID,
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	unequip() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			this.pips,
			this.primaryStat,
			this.secondaryStats,
			"null",
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	/**
	 * Simulate leveling this mod up to level 15, upgrading the primary stat as needed, but not changing any of the
	 * secondary stats
	 * @returns {Mod}
	 */
	levelUp() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			15,
			this.pips,
			this.primaryStat.upgrade(this.pips),
			this.secondaryStats,
			this.characterID,
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	/**
	 * Upgrade all of the stats on this mod to see what it would be like after slicing from 5A to 6E
	 * @returns {Mod}
	 */
	slice() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			6,
			this.primaryStat.upgrade(6),
			this.secondaryStats.map((stat) => stat.upgrade()),
			this.characterID,
			this.reRolledCount,
			this.speedRemainder,
			1,
		);
	}

	reRollPrice() {
		const totalCalibrations = this.tier + 1;
		if (this.pips < 6) return 0;
		if (this.reRolledCount >= totalCalibrations) return 0;
		return Mod.reRollPrices[this.reRolledCount];
	}

	/**
	 * Convert this mod to a simple JSON object so that it can be stringified
	 */
	serialize() {
		const [pBT, pBV] = this.primaryStat.serialize();

		const modObject: ModTypes.GIMOFlatMod = {
			mod_uid: this.id,
			slot: this.slot,
			set: this.modset,
			level: this.level,
			pips: this.pips,
			characterID: this.characterID,
			tier: this.tier,
			reRolledCount: this.reRolledCount,
			speedRemainder: this.speedRemainder ?? 0,
			primaryBonusType: pBT,
			primaryBonusValue: pBV,
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
			if (i < this.secondaryStats.length) {
				const mO = this.secondaryStats[i].serialize();
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
				modObject[
					`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer
				] = null;
			}
		}

		return modObject;
	}

	getModScoreTier(scoreName: string) {
		return Math.floor(this.scores[scoreName] / 20);
	}

	static fromHotUtils(flatMod: ModTypes.HUFlatMod) {
		type secondaryPos = "1" | "2" | "3" | "4";
		const secondaryStats: SecondaryStat[] = [];
		for (const pos of ["1", "2", "3", "4"] as secondaryPos[]) {
			const typeKey =
				`secondaryType_${pos}` as keyof ModTypes.FlatHUModTypeIndexer;
			const rollKey =
				`secondaryRoll_${pos}` as keyof ModTypes.FlatModRollIndexer;
			if (
				flatMod[typeKey] !== undefined &&
				flatMod[typeKey] !== null &&
				flatMod[rollKey] !== null
			) {
				secondaryStats.push(
					SecondaryStat.fromHotUtils(
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

		return new Mod(
			flatMod.mod_uid,
			HU2GIMOSlotsMap[flatMod.slot],
			SetStat.HU2GIMOStatNamesMap[flatMod.set],
			flatMod.level,
			flatMod.pips,
			PrimaryStat.fromHotUtils(
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

	static deserialize(mod: ModTypes.GIMOFlatMod) {
		const primaryStat = new PrimaryStat(
			mod.primaryBonusType,
			mod.primaryBonusValue,
		);
		const secondaryStats: SecondaryStat[] = [];

		if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
			secondaryStats.push(
				new SecondaryStat(
					"1",
					mod.secondaryType_1,
					mod.secondaryValue_1,
					+(mod.secondaryRoll_1 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
			secondaryStats.push(
				new SecondaryStat(
					"2",
					mod.secondaryType_2,
					mod.secondaryValue_2,
					+(mod.secondaryRoll_2 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
			secondaryStats.push(
				new SecondaryStat(
					"3",
					mod.secondaryType_3,
					mod.secondaryValue_3,
					+(mod.secondaryRoll_3 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
			secondaryStats.push(
				new SecondaryStat(
					"4",
					mod.secondaryType_4,
					mod.secondaryValue_4,
					+(mod.secondaryRoll_4 ?? 1) as Rolls,
				),
			);
		}

		return new Mod(
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
}

// #region ModScores
interface ModScore {
	name: string;
	displayName: string;
	description: string;
	isFlatOrPercentage: "IsPercentage" | "IsFlat";
	scoringAlgorithm: (mod: Mod) => number;
}

function createModScore(
	name: string,
	displayName: string,
	description: string,
	isFlatOrPercentage: "IsPercentage" | "IsFlat",
	scoringAlgorithm: (mod: Mod) => number,
): ModScore {
	return {
		name,
		displayName,
		description,
		isFlatOrPercentage,
		scoringAlgorithm,
	};
}

export const modScores: ModScore[] = [];

modScores.push(
	createModScore(
		"PureSecondaries",
		"Pure secondaries",
		`This score is the simple average of the secondary stat's scores

  Ex:
    (3) Speed      13  - 50%
    (1) Health     256 - 20%
    (1) Protection 760 - 83,17%
    (1) Defense    8   - 71,43%
    => (50% + 20% + 83,17% + 71,43%) / 4 = 56,15%
  `,
		"IsPercentage",
		(mod: Mod) => {
			if (mod.secondaryStats.length === 0) return 0;
			const sum = mod.secondaryStats.reduce(
				(acc, stat) => acc + stat.score.scaledValue,
				0,
			);
			return fromScaled(divScaled(sum, toScaled(mod.secondaryStats.length)));
		},
	),
);

modScores.push(
	createModScore(
		"RollWeightedSecondaries",
		"Roll weighted secondaries",
		`This score is the roll-weighted average of the secondary stat's scores

  Ex:
    (3) Speed      13  - 50%
    (1) Health     256 - 20%
    (1) Protection 760 - 83,17%
    (1) Defense    8   - 71,43%
    => (50% * 3 + 20% * 1 + 83,17% * 1 + 71,43% * 1) / 6 = 54,1%
  `,
		"IsPercentage",
		(mod: Mod) => {
			if (mod.totalRolls === 0) return 0;
			const sum = mod.secondaryStats.reduce(
				(acc, stat) =>
					acc + mulScaled(stat.score.scaledValue, toScaled(stat.rolls)),
				0,
			);
			return fromScaled(divScaled(sum, toScaled(mod.totalRolls)));
		},
	),
);

modScores.push(
	createModScore(
		"GIMOOffense",
		"GIMO Offense",
		`This score is the 'Offense Score' that GIMO provides for a long time to sort your mods.
  It is the sum of scores for the set and the mod's 1° and 2° stats.
  All sets and stats not listed below are scored 0 points.

  set:
    Offense %:         50
    Critical Damage %: 30
    Speed %:           22.5
    Critical Chance %: 20
    Potency %:         20

  stat:
    Speed:             6
    Offense:           0.33
    Offense %:         8
    Critical Damage %: 4
    Critical Chance %: 5
    Potency %:         2.66
    Accuracy %:        1

  Ex:
    (3) Speed      13  - 50%
    (1) Health     256 - 20%
    (1) Protection 760 - 83,17%
    (1) Defense    8   - 71,43%
    => (50% * 3 + 20% * 1 + 83,17% * 1 + 71,43% * 1) / 6 = 54,1%
  `,
		"IsFlat",
		(mod: Mod) => {
			const setScore = {
				"Offense %": 50,
				"Critical Damage %": 30,
				"Speed %": 22.5,
				"Critical Chance %": 20,
				"Potency %": 20,
				"Defense %": 0,
				"Health %": 0,
				"Tenacity %": 0,
			};

			const statScore = {
				Speed: 6,
				Offense: 0.33,
				"Offense %": 8,
				"Critical Damage %": 4,
				"Critical Chance %": 5,
				"Critical Avoidance %": 0,
				Defense: 0,
				"Defense %": 0,
				Health: 0,
				"Health %": 0,
				Protection: 0,
				"Protection %": 0,
				"Potency %": 2.66,
				"Tenacity %": 0,
				"Accuracy %": 1,
			};

			return Number.parseFloat(
				fromScaled(
					(mod.secondaryStats as (PrimaryStat | SecondaryStat)[])
						.concat([mod.primaryStat])
						.reduce(
							(acc, stat) =>
								acc +
								mulScaled(stat.scaledValue, toScaled(statScore[stat.type])),
							toScaled(setScore[mod.modset]),
						),
				).toFixed(2),
			);
		},
	),
);
modScores.push(
	createModScore(
		"Pure6EOffense",
		"Pure 6E Offense",
		`
  `,
		"IsPercentage",
		(mod: Mod) => {
			const isOffenseSecondary = (statType: GIMOSecondaryStatNames) => {
				return ["Offense %", "Critical Chance %"].includes(statType);
			};

			if (
				!["Offense %", "Critical Chance %", "Critical Damage %"].includes(
					mod.modset,
				)
			)
				return 0;
			if (
				["arrow", "triangle", "cross"].includes(mod.slot) &&
				(
					[
						"Defense %",
						"Health %",
						"Critical Avoidance %",
						"Protection %",
						"Potency %",
						"Tenacity %",
						"Speed",
					] as GIMOPrimaryStatNames[]
				).includes(mod.primaryStat.type)
			)
				return 0;
			const extraBadRolls = mod.secondaryStats.reduce(
				(acc, stat) => {
					if (isOffenseSecondary(stat.type)) return acc;
					return acc + stat.rolls;
				},
				-2 + (4 - mod.secondaryStats.length),
			);
			const offenseRolls = mod.secondaryStats.reduce((acc, stat) => {
				if (isOffenseSecondary(stat.type)) return acc + stat.rolls;
				return acc;
			}, 0);
			const sum = mod.secondaryStats.reduce((acc, stat) => {
				const multiplier = isOffenseSecondary(stat.type) ? 1 : 0;
				return (
					acc +
					mulScaled(
						mulScaled(stat.score.scaledValue, toScaled(stat.rolls)),
						toScaled(multiplier),
					)
				);
			}, 0);
			return fromScaled(divScaled(sum, toScaled(offenseRolls + extraBadRolls)));
		},
	),
);

modScores.push(
	createModScore(
		"Pure6EDEfense",
		"Pure 6E Defense",
		`
  `,
		"IsPercentage",
		(mod: Mod) => {
			const isDefenseSecondary = (statType: GIMOSecondaryStatNames) => {
				return ["Health %", "Defense %", "Protection %"].includes(statType);
			};

			if (!["Defense %", "Health %"].includes(mod.modset)) return 0;
			if (
				["arrow", "triangle", "cross"].includes(mod.slot) &&
				(
					[
						"Critical Chance %",
						"Critical Damage %",
						"Accuracy %",
						"Offense %",
						"Potency %",
						"Tenacity %",
						"Speed",
					] as GIMOPrimaryStatNames[]
				).includes(mod.primaryStat.type)
			)
				return 0;
			const extraBadRolls = mod.secondaryStats.reduce(
				(acc, stat) => {
					if (isDefenseSecondary(stat.type)) return acc;
					return acc + stat.rolls;
				},
				-1 + (4 - mod.secondaryStats.length),
			);
			const defenseRolls = mod.secondaryStats.reduce((acc, stat) => {
				if (isDefenseSecondary(stat.type)) return acc + stat.rolls;
				return acc;
			}, 0);
			const sum = mod.secondaryStats.reduce((acc, stat) => {
				const multiplier = isDefenseSecondary(stat.type) ? 1 : 0;
				return (
					acc +
					mulScaled(
						mulScaled(stat.score.scaledValue, toScaled(stat.rolls)),
						toScaled(multiplier),
					)
				);
			}, 0);
			return fromScaled(divScaled(sum, toScaled(defenseRolls + extraBadRolls)));
		},
	),
);
