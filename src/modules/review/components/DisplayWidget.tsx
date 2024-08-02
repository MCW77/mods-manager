// react
import { useDispatch, useSelector } from "react-redux";

// utils
import { flatten, mapValues, uniq } from "lodash-es";
import { groupBy } from "#/utils/groupBy";
import groupByKey from "#/utils/groupByKey";

// state
import {
	reactive,
	useSelector as useLegendSelector,
} from "@legendapp/state/react";
import { characters$ } from "#/modules/characters/state/characters";
import { review$ } from "#/modules/review/state/review";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import { ModLoadout } from "#/domain/ModLoadout";
import type { ModAssignment, ModAssignments } from "#/domain/ModAssignment";
import type { ModsByCharacterNames } from "#/modules/review/domain/ModsByCharacterNames";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Switch } from "#ui/switch";
import * as ModListFilter from "#/modules/review/domain/ModListFilter";

const ReactiveSelect = reactive(Select);
const ReactiveSwitch = reactive(Switch);

const DisplayWidget = () => {
	const dispatch = useDispatch();
	const baseCharactersById = useLegendSelector(characters$.baseCharactersById);
	const profile = useSelector(Storage.selectors.selectActiveProfile);
	const filter = useLegendSelector(review$.modListFilter);

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

	let displayedMods: ModAssignments;
	let tags: string[];
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

			if (ModListFilter.sortOptions.currentCharacter === filter.sort) {
				// collectByKey
				const removedMods: ModsByCharacterNames = groupBy(
					flatten(
						displayedMods.map(({ id, assignedMods }) =>
							assignedMods.filter((mod) => mod.characterID !== id),
						),
					),
					(mod: Mod) => mod.characterID,
				);

				tags = uniq(
					flatten(
						(Object.keys(removedMods) as CharacterNames[]).map((id) =>
							id in baseCharactersById ? baseCharactersById[id].categories : [],
						) as string[][],
					),
				);
			} else {
				tags = uniq(
					flatten(
						displayedMods.map(({ id }) =>
							id in baseCharactersById ? baseCharactersById[id].categories : [],
						),
					),
				);
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

			// Set up the available tags for the sidebar
			tags = Array.from(
				new Set(
					flatten(
						displayedMods.map(({ id }) =>
							baseCharactersById[id] ? baseCharactersById[id].categories : [],
						),
					),
				),
			);

			// Filter out any characters that we're not going to display based on the selected tag
			if (filter.tag !== "All") {
				displayedMods = displayedMods.filter(({ id }) => {
					const tags = baseCharactersById[id]
						? baseCharactersById[id].categories
						: [];
					return tags.includes(filter.tag);
				});
			}
	}
	tags.sort();

	const global =
		"grid gap-3 md:grid-cols-[[labels]auto_[controls]1fr] grid-auto-flow-row items-center justify-items-start" as const;
	const labelCSS = "grid-col-[labels] grid-row-auto" as const;
	const inputCSS = "grid-col-[controls] grid-row-auto" as const;

	return (
		<div className={global}>
			<Label className={labelCSS} htmlFor="sort-options">
				Group by character:
			</Label>
			<div className={`${inputCSS} flex gap-2 items-center`} id="sort-options">
				<Label htmlFor="sort-options-value">current</Label>
				<ReactiveSwitch
					className="mr-2 ml-2"
					id={"sort-options-value"}
					$checked={() =>
						review$.modListFilter.sort.get() ===
						ModListFilter.sortOptions.assignedCharacter
					}
					onCheckedChange={(checked) =>
						review$.modListFilter.sort.set(
							checked
								? ModListFilter.sortOptions.assignedCharacter
								: ModListFilter.sortOptions.currentCharacter,
						)
					}
				/>
				<Label className={labelCSS} htmlFor="sort-options-value">
					assigned
				</Label>
			</div>
			<Label className={labelCSS} htmlFor="view-options">
				Show mods as:
			</Label>
			<div className={`${inputCSS} flex gap-2 items-center`} id="view-options">
				<Label htmlFor="view-options-value">
					{ModListFilter.viewOptions.sets}
				</Label>
				<ReactiveSwitch
					id={"view-options-value"}
					$checked={() =>
						review$.modListFilter.view.get() === ModListFilter.viewOptions.list
					}
					onCheckedChange={(checked) =>
						review$.modListFilter.view.set(
							checked
								? ModListFilter.viewOptions.list
								: ModListFilter.viewOptions.sets,
						)
					}
				/>
				<Label htmlFor="view-options-value">
					{ModListFilter.viewOptions.list}
				</Label>
			</div>
			<Label className={labelCSS} htmlFor={"show"}>
				Show me:
			</Label>
			<ReactiveSelect
				$value={review$.modListFilter.show}
				onValueChange={(value: ModListFilter.ShowOptions) =>
					review$.modListFilter.show.set(value)
				}
			>
				<SelectTrigger className={inputCSS} id={"show"}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={"max-h-[50%]"}>
					<SelectGroup>
						<SelectItem value={ModListFilter.showOptions.all}>
							All assignments
						</SelectItem>
						<SelectItem value={ModListFilter.showOptions.change}>
							Changing characters
						</SelectItem>
						<SelectItem value={ModListFilter.showOptions.upgrades}>
							Mod upgrades
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
			<Label htmlFor={"tag"}>Show characters by tag:</Label>
			<ReactiveSelect
				$value={review$.modListFilter.tag}
				onValueChange={(value) => review$.modListFilter.tag.set(value)}
			>
				<SelectTrigger className={inputCSS} id={"tag"}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={"max-h-[50%]"}>
					<SelectGroup>
						<SelectItem value={"All"}>All</SelectItem>
						{tags.map((tag) => (
							<SelectItem value={tag} key={tag}>
								{tag}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</ReactiveSelect>
		</div>
	);
};

DisplayWidget.displayName = "DisplayWidget";

export { DisplayWidget };
