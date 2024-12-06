// react
import React, { lazy } from "react";

// styles
import "./ModLoadoutDetail.css";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const optimizationSettings$ = stateLoader$.optimizationSettings$;

// domain
import type * as Character from "#/domain/Character";
import type {
	CalculatedCharacterSummaryStatNames,
	GIMOCharacterSummaryStatNames,
} from "#/domain/GIMOStatNames";
import type { ModLoadout } from "#/domain/ModLoadout";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";
import { CharacterSummaryStats as CSStats } from "#/domain/Stats";
import type { TargetStat } from "#/domain/TargetStat";

import type { MissedGoals } from "#/modules/compilations/domain/MissedGoals";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";
import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";

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

type PlayerStats = {
	[key in
		| GIMOCharacterSummaryStatNames
		| CalculatedCharacterSummaryStatNames]: PlayerStat;
};

type ComponentProps = {
	oldLoadout: ModLoadout;
	newLoadout: ModLoadout;
	showAvatars: boolean;
	character: Character.Character;
	target: OptimizationPlan.OptimizationPlan;
	useUpgrades: boolean;
	assignedCharacter: Character.Character;
	assignedTarget: OptimizationPlan.OptimizationPlan;
	missedGoals: MissedGoals;
};

const ModLoadoutDetail = React.memo(
	({
		oldLoadout,
		newLoadout,
		showAvatars = false,
		character,
		target,
		useUpgrades,
		assignedCharacter,
		assignedTarget,
		missedGoals = [],
	}: ComponentProps) => {
		const addCalculatedStatsToPlayerValues = (
			playerStats: PlayerStat[],
			missedGoals: MissedGoals,
		) => {
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
					stat = new CSStats.CharacterSummaryStat(
						statName,
						`${statIncrease % 1 ? Math.round(statIncrease * 100) / 100 : statIncrease}`,
					);

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
		addCalculatedStatsToPlayerValues(playerStats, missedGoals);

		const statsDisplay = playerStats.map((stat, index) => {
			if (stat.recommendedValue == null) {
				return (
					<tr key={stat.name}>
						<td className={"stat-type"}>{stat.name}</td>
						<td className={"stat-value"}>???(???)</td>
						{stat.diffStat && (
							<td
								className={`stat-diff${stat.diffStat.value > 0 ? " increase" : stat.diffStat.value < 0 ? " decrease" : ""}`}
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
				<tr key={stat.name}>
					<td
						className={`stat-type ${missedMessage ? "red-text" : ""}`}
						title={missedMessage}
					>
						{stat.name}
					</td>
					{stat.diffStat && (
						<td className={"stat-value"}>
							<span className={"total-value"}>
								{stat.currentValue % 1
									? stat.currentValue.toFixed(2)
									: stat.currentValue}
								{stat.displayModifier}{" "}
							</span>
							{stat.currentStat && (
								<span className={"mods-value"}>
									({stat.currentStat.showValue()})
								</span>
							)}
						</td>
					)}
					<td className={"stat-value"}>
						<span
							className={`total-value ${missedMessage ? "red-text" : ""}`}
							title={missedMessage}
						>
							{stat.recommendedValue % 1
								? stat.recommendedValue.toFixed(2)
								: stat.recommendedValue}
							{stat.displayModifier}{" "}
						</span>
						{stat.recommendedStat && (
							<span className={"mods-value"}>
								({stat.recommendedStat.showValue()})
							</span>
						)}
					</td>
					<td
						className={`optimizer-value ${stat.optimizationValue > 0 ? "increase" : stat.optimizationValue < 0 ? "decrease" : ""}`}
					>
						{(stat.optimizationValue || 0).toFixed(2)}
					</td>
					{stat.diffStat && (
						<td
							className={`stat-diff${stat.diffStat.value > 0 ? " increase" : stat.diffStat.value < 0 ? " decrease" : ""}`}
						>
							{stat.diffStat.showValue()}
						</td>
					)}
				</tr>
			);
		});

		const oldValue = optimizationSettings$.getOptimizationValue(
			oldLoadout,
			character,
			target,
			false,
		);
		const newValue = optimizationSettings$.getOptimizationValue(
			newLoadout,
			character,
			target,
			useUpgrades,
		);
		const valueChange =
			oldValue === 0
				? Number.POSITIVE_INFINITY
				: (100 * newValue) / oldValue - 100;

		return (
			<div className={"mod-set-detail"}>
				<ModLoadoutView
					modLoadout={newLoadout}
					showAvatars={showAvatars}
					assignedCharacter={assignedCharacter}
					assignedTarget={assignedTarget}
				/>
				<div className={"summary"}>
					<table>
						<thead>
							<tr>
								<th colSpan={oldLoadout ? 5 : 4}>Stats Summary</th>
							</tr>
							<tr>
								<th />
								<th>Current</th>
								<th>Recommended</th>
								<th>Value</th>
								<th>Change</th>
							</tr>
						</thead>
						<tbody>{statsDisplay}</tbody>
					</table>
				</div>
				<div className={"set-value"}>
					{oldLoadout && <div>Previous Set Value: {oldValue.toFixed(2)}</div>}
					<div>Total Value of Set: {newValue.toFixed(2)}</div>
					{oldLoadout && (
						<div>
							Value Change:&nbsp;
							<span
								className={
									valueChange > 0
										? "increase"
										: valueChange < 0
											? "decrease"
											: ""
								}
							>
								{valueChange.toFixed(2)}%
							</span>
						</div>
					)}
				</div>
			</div>
		);
	},
);

ModLoadoutDetail.displayName = "ModLoadoutDetail";

export default ModLoadoutDetail;
