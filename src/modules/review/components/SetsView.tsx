// react
import { lazy } from "react";
import { For, useMount, useObservable } from "@legendapp/state/react";

// utils
import collectByKey from "#/utils/collectByKey";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

import { review$ } from "../state/review";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/characterSettings";
import type { Mod } from "#/domain/Mod";
import { createModLoadout } from "#/domain/ModLoadout";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { Arrow } from "#/components/Arrow/Arrow";
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
const ModLoadoutDetail = lazy(
	() => import("#/components/ModLoadoutDetail/ModLoadoutDetail"),
);
const ModLoadoutView = lazy(
	() => import("#/components/ModLoadoutView/ModLoadoutView"),
);
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";

type SetsViewProps = {
	modAssignments: CharacterModdings;
};

/***
 * Convert a list of displayed mods into the renderable elements to display them as sets
 * @param modAssignments {array<Object>} An array of objects containing `id`, `target`, and `assignedMods` keys
 * @returns array[JSX Element]
 */
const SetsView = ({ modAssignments }: SetsViewProps) => {
	const modAssignments$ = useObservable(modAssignments);
	const baseCharacterById = characters$.baseCharacterById.get();
	const characterById = profilesManagement$.activeProfile.characterById.get();
	const filter = review$.modListFilter.get();
	const modById = profilesManagement$.activeProfile.modById.get();

	const currentModsByCharacter: {
		[key in CharacterNames]: Mod[];
	} = collectByKey(
		modById.values().filter((mod) => mod.characterID !== "null"),
		(mod: Mod) => mod.characterID,
	);

	useMount(() => {
		modAssignments$.set(modAssignments);
	});

	// Iterate over each character to render a full mod set
	return (
		<div>
			<For each={modAssignments$}>
				{(value, id) => {
					const {
						characterId: characterID,
						missedGoals,
						assignedMods: mods,
						target,
					} = value.get();
					const character = characterById[value.characterId.peek()];
					if (character === undefined) return <></>;

					return (
						<RenderIfVisible
							defaultHeight={625}
							key={`RIV-${value.characterId.peek()}`}
							visibleOffset={4000}
						>
							<div className={"mod-row set"}>
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
										{ModListFilter.sortOptions.currentCharacter ===
											filter.sort && (
											<Button
												type={"button"}
												onClick={() => profilesManagement$.unequipMods(mods)}
											>
												I removed these mods
											</Button>
										)}
										{ModListFilter.sortOptions.assignedCharacter ===
											filter.sort && (
											<Button
												type={"button"}
												onClick={() =>
													profilesManagement$.reassignMods(mods, characterID)
												}
											>
												I reassigned these mods
											</Button>
										)}
									</div>
								</div>
								{ModListFilter.sortOptions.assignedCharacter ===
									filter.sort && (
									<ModLoadoutDetail
										newLoadout={createModLoadout(mods)}
										oldLoadout={createModLoadout(
											currentModsByCharacter[characterID] || [],
										)}
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
											modLoadout={createModLoadout(mods)}
											showAvatars={
												ModListFilter.sortOptions.currentCharacter !==
												filter.sort
											}
										/>
									</div>
								)}
							</div>
						</RenderIfVisible>
					);
				}}
			</For>
		</div>
	);
};

SetsView.displayName = "SetsView";

export default SetsView;
