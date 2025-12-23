// react
import { useRef } from "react";
import { For, useMount, useObservable, useValue } from "@legendapp/state/react";

// utils
import collectByKey from "#/utils/collectByKey";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

import { review$ } from "../state/review";

// domain
import * as ModListFilter from "../domain/ModListFilter";
import type { CharacterNames } from "#/constants/CharacterNames";
import type { Mod } from "#/domain/Mod";
import { createModLoadout } from "#/domain/ModLoadout";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { Arrow } from "#/components/Arrow/Arrow";
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import ModLoadoutDetail from "#/components/ModLoadoutDetail/ModLoadoutDetail";
import ModLoadoutView from "#/components/ModLoadoutView/ModLoadoutView";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

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
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);
	const filter = useValue(review$.modListFilter);
	const modById = useValue(profilesManagement$.activeProfile.modById);

	const containerRef = useRef<HTMLDivElement>(null);

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
		<div
			className={"grid grid-cols-1 gap-6 justify-items-center"}
			ref={containerRef}
		>
			<For each={modAssignments$}>
				{(value, _id) => {
					const {
						characterId: characterID,
						missedGoals,
						assignedMods: mods,
						target,
					} = value.get();
					const modAssignment = value.get();
					const character = characterById[value.characterId.peek()];
					if (character === undefined) return <div />;

					return (
						<RenderIfVisible
							defaultHeight={811}
							key={`RIV-${value.characterId.peek()}`}
							root={containerRef}
							visibleOffset={811 * 8}
							searchableText={
								baseCharacterById[character.id]?.name || character.id
							}
						>
							<div
								className={`grid ${ModListFilter.sortOptions.assignedCharacter === filter.sort ? "grid-cols-[2fr_5fr]" : "grid-cols-[5fr_4fr]"} gap-4 items-center`}
							>
								<div className={"flex gap-4 items-center justify-evenly"}>
									<div className={"flex flex-col gap-2 items-center"}>
										<CharacterAvatar
											className={"text-[1.5em]"}
											character={character}
										/>
										<div
											className={"inline-flex flex-col gap-1 vertical-middle"}
										>
											<Label
												className={missedGoals?.length ? "text-red-600" : ""}
											>
												{baseCharacterById[characterID]
													? baseCharacterById[characterID].name
													: characterID}
											</Label>
											{target && (
												<Label
													className={missedGoals?.length ? "text-red-600" : ""}
												>
													{target.id}
												</Label>
											)}
										</div>
										<div
											className={"grid grid-cols-1 gap-2 justify-items-stretch"}
										>
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
										</div>{" "}
									</div>
									<Arrow className={"size-24"} />
								</div>
								{ModListFilter.sortOptions.assignedCharacter ===
									filter.sort && (
									<ModLoadoutDetail
										newLoadout={createModLoadout(mods)}
										oldLoadout={createModLoadout(
											currentModsByCharacter[characterID] || [],
										)}
										character={character}
										useUpgrades={true}
										modAssignment={modAssignment}
									/>
								)}
								{ModListFilter.sortOptions.currentCharacter === filter.sort && (
									<div className={"mod-set-block"}>
										<ModLoadoutView modLoadout={createModLoadout(mods)} />
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
