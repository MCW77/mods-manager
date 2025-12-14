// react
import React, { lazy } from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const charactersManagement$ = stateLoader$.charactersManagement$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;

// domain
import type * as Character from "#/domain/Character";
import type { ModLoadout } from "#/domain/ModLoadout";
import { CharacterSummaryStats as CSStats } from "#/domain/Stats";
import type { TargetStat } from "#/domain/TargetStat";

import type { CharacterModding } from "#/modules/compilations/domain/CharacterModdings";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";

// components
const ModLoadoutView = lazy(
	() => import("#/components/ModLoadoutView/ModLoadoutView"),
);

interface PlayerStat {
	name: CSStats.DisplayStatNames;
	displayModifier: string;
	currentValue: number;
	currentStat: CSStats.CharacterSummaryStat | null;
	recommendedValue: number;
	optimizationValue: number;
	recommendedStat: CSStats.CharacterSummaryStat | null;
	diffStat: CSStats.CharacterSummaryStat | null;
	missedGoal: [TargetStat, number] | undefined;
}

type ComponentProps = {
	character: Character.Character;
	oldLoadout: ModLoadout;
	newLoadout: ModLoadout;
	useUpgrades: boolean;
	modAssignment: CharacterModding;
};

const ModLoadoutDetail = React.memo(
	({
		character,
		oldLoadout,
		newLoadout,
		useUpgrades,
		modAssignment: { target, missedGoals, previousScore, currentScore },
	}: ComponentProps) => {
		const addCalculatedStatsToPlayerValues = (playerStats: PlayerStat[]) => {
			const currentStats = {
				health: 0,
				protection: 0,
				armor: 0,
				resistance: 0,
				physDamage: 0,
				specDamage: 0,
				physCritChance: 0,
				specCritChance: 0,
				critDamage: 0,
			};
			const recommendedStats = {
				health: 0,
				protection: 0,
				armor: 0,
				resistance: 0,
				physDamage: 0,
				specDamage: 0,
				physCritChance: 0,
				specCritChance: 0,
				critDamage: 0,
			};

			for (const stat of playerStats) {
				switch (stat.name) {
					case "Health":
						currentStats.health = stat.currentValue;
						recommendedStats.health = stat.recommendedValue;
						break;
					case "Protection":
						currentStats.protection = stat.currentValue;
						recommendedStats.protection = stat.recommendedValue;
						break;
					case "Armor":
						currentStats.armor = stat.currentValue;
						recommendedStats.armor = stat.recommendedValue;
						break;
					case "Resistance":
						currentStats.resistance = stat.currentValue;
						recommendedStats.resistance = stat.recommendedValue;
						break;
					case "Physical Damage":
						currentStats.physDamage = stat.currentValue;
						recommendedStats.physDamage = stat.recommendedValue;
						break;
					case "Physical Critical Chance":
						currentStats.physCritChance = stat.currentValue;
						recommendedStats.physCritChance = stat.recommendedValue;
						break;
					case "Special Damage":
						currentStats.specDamage = stat.currentValue;
						recommendedStats.specDamage = stat.recommendedValue;
						break;
					case "Special Critical Chance":
						currentStats.specCritChance = stat.currentValue;
						recommendedStats.specCritChance = stat.recommendedValue;
						break;
					case "Critical Damage":
						currentStats.critDamage = stat.currentValue;
						recommendedStats.critDamage = stat.recommendedValue;
						break;
					default:
						break;
				}
			}

			const currentEffectiveHealthPhysical =
				(currentStats.health + currentStats.protection) /
				(1 - currentStats.armor / 100);
			const recommendedEffectiveHealthPhysical =
				(recommendedStats.health + recommendedStats.protection) /
				(1 - recommendedStats.armor / 100);
			const currentEffectiveHealthSpecial =
				(currentStats.health + currentStats.protection) /
				(1 - currentStats.resistance / 100);
			const recommendedEffectiveHealthSpecial =
				(recommendedStats.health + recommendedStats.protection) /
				(1 - recommendedStats.resistance / 100);
			const currentAverageDamagePhysical =
				currentStats.physDamage *
				(1 -
					currentStats.physCritChance / 100 +
					(currentStats.critDamage / 100) *
						(currentStats.physCritChance / 100));
			const recommendedAverageDamagePhysical =
				recommendedStats.physDamage *
				(1 -
					recommendedStats.physCritChance / 100 +
					(recommendedStats.critDamage / 100) *
						(recommendedStats.physCritChance / 100));
			const currentAverageDamageSpecial =
				currentStats.specDamage *
				(1 -
					currentStats.specCritChance / 100 +
					(currentStats.critDamage / 100) *
						(currentStats.specCritChance / 100));
			const recommendedAverageDamageSpecial =
				recommendedStats.specDamage *
				(1 -
					recommendedStats.specCritChance / 100 +
					(recommendedStats.critDamage / 100) *
						(recommendedStats.specCritChance / 100));

			const statObject = (
				name: CSStats.CalculatedStatNames,
				currentValue: number,
				recommendedValue: number,
			): PlayerStat => ({
				name: name,
				displayModifier: "",
				currentValue: Math.floor(currentValue),
				currentStat: null,
				recommendedValue: Math.floor(recommendedValue),
				optimizationValue: 0,
				recommendedStat: null,
				diffStat: new CSStats.CharacterSummaryStat(
					name,
					`${Math.floor(recommendedValue - currentValue)}`,
				),
				missedGoal: undefined,
			});

			playerStats.push(
				statObject(
					"Effective Health (physical)",
					currentEffectiveHealthPhysical,
					recommendedEffectiveHealthPhysical,
				),
			);
			playerStats.push(
				statObject(
					"Effective Health (special)",
					currentEffectiveHealthSpecial,
					recommendedEffectiveHealthSpecial,
				),
			);
			playerStats.push(
				statObject(
					"Average Damage (physical)",
					currentAverageDamagePhysical,
					recommendedAverageDamagePhysical,
				),
			);
			playerStats.push(
				statObject(
					"Average Damage (special)",
					currentAverageDamageSpecial,
					recommendedAverageDamageSpecial,
				),
			);
		};

		const newSummary = optimizationSettings$.getSummary(
			newLoadout,
			character,
			useUpgrades,
		);
		const oldSummary = optimizationSettings$.getSummary(
			oldLoadout,
			character,
			false,
		);

		// Pull all the player's stats into an object that can be displayed without further calculation.
		const playerStats: PlayerStat[] = Object.values(newSummary).map(
			(stat: CSStats.CharacterSummaryStat) => {
				const diffStat = stat.minus(
					oldSummary[stat.type as CharacterStatNames.All],
				);
				const statName: CharacterStatNames.All =
					stat.type as CharacterStatNames.All;
				let statValue =
					character.playerValues.equippedStats[statName] + stat.value;

				let originalStat = oldSummary[stat.type as CharacterStatNames.All];
				let originalStatValue =
					character.playerValues.equippedStats[statName] + originalStat.value;
				const optimizationValue = charactersManagement$.getOptimizationValue(
					character,
					target,
					stat,
				);

				if (["Armor", "Resistance"].includes(statName)) {
					// Convert armor and resistance to percent stats
					const baseStat = character.playerValues.equippedStats[statName];
					const baseStatValue =
						(100 * baseStat) / (character.playerValues.level * 7.5 + baseStat);

					statValue =
						(100 * statValue) /
						(character.playerValues.level * 7.5 + statValue);

					const statIncrease = statValue - baseStatValue;
					stat.value =
						statIncrease % 1
							? Math.round(statIncrease * 100) / 100
							: statIncrease;

					if (originalStat) {
						originalStatValue =
							(100 * originalStatValue) /
							(character.playerValues.level * 7.5 + originalStatValue);
						const originalStatIncrease = originalStatValue - baseStatValue;
						originalStat = new CSStats.CharacterSummaryStat(
							statName,
							`${originalStatIncrease % 1 ? Math.round(originalStatIncrease * 100) / 100 : originalStatIncrease}`,
						);
					}
				}

				return {
					name: stat.getDisplayType(),
					displayModifier: stat.displayModifier,
					currentValue: originalStatValue,
					currentStat: originalStat,
					recommendedValue: statValue,
					optimizationValue: optimizationValue,
					recommendedStat: stat,
					diffStat: diffStat,
					missedGoal: missedGoals.find(
						([goal]) => goal.stat === stat.getDisplayType(),
					),
				};
			},
		);

		// Add effective health and average damage to the stats display
		addCalculatedStatsToPlayerValues(playerStats);

		const statsDisplay = playerStats.map((stat) => {
			if (stat.recommendedValue == null) {
				return (
					<tr key={stat.name}>
						<td className={"p-x-[0.5em] p-y-[0.2em] text-[0.95em] text-left"}>
							{stat.name}
						</td>
						<td className={"p-x-[0.5em] p-y-[0.2em] text-[0.95em] text-white"}>
							???(???)
						</td>
						{stat.diffStat && (
							<td
								className={`${stat.diffStat.value > 0 ? "text-green-500 after:content-['+']" : stat.diffStat.value < 0 ? "text-red-500" : ""}`}
							>
								{stat.diffStat.showValue()}
							</td>
						)}
					</tr>
				);
			}

			const missedMessage = stat.missedGoal
				? `Value must be between ${stat.missedGoal[0].minimum} and ${stat.missedGoal[0].maximum}`
				: undefined;

			return (
				<tr className={"odd:bg-cyan-950 even:bg-sky-900"} key={stat.name}>
					<td
						className={`p-x-[0.5em] p-y-[0.2em] text-[0.95em] text-left ${missedMessage ? "text-red-600" : ""}`}
						title={missedMessage}
					>
						{stat.name}
					</td>
					{stat.diffStat && (
						<td
							className={
								"w-[9em] p-x-[0.5em] p-y-[0.2em] text-[0.95em] text-white text-right"
							}
						>
							<span className={"total-value"}>
								{stat.currentValue % 1
									? stat.currentValue.toFixed(2)
									: stat.currentValue}
								{stat.displayModifier}{" "}
							</span>
							{stat.currentStat && (
								<span className={"text-teal-400"}>
									({stat.currentStat.showValue()})
								</span>
							)}
						</td>
					)}
					<td
						className={
							"w-[9em] p-x-[0.5em] p-y-[0.2em] text-[0.95em] text-white text-right"
						}
					>
						<span
							className={`total-value ${missedMessage ? "text-red-600" : ""}`}
							title={missedMessage}
						>
							{stat.recommendedValue % 1
								? stat.recommendedValue.toFixed(2)
								: stat.recommendedValue}
							{stat.displayModifier}{" "}
						</span>
						{stat.recommendedStat && (
							<span className={"text-teal-400"}>
								({stat.recommendedStat.showValue()})
							</span>
						)}
					</td>
					<td
						className={`w-[3.2em] p-x-[0.5em] p-y-[0.2em] text-[0.95em] ${stat.optimizationValue > 0 ? "text-green-500 after:content-['+']" : stat.optimizationValue < 0 ? "text-red-500" : ""}`}
					>
						{(stat.optimizationValue || 0).toFixed(2)}
					</td>
					{stat.diffStat && (
						<td
							className={`w-[4em] p-x-[0.5em] p-y-[0.2em] text-[0.95em] ${stat.diffStat.value > 0 ? "text-green-500 after:content-['+']" : stat.diffStat.value < 0 ? "text-red-500" : ""}`}
						>
							{stat.diffStat.showValue()}
						</td>
					)}
				</tr>
			);
		});

		const valueChange =
			previousScore === 0
				? Number.POSITIVE_INFINITY
				: (100 * currentScore) / previousScore - 100;

		return (
			<div
				className={
					"mod-set-detail relative flex gap-2 border-1 border-solid border-blue-500 p-2 bg-blue-200 dark:bg-blue-900 dark:bg-opacity-40 text-foreground text-shadow-md"
				}
			>
				<ModLoadoutView modLoadout={newLoadout} assignedTarget={target} />
				<div className={"summary flex flex-col gap-4"}>
					<table>
						<thead>
							<tr>
								<th
									className={"text-center bg-sky-500"}
									colSpan={oldLoadout ? 5 : 4}
								>
									Stats Summary
								</th>
							</tr>
							<tr>
								<th className={"text-center bg-sky-500"} />
								<th className={"text-center bg-sky-500"}>Current</th>
								<th className={"text-center bg-sky-500"}>Recommended</th>
								<th className={"text-center bg-sky-500"}>Value</th>
								<th className={"text-center bg-sky-500"}>Change</th>
							</tr>
						</thead>
						<tbody>{statsDisplay}</tbody>
					</table>
					<div>
						{oldLoadout && (
							<div>Previous Set Value: {previousScore.toFixed(2)}</div>
						)}
						<div>Total Value of Set: {currentScore.toFixed(2)}</div>
						{oldLoadout && (
							<div>
								Value Change:&nbsp;
								<span
									className={
										valueChange > 0
											? "text-green-500 after:content-['+']"
											: valueChange < 0
												? "text-red-500"
												: ""
									}
								>
									{valueChange.toFixed(2)}%
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	},
);

ModLoadoutDetail.displayName = "ModLoadoutDetail";

export default ModLoadoutDetail;
