// react
import { useDispatch, useSelector } from "react-redux";

// utils
import { flatten, mapValues, uniq } from "lodash-es";
import { groupBy } from "#/utils/groupBy";
import groupByKey from "#/utils/groupByKey";

// modules
import { Data } from "#/state/modules/data";
import { Review as ReviewModule } from "#/state/modules/review";
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import { ModLoadout } from "#/domain/ModLoadout";
import type { ModAssignment, ModAssignments } from "#/domain/ModAssignment";
import type { ModsByCharacterNames } from "#/domain/ModsByCharacterNames";
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

const DisplayWidget = () => {
	const dispatch = useDispatch();
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
	const profile = useSelector(Storage.selectors.selectActiveProfile);
	const filter = useSelector(ReviewModule.selectors.selectModListFilter);

	const sortOptions = {
		currentCharacter: "currentCharacter",
		assignedCharacter: "assignedCharacter",
	};

	const viewOptions = {
		list: "list",
		sets: "sets",
	};

	const showOptions = {
		upgrades: "upgrades",
		change: "change",
		all: "all",
	};

	const getModAssignmentsByCurrentCharacter = (
		modAssignments: ModAssignments,
	): ModAssignments => {
		const tempAssignments = modAssignments;

		// If we're only showing upgrades, then filter out any mod that isn't being upgraded
		if (showOptions.upgrades === filter.show) {
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
		case viewOptions.list:
			if (showOptions.upgrades === filter.show) {
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

			if (sortOptions.currentCharacter === filter.sort) {
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
							id in baseCharacters ? baseCharacters[id].categories : [],
						) as string[][],
					),
				);
			} else {
				tags = uniq(
					flatten(
						displayedMods.map(({ id }) =>
							id in baseCharacters ? baseCharacters[id].categories : [],
						),
					),
				);
			}
			break;
		default:
			// If we're displaying as sets, but sorting by current character, we need to rework the modAssignments
			// so that they're organized by current character rather than assigned character
			if (sortOptions.currentCharacter === filter.sort) {
				displayedMods = getModAssignmentsByCurrentCharacter(modAssignments);
			} else if (showOptions.change === filter.show) {
				// If we're only showing changes, then filter out any character that isn't changing
				displayedMods = modAssignments.filter(({ id, assignedMods }) =>
					assignedMods.some((mod) => mod.characterID !== id),
				);
			} else if (showOptions.upgrades === filter.show) {
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
							baseCharacters[id] ? baseCharacters[id].categories : [],
						),
					),
				),
			);

			// Filter out any characters that we're not going to display based on the selected tag
			if (filter.tag !== "All") {
				displayedMods = displayedMods.filter(({ id }) => {
					const tags = baseCharacters[id] ? baseCharacters[id].categories : [];
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
				<Switch
					className="mr-2 ml-2"
					id={"sort-options-value"}
					checked={filter.sort === sortOptions.assignedCharacter}
					onCheckedChange={(checked) =>
						dispatch(
							ReviewModule.actions.changeModListFilter(
								Object.assign({}, filter, {
									sort: checked
										? sortOptions.assignedCharacter
										: sortOptions.currentCharacter,
								}),
							),
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
				<Label htmlFor="view-options-value">{viewOptions.sets}</Label>
				<Switch
					id={"view-options-value"}
					checked={filter.view === viewOptions.list}
					onCheckedChange={(checked) =>
						dispatch(
							ReviewModule.actions.changeModListFilter(
								Object.assign({}, filter, {
									view: checked ? viewOptions.list : viewOptions.sets,
								}),
							),
						)
					}
				/>
				<Label htmlFor="view-options-value">{viewOptions.list}</Label>
			</div>
			<Label className={labelCSS} htmlFor={"show"}>
				Show me:
			</Label>
			<Select
				value={filter.show}
				onValueChange={(value) =>
					dispatch(
						ReviewModule.actions.changeModListFilter(
							Object.assign({}, filter, { show: value }),
						),
					)
				}
			>
				<SelectTrigger className={inputCSS} id={"show"}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={"max-h-[50%]"}>
					<SelectGroup>
						<SelectItem value={showOptions.all}>All assignments</SelectItem>
						<SelectItem value={showOptions.change}>
							Changing characters
						</SelectItem>
						<SelectItem value={showOptions.upgrades}>Mod upgrades</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<Label htmlFor={"tag"}>Show characters by tag:</Label>
			<Select
				value={filter.tag}
				onValueChange={(value) =>
					dispatch(
						ReviewModule.actions.changeModListFilter(
							Object.assign({}, filter, { tag: value }),
						),
					)
				}
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
			</Select>
		</div>
	);
};

DisplayWidget.displayName = "DisplayWidget";

export { DisplayWidget };
