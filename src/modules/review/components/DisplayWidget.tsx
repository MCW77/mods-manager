// react
import { reactive, use$ } from "@legendapp/state/react";
import { useId } from "react";

// utils
import flatten from "lodash-es/flatten.js";
import mapValues from "lodash-es/mapValues.js";
import uniq from "lodash-es/uniq.js";
import { groupBy } from "#/utils/groupBy.js";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const characters$ = stateLoader$.characters$;

import { review$ } from "#/modules/review/state/review.js";

// domain
import type { CharacterNames } from "#/constants/CharacterNames.js";

import type { Mod } from "#/domain/Mod.js";
import * as ModLoadout from "#/domain/ModLoadout.js";
import * as OptimizationPlan from "#/domain/OptimizationPlan.js";

import type {
	CharacterModding,
	CharacterModdings,
} from "#/modules/compilations/domain/CharacterModdings.js";
import type { ModsByCharacterNames } from "#/modules/review/domain/ModsByCharacterNames.js";
import * as ModListFilter from "#/modules/review/domain/ModListFilter.js";

// components
import { Label } from "#ui/label.jsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select.jsx";
import { Switch } from "#ui/switch.jsx";

const ReactiveSelect = reactive(Select);
const ReactiveSwitch = reactive(Switch);

const DisplayWidget = () => {
	const sortOptionsId = useId();
	const viewOptionsId = useId();
	const modById = use$(() => profilesManagement$.activeProfile.modById.get());
	const baseCharacterById = use$(characters$.baseCharacterById);
	const filter = use$(review$.modListFilter);
	const flatCharacterModdings = use$(
		compilations$.defaultCompilation.flatCharacterModdings,
	);

	const getModAssignmentsByCurrentCharacter = (
		modAssignments: CharacterModdings,
	): CharacterModdings => {
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
						optimizationSettings$.shouldLevelMod(mod, assignment.target) ||
						optimizationSettings$.shouldSliceMod(mod, assignment.target),
				);
			}
		}
		// Filter out any mods that aren't moving
		const mods = tempAssignments.map(({ characterId: id, assignedMods }) =>
			assignedMods.filter((mod) => mod.characterID !== id),
		);

		const modsByCharacterNames: ModsByCharacterNames = groupBy(
			flatten(mods),
			(mod: Mod) => mod.characterID,
		);

		// Then, turn that into the same format as modAssignments - an array of {id, assignedMods}
		const result: CharacterModdings = Object.values(
			mapValues<ModsByCharacterNames, CharacterModding>(
				modsByCharacterNames,
				(mods: Mod[], id: string): CharacterModding => ({
					characterId: id as CharacterNames,
					assignedMods: mods,
					target: OptimizationPlan.createOptimizationPlan("xyz"),
					missedGoals: [],
				}),
			),
		);

		return result;
	};

	const modAssignments: CharacterModdings = flatCharacterModdings
		.filter((x) => null !== x)
		.map(({ characterId, target, assignedMods, missedGoals }) => ({
			characterId,
			target,
			assignedMods: assignedMods
				? assignedMods.map((id) => modById.get(id)).filter((mod) => !!mod)
				: [],
			missedGoals: missedGoals || [],
		})) as CharacterModdings;

	let displayedMods: CharacterModdings;
	let tags: string[];
	switch (filter.view) {
		case ModListFilter.viewOptions.list:
			if (ModListFilter.showOptions.upgrades === filter.show) {
				// If we're showing mods as a list and showing upgrades, show any upgraded mod, no matter if it's moving or not
				displayedMods = modAssignments
					.map(({ characterId, target, assignedMods }) => ({
						characterId,
						target,
						assignedMods: assignedMods.filter(
							(mod) =>
								optimizationSettings$.shouldLevelMod(mod, target) ||
								optimizationSettings$.shouldSliceMod(mod, target),
						),
						missedGoals: [],
					}))
					.filter(({ assignedMods }) => assignedMods.length > 0);
			} else {
				// If we're not showing upgrades, then only show mods that aren't already assigned to that character
				displayedMods = modAssignments.map(
					({ characterId, target, assignedMods }) => ({
						characterId,
						target,
						assignedMods: assignedMods
							.filter((mod) => mod.characterID !== characterId)
							.sort(ModLoadout.slotSort),
						missedGoals: [],
					}),
				);
			}

			if (ModListFilter.sortOptions.currentCharacter === filter.sort) {
				// collectByKey
				const removedMods: ModsByCharacterNames = groupBy(
					flatten(
						displayedMods.map(({ characterId: id, assignedMods }) =>
							assignedMods.filter((mod) => mod.characterID !== id),
						),
					),
					(mod: Mod) => mod.characterID,
				);

				tags = uniq(
					flatten(
						(Object.keys(removedMods) as CharacterNames[]).map((id) =>
							id in baseCharacterById ? baseCharacterById[id].categories : [],
						) as string[][],
					),
				);
			} else {
				tags = uniq(
					flatten(
						displayedMods.map(({ characterId: id }) =>
							id in baseCharacterById ? baseCharacterById[id].categories : [],
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
				displayedMods = modAssignments.filter(
					({ characterId: id, assignedMods }) =>
						assignedMods.some((mod) => mod.characterID !== id),
				);
			} else if (ModListFilter.showOptions.upgrades === filter.show) {
				// If we're only showing upgrades, then filter out any character that doesn't have at least one upgrade
				displayedMods = modAssignments.filter(({ target, assignedMods }) =>
					assignedMods.some(
						(mod) =>
							optimizationSettings$.shouldLevelMod(mod, target) ||
							optimizationSettings$.shouldSliceMod(mod, target),
					),
				);
			} else {
				displayedMods = modAssignments;
			}

			// Set up the available tags for the sidebar
			tags = Array.from(
				new Set(
					flatten(
						displayedMods.map(({ characterId: id }) =>
							baseCharacterById[id] ? baseCharacterById[id].categories : [],
						),
					),
				),
			);

			// Filter out any characters that we're not going to display based on the selected tag
			if (filter.tag !== "All") {
				displayedMods = displayedMods.filter(({ characterId: id }) => {
					const tags = baseCharacterById[id]
						? baseCharacterById[id].categories
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
			<Label className={labelCSS} htmlFor={`sort-options-${sortOptionsId}`}>
				Group by character:
			</Label>
			<div
				className={`${inputCSS} flex gap-2 items-center`}
				id={`sort-options-${sortOptionsId}`}
			>
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
			<Label className={labelCSS} htmlFor={`view-options-${viewOptionsId}`}>
				Show mods as:
			</Label>
			<div
				className={`${inputCSS} flex gap-2 items-center`}
				id={`view-options-${viewOptionsId}`}
			>
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

export default DisplayWidget;
