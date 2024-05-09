// react
import React from "react";
import { connect, type ConnectedProps } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import "./Review.css";

// utils
import { flatten, mapValues } from "lodash-es";
import collectByKey from "#/utils/collectByKey";
import { groupBy } from "#/utils/groupBy";
import groupByKey from "#/utils/groupByKey";

// state
import type { IAppState } from "#/state/storage";
import { Show } from "@legendapp/state/react";
import { review$ } from "#/modules/review/state/review";

// modules
import { Data } from "#/state/modules/data";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { ModsByCharacterNames } from "../domain/ModsByCharacterNames";
import type { CharacterNames } from "#/constants/characterSettings";
import type * as ModTypes from "#/domain/types/ModTypes";

import type { Mod } from "#/domain/Mod";
import type { ModAssignment, ModAssignments } from "#/domain/ModAssignment";
import { ModLoadout } from "#/domain/ModLoadout";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { ActionsWidget } from "../components/ActionsWidget";
import { DisplayWidget } from "../components/DisplayWidget";
import { ListView } from "../components/ListView";
import { SetsView } from "../components/SetsView";
import { SummaryWidget } from "../components/SummaryWidget";
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
	1: 550,
	2: 1050,
	3: 1900,
	4: 3000,
	5: 4750,
	6: 8000,
};

// A map from number of pips to a map from current mod level to the total cost to upgrade the mod to level 15
const modUpgradeCosts: {
	[key in ModTypes.Pips]: {
		[key2 in ModTypes.Levels]: number;
	};
} = {
	6: {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
		11: 0,
		12: 0,
		13: 0,
		14: 0,
		15: 0,
	},
	5: {
		1: 248400,
		2: 244950,
		3: 241500,
		4: 238050,
		5: 234600,
		6: 229950,
		7: 224300,
		8: 218500,
		9: 210500,
		10: 200150,
		11: 189800,
		12: 162200,
		13: 126550,
		14: 90900,
		15: 0,
	},
	4: {
		1: 128700,
		2: 126900,
		3: 124200,
		4: 121500,
		5: 118800,
		6: 116100,
		7: 113400,
		8: 110700,
		9: 106200,
		10: 100800,
		11: 95400,
		12: 81000,
		13: 64800,
		14: 46800,
		15: 0,
	},
	3: {
		1: 73200,
		2: 72000,
		3: 70800,
		4: 69600,
		5: 67800,
		6: 66000,
		7: 64200,
		8: 62400,
		9: 60000,
		10: 57000,
		11: 54000,
		12: 45600,
		13: 35400,
		14: 24000,
		15: 0,
	},
	2: {
		1: 28800,
		2: 28050,
		3: 27300,
		4: 26550,
		5: 25800,
		6: 24675,
		7: 23550,
		8: 22425,
		9: 21300,
		10: 19800,
		11: 18300,
		12: 16500,
		13: 12700,
		14: 8200,
		15: 0,
	},
	1: {
		1: 13400,
		2: 13050,
		3: 12700,
		4: 12350,
		5: 12000,
		6: 11475,
		7: 10950,
		8: 10425,
		9: 9900,
		10: 9200,
		11: 8500,
		12: 7625,
		13: 5875,
		14: 3775,
		15: 0,
	},
};

