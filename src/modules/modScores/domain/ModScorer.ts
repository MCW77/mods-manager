// utils
import {
	toScaled,
	fromScaled,
	mulScaled,
	divScaled,
} from "#/utils/scaledNumber";

// domain
import type {
	GIMOPrimaryStatNames,
	GIMOSecondaryStatNames,
} from "#/domain/GIMOStatNames";
import type { Mod } from "#/domain/Mod";
import type { PrimaryStat } from "#/domain/PrimaryStat";
import type { SecondaryStat } from "#/domain/SecondaryStat";


interface ModScorer {
	name: string;
	displayName: string;
	description: string;
	isFlatOrPercentage: "IsPercentage" | "IsFlat";
	scoringAlgorithm: (mod: Mod) => number;
}

function createModScorer(
	name: string,
	displayName: string,
	description: string,
	isFlatOrPercentage: "IsPercentage" | "IsFlat",
	scoringAlgorithm: (mod: Mod) => number,
): ModScorer {
	return {
		name,
		displayName,
		description,
		isFlatOrPercentage,
		scoringAlgorithm,
	};
}

export const modScorers: Map<string, ModScorer> = new Map();

modScorers.set(
	"PureSecondaries",
	createModScorer(
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

modScorers.set(
	"RollWeightedSecondaries",
	createModScorer(
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

modScorers.set(
	"GIMOOffense",
	createModScorer(
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
modScorers.set(
	"Pure6EOffense",
	createModScorer(
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

modScorers.set(
	"Pure6EDefense",
	createModScorer(
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
