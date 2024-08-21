// react
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// utils
import { flatten } from "lodash-es";

// state
import { useSelector as useLegendSelector } from "@legendapp/state/react";
import { characters$ } from "#/modules/characters/state/characters";
import { review$ } from "../state/review";

// modules
import { Review } from "#/state/modules/review";
import { Storage } from "#/state/modules/storage";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type { ModAssignments } from "#/domain/ModAssignment";
import { ModLoadout } from "#/domain/ModLoadout";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { ModDetail } from "#/components/ModDetail/ModDetail";
import { Button } from "#ui/button";

interface ListViewProps {
	displayedMods: ModAssignments;
}
/**
 * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
 * @param displayedMods {Array<Object>}
 * @returns {Array<*>}
 */
const ListView = ({ displayedMods }: ListViewProps) => {
	const dispatch: ThunkDispatch = useDispatch();
	const baseCharactersById = useLegendSelector(characters$.baseCharactersById);
	const characters = useSelector(
		Storage.selectors.selectCharactersInActiveProfile,
	);
	const filter = useLegendSelector(review$.modListFilter);
	const mods = useSelector(Storage.selectors.selectModsInActiveProfile);

	let individualMods: {
		id: CharacterNames;
		mod: Mod;
		target: OptimizationPlan.OptimizationPlan;
	}[] = flatten(
		displayedMods.map(({ id, target, assignedMods }) =>
			assignedMods.map((mod) => ({ id: id, target: target, mod: mod })),
		),
	);

	if (ModListFilter.sortOptions.currentCharacter === filter.sort) {
		individualMods.sort(({ mod: leftMod }, { mod: rightMod }) => {
			const leftCharacter =
				leftMod.characterID !== "null" ? characters[leftMod.characterID] : null;
			const rightCharacter =
				rightMod.characterID !== "null"
					? characters[rightMod.characterID]
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
					tags = baseCharactersById[mod.characterID].categories;
				}
				return tags.includes(filter.tag);
			});
		}
	} else if (filter.tag !== "All") {
		individualMods = individualMods.filter(({ id, mod }) => {
			const tags = baseCharactersById[id]
				? baseCharactersById[id].categories
				: [];
			return tags.includes(filter.tag);
		});
	}

	return individualMods.map(({ id: characterID, target, mod }) => {
		const character = characters[characterID];

		return (
			<div className={"mod-row individual"} key={mod.id}>
				<ModDetail
					mod={mod}
					assignedCharacter={character}
					assignedTarget={target}
				/>
				<div className={"character-id"}>
					<Arrow />
					<CharacterAvatar character={character} />
					<h3>
						{baseCharactersById[character.id]
							? baseCharactersById[character.id].name
							: character.id}
					</h3>
					<h4>{target.id}</h4>
				</div>
				<div className={"actions"}>
					<Button
						type={"button"}
						onClick={() => dispatch(Review.thunks.unequipMod(mod.id))}
					>
						I removed this mod
					</Button>
					<Button
						type={"button"}
						onClick={() =>
							dispatch(Review.thunks.reassignMod(mod.id, characterID))
						}
					>
						I reassigned this mod
					</Button>
				</div>
			</div>
		);
	});
};

ListView.displayName = "ListView";

export { ListView };
