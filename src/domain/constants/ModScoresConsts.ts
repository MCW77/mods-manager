import type { Mod } from "../Mod";
import ModScore from "../ModScore";
import type { PrimaryStats, SecondaryStats } from "../Stats";
import Big from "big.js";

export const modScores: ModScore[] = [];

modScores.push(
	new ModScore(
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
	new ModScore(
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
	new ModScore(
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
						Big(setScore[mod.set]),
					)
					.toFixed(2),
			);
		},
	),
);

modScores.push(
	new ModScore(
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
					mod.set,
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
	new ModScore(
		"Pure6EDEfense",
		"Pure 6E Defense",
		`
  `,
		"IsPercentage",
		(mod: Mod) => {
			const isDefenseSecondary = (statType: SecondaryStats.GIMOStatNames) => {
				return ["Health %", "Defense %", "Protection %"].includes(statType);
			};

			if (!["Defense %", "Health %"].includes(mod.set)) return 0;
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
