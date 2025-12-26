// react

// utils
import flatten from "lodash-es/flatten";

// state
import { useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

import { review$ } from "../state/review";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/CharacterNames";
import * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import * as ModLoadout from "#/domain/ModLoadout";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import ModDetail from "#/components/ModDetail/ModDetail";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

interface ListViewProps {
	displayedMods: CharacterModdings;
}
/**
 * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
 * @param displayedMods {Array<Object>}
 * @returns {Array<*>}
 */
const ListView = ({ displayedMods }: ListViewProps) => {
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);
	const filter = useValue(review$.modListFilter);

	let individualMods: {
		id: CharacterNames;
		mod: Mod;
		target: OptimizationPlan.OptimizationPlan;
	}[] = flatten(
		displayedMods.map(({ characterId: id, target, assignedMods }) =>
			assignedMods.map((mod) => ({ id: id, target: target, mod: mod })),
		),
	);

	if (ModListFilter.sortOptions.currentCharacter === filter.sort) {
		individualMods.sort(({ mod: leftMod }, { mod: rightMod }) => {
			const leftCharacter =
				leftMod.characterID !== "null"
					? characterById[leftMod.characterID]
					: null;
			const rightCharacter =
				rightMod.characterID !== "null"
					? characterById[rightMod.characterID]
					: null;

			if (!leftCharacter) {
				return -1;
			}
			if (!rightCharacter) {
				return 1;
			}
			return (
				Character.compareGP(leftCharacter, rightCharacter) ||
				ModLoadout.slotSort(leftMod, rightMod)
			);
		});

		if (filter.tag !== "All") {
			individualMods = individualMods.filter(({ mod }) => {
				let tags: string[];
				if (mod.characterID === "null") {
					tags = [];
				} else {
					tags = baseCharacterById[mod.characterID].categories;
				}
				return tags.includes(filter.tag);
			});
		}
	} else if (filter.tag !== "All") {
		individualMods = individualMods.filter(({ id }) => {
			const tags = baseCharacterById[id]
				? baseCharacterById[id].categories
				: [];
			return tags.includes(filter.tag);
		});
	}

	return (
		<div className={"grid grid-cols-1 gap-2 justify-items-center"}>
			{individualMods.map(({ id: characterID, target, mod }) => {
				const character = characterById[characterID];
				const modCharacter =
					mod && mod.characterID !== "null"
						? baseCharacterById[mod.characterID]?.name || mod.characterID
						: "";
				if (character === undefined || modCharacter === null) return <div />;
				const searchText = `${baseCharacterById[characterID]?.name || characterID}_${modCharacter}`;

				return (
					<RenderIfVisible
						defaultHeight={625}
						key={`RIV-${mod.id}`}
						searchableText={searchText}
						visibleOffset={4000}
					>
						<div className={"grid grid-cols-[2fr_2fr_1fr] gap-4 items-center"}>
							<ModDetail mod={mod} assignedTarget={target} />
							<div className={"flex gap-2 items-center"}>
								<Arrow className={"size-16"} />
								<div className={"flex flex-col gap-2 items-center"}>
									<CharacterAvatar
										character={character}
										displayBadges={false}
										displayStars={false}
									/>
									<div className={"inline-flex flex-col gap-1 vertical-middle"}>
										<Label>
											{baseCharacterById[character.id]
												? baseCharacterById[character.id].name
												: character.id}
										</Label>
										<Label>{target.id}</Label>
									</div>
								</div>
							</div>
							<div className={"grid grid-cols-1 gap-2 justify-items-stretch"}>
								<Button
									type={"button"}
									onClick={() => profilesManagement$.unequipMod(mod.id)}
								>
									I removed this mod
								</Button>
								<Button
									type={"button"}
									onClick={() =>
										profilesManagement$.reassignMod(mod.id, characterID)
									}
								>
									I reassigned this mod
								</Button>
							</div>
						</div>
					</RenderIfVisible>
				);
			})}
		</div>
	);
};

ListView.displayName = "ListView";

export default ListView;