class Review extends React.PureComponent<Props> {
	render() {
		return (
			<div className={"review flex flex-col flex-grow-1 overflow-y-auto"}>
				<div
					className={
						"flex flex-col justify-around items-stretch p-y-2 min-h-min"
					}
				>
					<div className="flex flex-wrap justify-around items-stretch p-y-2">
            <DefaultCollapsibleCard title="Display">
              <DisplayWidget />
            </DefaultCollapsibleCard>
            <DefaultCollapsibleCard title="Actions">
              <ActionsWidget />
            </DefaultCollapsibleCard>
            <DefaultCollapsibleCard className="" title="Summary">
              <SummaryWidget
                currentSetValue={this.props.currentSetValue}
                newSetValue={this.props.newSetValue}
                modRemovalCost={this.props.modRemovalCost}
                modUpgradeCost={this.props.modUpgradeCost}
                numMovingMods={this.props.numMovingMods}
              />
            </DefaultCollapsibleCard>
					</div>
					<div className="overflow-y-auto">
						<Show
							if={() => 0 === this.props.displayedMods.length}
							else={
								<div className={"flex flex-col min-h-min"}>
									<Show if={this.props.filter.view} else={<SetsView modAssignments={this.props.displayedMods} />}>
										<ListView displayedMods={this.props.displayedMods} />
									</Show>
								</div>
							}
						>
							<Show
								if={() => 0 === this.props.numMovingMods}
								else={<h3>No more mods to move under that filter. Try a different filter now!</h3>}
							>
								<div>
									<h2>You don't have any mods left to move! Great job!</h2>
									<h3>Don't forget to assign mods to all your pilots!</h3>
								</div>
							</Show>
						</Show>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	const baseCharacters = Data.selectors.selectBaseCharacters(state);

	const getModAssignmentsByCurrentCharacter = (
		modAssignments: ModAssignments,
	): ModAssignments => {
		const tempAssignments = modAssignments;

		// If we're only showing upgrades, then filter out any mod that isn't being upgraded
		if (ModListFilter.showOptions.upgrades === filter.show) {
			/*
      tempAssignments = modAssignments.map(({ id, target, assignedMods, missedGoals }) => ({
        id: id,
        target: target,
        assignedMods:
          assignedMods.filter(mod => mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target)),
        missedGoals: missedGoals,
      }));
*/
			for (const assignment of tempAssignments) {
				assignment.assignedMods = assignment.assignedMods.filter(
					(mod) =>
						mod.shouldLevel(assignment.target) ||
						mod.shouldSlice(
							profile.characters[assignment.id],
							assignment.target,
						),
				);
			}
		}
		// Filter out any mods that aren't moving
		const mods = tempAssignments.map(({ id, assignedMods }) =>
			assignedMods.filter((mod) => mod.characterID !== id),
		);

		const modsByCharacterNames: ModsByCharacterNames = groupBy(
			flatten(mods),
			(mod: Mod) => mod.characterID,
		);

		// Then, turn that into the same format as modAssignments - an array of {id, assignedMods}
		const result: ModAssignments = Object.values(
			mapValues<ModsByCharacterNames, ModAssignment>(
				modsByCharacterNames,
				(mods: Mod[], id: string): ModAssignment => ({
					id: id as CharacterNames,
					assignedMods: mods,
					target: OptimizationPlan.createOptimizationPlan("xyz"),
					missedGoals: [],
				}),
			),
		);

		return result;
	};

	const profile = state.profile;
	const filter = review$.modListFilter.get();
	const modsById = groupByKey(profile.mods, (mod) => mod.id);
	const modAssignments: ModAssignments = profile.modAssignments
		.filter((x) => null !== x)
		.map(({ id, target, assignedMods, missedGoals }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods
				? assignedMods.map((id) => modsById[id]).filter((mod) => !!mod)
				: [],
			missedGoals: missedGoals || [],
		})) as ModAssignments;

	const currentModsByCharacter: {
		[key in CharacterNames]: Mod[];
	} = collectByKey(
		profile.mods.filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);
	const numMovingMods = modAssignments.reduce(
		(count, { id, assignedMods }) =>
			assignedMods.filter((mod) => mod.characterID !== id).length + count,
		0,
	);

	const currentLoadoutValue = modAssignments
		.map(({ id, target }) =>
			Object.keys(currentModsByCharacter).includes(id)
				? new ModLoadout(currentModsByCharacter[id]).getOptimizationValue(
						profile.characters[id],
						target,
						false,
					)
				: 0,
		)
		.reduce((a, b) => a + b, 0);
	const newLoadoutValue = modAssignments
		.map(({ id, target, assignedMods }) =>
			new ModLoadout(assignedMods).getOptimizationValue(
				profile.characters[id],
				target,
				true,
			),
		)
		.reduce((a, b) => a + b, 0);

	let displayedMods: ModAssignments;
	switch (filter.view) {
		case ModListFilter.viewOptions.list:
			if (ModListFilter.showOptions.upgrades === filter.show) {
				// If we're showing mods as a list and showing upgrades, show any upgraded mod, no matter if it's moving or not
				displayedMods = modAssignments
					.map(({ id, target, assignedMods }) => ({
						id: id,
						target: target,
						assignedMods: assignedMods.filter(
							(mod) =>
								mod.shouldLevel(target) ||
								mod.shouldSlice(profile.characters[id], target),
						),
						missedGoals: [],
					}))
					.filter(({ assignedMods }) => assignedMods.length > 0);
			} else {
				// If we're not showing upgrades, then only show mods that aren't already assigned to that character
				displayedMods = modAssignments.map(({ id, target, assignedMods }) => ({
					id: id,
					target: target,
					assignedMods: assignedMods
						.filter((mod) => mod.characterID !== id)
						.sort(ModLoadout.slotSort),
					missedGoals: [],
				}));
			}
			break;
		default:
			// If we're displaying as sets, but sorting by current character, we need to rework the modAssignments
			// so that they're organized by current character rather than assigned character
			if (ModListFilter.sortOptions.currentCharacter === filter.sort) {
				displayedMods = getModAssignmentsByCurrentCharacter(modAssignments);
			} else if (ModListFilter.showOptions.change === filter.show) {
				// If we're only showing changes, then filter out any character that isn't changing
				displayedMods = modAssignments.filter(({ id, assignedMods }) =>
					assignedMods.some((mod) => mod.characterID !== id),
				);
			} else if (ModListFilter.showOptions.upgrades === filter.show) {
				// If we're only showing upgrades, then filter out any character that doesn't have at least one upgrade
				displayedMods = modAssignments.filter(({ id, target, assignedMods }) =>
					assignedMods.some(
						(mod) =>
							mod.shouldLevel(target) ||
							mod.shouldSlice(profile.characters[id], target),
					),
				);
			} else {
				displayedMods = modAssignments;
			}

			// Filter out any characters that we're not going to display based on the selected tag
			if (filter.tag !== "All") {
				displayedMods = displayedMods.filter(({ id }) => {
					const tags = baseCharacters[id] ? baseCharacters[id].categories : [];
					return tags.includes(filter.tag);
				});
			}
	}

	const movingModsByAssignedCharacter = modAssignments
		.map(({ id, target, assignedMods }) => ({
			id: id,
			target: target,
			assignedMods: assignedMods.filter((mod) => mod.characterID !== id),
      missedGoals: [],
		}))
		.filter(({ assignedMods }) => assignedMods.length);

	const movingMods = flatten(
		movingModsByAssignedCharacter.map(({ assignedMods }) => assignedMods),
	).filter((mod) => mod.characterID);

	// Mod cost is the cost of all mods that are being REMOVED. Every mod
	// being assigned to a new character (so that isn't already unassigned) is
	// being removed from that character. Then, any mods that used to be equipped
	// are also being removed.
	const removedMods = flatten(
		movingModsByAssignedCharacter.map(({ id, assignedMods }) => {
			const changingSlots = assignedMods.map((mod) => mod.slot);
			return currentModsByCharacter[id]
				? currentModsByCharacter[id].filter((mod) =>
						changingSlots.includes(mod.slot),
					)
				: [];
		}),
	).filter((mod) => !movingMods.includes(mod));

	const modCostBasis = movingMods.concat(removedMods);
	// Get a count of how much it will cost to move the mods. It only costs money to remove mods
	const modRemovalCost = modCostBasis.reduce(
		(cost, mod) => cost + modRemovalCosts[mod.pips],
		0,
	);

	const modsBeingUpgraded = modAssignments
		.filter(({ target }) => OptimizationPlan.shouldUpgradeMods(target))
		.map(({ id, assignedMods }) =>
			assignedMods.filter((mod) => 15 !== mod.level),
		)
		.reduce((allMods, characterMods) => allMods.concat(characterMods), []);

	const modUpgradeCost = modsBeingUpgraded.reduce(
		(cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level],
		0,
	);

	/**
	 * {{
	 *   displayedMods: [[CharacterID, Mod]]
	 * }}
	 */
	return {
		assignedMods: profile.modAssignments ?? [],
		currentSetValue: currentLoadoutValue,
		newSetValue: newLoadoutValue,
		characters: profile.characters ?? {},
		baseCharacters: baseCharacters,
		currentModsByCharacter: currentModsByCharacter,
		displayedMods: displayedMods,
		movingModAssignments: movingModsByAssignedCharacter,
		modRemovalCost: modRemovalCost,
		modUpgradeCost: modUpgradeCost,
		numMovingMods: numMovingMods,
		filter: review$.modListFilter.get(),
	};
};

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({});

type Props = PropsFromRedux;
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Review);
