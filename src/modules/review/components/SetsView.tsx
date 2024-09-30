// react
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// utils
import collectByKey from "#/utils/collectByKey";

// state
import { characters$ } from "#/modules/characters/state/characters";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { review$ } from "../state/review";

// modules
import { Review } from "#/state/modules/review";
import { Storage } from "#/state/modules/storage";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/characterSettings";
import type { Mod } from "#/domain/Mod";
import type { ModAssignments } from "#/domain/ModAssignment";
import { ModLoadout } from "#/domain/ModLoadout";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { ModLoadoutDetail } from "#/components/ModLoadoutDetail/ModLoadoutDetail";
import { ModLoadoutView } from "#/components/ModLoadoutView/ModLoadoutView";
import { Button } from "#ui/button";

type SetsViewProps = {
	modAssignments: ModAssignments;
};

/***
 * Convert a list of displayed mods into the renderable elements to display them as sets
 * @param modAssignments {array<Object>} An array of objects containing `id`, `target`, and `assignedMods` keys
 * @returns array[JSX Element]
 */
const SetsView = ({ modAssignments }: SetsViewProps) => {
	const dispatch: ThunkDispatch = useDispatch();
	const baseCharacterById = characters$.baseCharacterById.get();
	const characterById = profilesManagement$.activeProfile.characterById.get();
	const filter = review$.modListFilter.get();
	const mods = useSelector(Storage.selectors.selectModsInActiveProfile);

	const currentModsByCharacter: {
		[key in CharacterNames]: Mod[];
	} = collectByKey(
		mods.filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	// Iterate over each character to render a full mod set
	return modAssignments.map(
		({ id: characterID, target, assignedMods: mods, missedGoals }, index) => {
			const character = characterById[characterID];

			if (!character) {
				return null;
			}

			return (
				<div className={"mod-row set"} key={characterID}>
					<div className={"character-id"}>
						<CharacterAvatar character={character} />
						<Arrow />
						<h3 className={missedGoals?.length ? "red-text" : ""}>
							{baseCharacterById[characterID]
								? baseCharacterById[characterID].name
								: characterID}
						</h3>
						{target && (
							<h4 className={missedGoals?.length ? "red-text" : ""}>
								{target.id}
							</h4>
						)}
						<div className={"actions"}>
							{ModListFilter.sortOptions.currentCharacter === filter.sort && (
								<Button
									type={"button"}
									onClick={() =>
										dispatch(
											Review.thunks.unequipMods(mods.map((mod) => mod.id)),
										)
									}
								>
									I removed these mods
								</Button>
							)}
							{ModListFilter.sortOptions.assignedCharacter === filter.sort && (
								<Button
									type={"button"}
									onClick={() =>
										dispatch(
											Review.thunks.reassignMods(
												mods.map((mod) => mod.id),
												characterID,
											),
										)
									}
								>
									I reassigned these mods
								</Button>
							)}
						</div>
					</div>
					{ModListFilter.sortOptions.assignedCharacter === filter.sort && (
						<ModLoadoutDetail
							newLoadout={new ModLoadout(mods)}
							oldLoadout={
								new ModLoadout(currentModsByCharacter[characterID] || [])
							}
							showAvatars={true}
							character={character}
							target={target}
							useUpgrades={true}
							assignedCharacter={character}
							assignedTarget={target}
							missedGoals={missedGoals}
						/>
					)}
					{ModListFilter.sortOptions.currentCharacter === filter.sort && (
						<div className={"mod-set-block"}>
							<ModLoadoutView
								modLoadout={new ModLoadout(mods)}
								showAvatars={
									ModListFilter.sortOptions.currentCharacter !== filter.sort
								}
							/>
						</div>
					)}
				</div>
			);
		},
	);
};

SetsView.displayName = "SetsView";

export { SetsView };
