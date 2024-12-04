// utils
import Big from "big.js";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { ModTiersEnum } from "#/constants/enums";
import type * as ModTypes from "./types/ModTypes";
import { PrimaryStats, SecondaryStats, SetStats } from "./Stats";

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
	modset: SetStats.GIMOStatNames;
	level: ModTypes.Levels;
	pips: ModTypes.Pips;
	primaryStat: PrimaryStats.PrimaryStat;
	secondaryStats: SecondaryStats.SecondaryStat[];
	tier: ModTiersEnum;
	characterID: CharacterNames | "null";
	totalRolls: number;
	maxRoll: number;
	scores: {
		[key: string]: number;
	} = {};
	assignedID: CharacterNames | "null";
	reRolledCount: number;

	static firstTimeSetupOfAccessors = true;

	static reRollPrices = [15, 25, 40, 75, 100, 150];

	static setupCalibrationAccessors() {
		Object.defineProperty(Mod.prototype, "TotalCalibrations", {
			get: function (): number {
				if ((this as Mod).pips < 6) return 0;
				return (this as Mod).tier + 1;
			},
			configurable: true,
		});
		Object.defineProperty(Mod.prototype, "CalibrationPrice", {
			get: function (): number {
				if ((this as Mod).pips < 6) return 0;
				const totalCalibrations = (this as Mod).tier + 1;
				if ((this as Mod).reRolledCount >= totalCalibrations) return 0;
				return Mod.reRollPrices[(this as Mod).reRolledCount];
			},
			configurable: true,
		});
	}

	static setupStatAccessors() {
		for (const stat of SecondaryStats.SecondaryStat.statNames) {
			Object.defineProperty(Mod.prototype, `StatScore${stat}`, {
				get: function (): number {
					const foundStat: SecondaryStats.SecondaryStat | undefined = (
						this as Mod
					).secondaryStats.find(
						(traversedStat: SecondaryStats.SecondaryStat) =>
							traversedStat.type === stat,
					);
					return foundStat ? Number(foundStat.score.value) : 0;
				},
				configurable: true,
			});
			Object.defineProperty(Mod.prototype, `Stat${stat}`, {
				get: function (): number {
					const foundStat: SecondaryStats.SecondaryStat | undefined = (
						this as Mod
					).secondaryStats.find(
						(traversedStat: SecondaryStats.SecondaryStat) =>
							traversedStat.type === stat,
					);
					return foundStat ? foundStat.value : 0;
				},
				configurable: true,
			});
		}
	}

	static setupModScoreAccessors() {
		for (const modScore of modScores) {
			Object.defineProperty(Mod.prototype, `ModScore${modScore.name}`, {
				get: function (): number {
					return (this as Mod).scores[modScore.name] ?? 0;
				},
				configurable: true,
			});
		}
	}

	static setupAccessors(): void {
		Mod.setupModScoreAccessors();
	}

	constructor(
		id: string,
		slot: ModTypes.GIMOSlots,
		modset: SetStats.GIMOStatNames,
		level: ModTypes.Levels,
		pips: ModTypes.Pips,
		primaryStat: PrimaryStats.PrimaryStat,
		secondaryStats: SecondaryStats.SecondaryStat[],
		characterID: CharacterNames | "null",
		reRolledCount: number,
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
		this.tier = tier;
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
			1,
		);
	}

	reRollPrice() {
		const totalCalibrations = this.tier + 1;
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

	getClass() {
		switch (
			Math.floor(Big(this.scores.PureSecondaries).div(Big(20)).toNumber())
		) {
			case 4:
				return "S";
			case 3:
				return "A";
			case 2:
				return "B";
			case 1:
				return "C";
			default:
				return "D";
		}
	}

	static fromHotUtils(flatMod: ModTypes.HUFlatMod) {
		type secondaryPos = "1" | "2" | "3" | "4";
		const secondaryStats: SecondaryStats.SecondaryStat[] = [];
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
					SecondaryStats.SecondaryStat.fromHotUtils(
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
			SetStats.SetStat.HU2GIMOStatNamesMap[flatMod.set],
			flatMod.level,
			flatMod.pips,
			PrimaryStats.PrimaryStat.fromHotUtils(
				flatMod.primaryBonusType,
				flatMod.primaryBonusValue,
			),
			secondaryStats,
			flatMod.characterID ?? "null",
			flatMod.reRolledCount,
			flatMod.tier,
		);
	}

	static deserialize(mod: ModTypes.GIMOFlatMod) {
		const primaryStat = new PrimaryStats.PrimaryStat(
			mod.primaryBonusType,
			mod.primaryBonusValue,
		);
		const secondaryStats: SecondaryStats.SecondaryStat[] = [];

		if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
			secondaryStats.push(
				new SecondaryStats.SecondaryStat(
					"1",
					mod.secondaryType_1,
					mod.secondaryValue_1,
					+(mod.secondaryRoll_1 ?? 1) as SecondaryStats.Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
			secondaryStats.push(
				new SecondaryStats.SecondaryStat(
					"2",
					mod.secondaryType_2,
					mod.secondaryValue_2,
					+(mod.secondaryRoll_2 ?? 1) as SecondaryStats.Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
			secondaryStats.push(
				new SecondaryStats.SecondaryStat(
					"3",
					mod.secondaryType_3,
					mod.secondaryValue_3,
					+(mod.secondaryRoll_3 ?? 1) as SecondaryStats.Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
			secondaryStats.push(
				new SecondaryStats.SecondaryStat(
					"4",
					mod.secondaryType_4,
					mod.secondaryValue_4,
					+(mod.secondaryRoll_4 ?? 1) as SecondaryStats.Rolls,
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
			mod.tier,
		);
	}
}

Mod.setupStatAccessors();
Mod.setupCalibrationAccessors();

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
			return mod.secondaryStats
				.reduce((acc, stat) => acc.plus(stat.score.value), Big(0))
				.div(mod.secondaryStats.length)
				.toNumber();
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
			return mod.secondaryStats
				.reduce(
					(acc, stat) => acc.plus(stat.score.value.mul(stat.rolls)),
					Big(0),
				)
				.div(mod.totalRolls)
				.toNumber();
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
				(
					mod.secondaryStats as (
						| PrimaryStats.PrimaryStat
						| SecondaryStats.SecondaryStat
					)[]
				)
					.concat([mod.primaryStat])
					.reduce(
						(acc, stat) => acc.plus(stat.bigValue.mul(statScore[stat.type])),
						Big(setScore[mod.modset]),
					)
					.toFixed(2),
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
			const isOffenseSecondary = (statType: SecondaryStats.GIMOStatNames) => {
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
					] as PrimaryStats.GIMOStatNames[]
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
			return mod.secondaryStats
				.reduce(
					(acc, stat) =>
						acc.plus(
							stat.score.value
								.mul(stat.rolls)
								.mul(isOffenseSecondary(stat.type) ? 1 : 0),
						),
					Big(0),
				)
				.div(offenseRolls + extraBadRolls)
				.toNumber();
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
			const isDefenseSecondary = (statType: SecondaryStats.GIMOStatNames) => {
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
					] as PrimaryStats.GIMOStatNames[]
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
			return mod.secondaryStats
				.reduce(
					(acc, stat) =>
						acc.plus(
							stat.score.value
								.mul(stat.rolls)
								.mul(isDefenseSecondary(stat.type) ? 1 : 0),
						),
					Big(0),
				)
				.div(defenseRolls + extraBadRolls)
				.toNumber();
		},
	),
);
// #endregion ModScores
