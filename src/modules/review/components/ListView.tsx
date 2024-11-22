// utils
import { flatten } from "lodash-es";

// state
const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { characters$ } = await import("#/modules/characters/state/characters");

import { review$ } from "../state/review";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import * as ModLoadout from "#/domain/ModLoadout";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { ModDetail } from "#/components/ModDetail/ModDetail";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";

interface ListViewProps {
	displayedMods: CharacterModdings;
}
/**
 * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
 * @param displayedMods {Array<Object>}
 * @returns {Array<*>}
 */
const ListView = ({ displayedMods }: ListViewProps) => {
	const baseCharacterById = characters$.baseCharacterById.get();
	const characterById = profilesManagement$.activeProfile.characterById.get();
	const filter = review$.modListFilter.get();
	const modById = profilesManagement$.activeProfile.modById.get();

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
		individualMods = individualMods.filter(({ id, mod }) => {
			const tags = baseCharacterById[id]
				? baseCharacterById[id].categories
				: [];
			return tags.includes(filter.tag);
		});
	}

	return (
		<div>
			{individualMods.map(({ id: characterID, target, mod }) => {
				const character = characterById[characterID];

				return (
					<RenderIfVisible
						defaultHeight={625}
						key={`RIV-${mod.id}`}
						visibleOffset={4000}
					>
						<div className={"mod-row individual"}>
							<ModDetail mod={mod} assignedTarget={target} />
							<div className={"character-id"}>
								<Arrow />
								<CharacterAvatar character={character} />
								<h3>
									{baseCharacterById[character.id]
										? baseCharacterById[character.id].name
										: character.id}
								</h3>
								<h4>{target.id}</h4>
							</div>
							<div className={"actions"}>
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

export { ListView };
