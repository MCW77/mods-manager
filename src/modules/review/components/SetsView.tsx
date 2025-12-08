// react
import { lazy } from "react";
import {
	For,
	use$,
	useMount,
	useObservable,
	useValue,
} from "@legendapp/state/react";

// utils
import collectByKey from "#/utils/collectByKey.js";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;

import { review$ } from "../state/review.js";

// domain
import * as ModListFilter from "../domain/ModListFilter.js";
import type { CharacterNames } from "#/constants/CharacterNames.js";
import type { Mod } from "#/domain/Mod.js";
import { createModLoadout } from "#/domain/ModLoadout.js";

import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings.js";

// components
import { Arrow } from "#/components/Arrow/Arrow.jsx";
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar.jsx"),
);
const ModLoadoutDetail = lazy(
	() => import("#/components/ModLoadoutDetail/ModLoadoutDetail.jsx"),
);
const ModLoadoutView = lazy(
	() => import("#/components/ModLoadoutView/ModLoadoutView.jsx"),
);
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible.jsx";
import { Button } from "#ui/button.jsx";
import { Label } from "#ui/label.jsx";

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
	const baseCharacterById = use$(characters$.baseCharacterById);
	const characterById = use$(profilesManagement$.activeProfile.characterById);
	const filter = use$(review$.modListFilter);
	const modById = use$(profilesManagement$.activeProfile.modById);

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
		<div className={"grid grid-cols-1 gap-6 justify-items-center"}>
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
							defaultHeight={625}
							key={`RIV-${value.characterId.peek()}`}
							visibleOffset={4000}
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
