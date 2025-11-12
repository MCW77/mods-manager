// react
import type React from "react";
import { lazy, useCallback } from "react";
import { Computed, observer, use$ } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type * as Character from "#/domain/Character";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { CharacterTargetStatusIcons } from "./CharacterTargetStatusIcons";
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const showEditCharacterModal = (
	allycode: string,
	character: Character.Character,
	index: number,
	target: OptimizationPlan.OptimizationPlan,
) => {
	incrementalOptimization$.indicesByProfile[allycode].set(index);
	optimizerView$.assign({
		currentCharacter: {
			id: character.id,
			index: index,
			target: structuredClone(target),
		},
		view: "edit",
	});
};

type CharacterBlockProps = {
	characterId: CharacterNames;
	target: OptimizationPlan.OptimizationPlan;
	index: number;
};

const characterBlockDragStart = (index: number) => {
	return (event: React.DragEvent<HTMLDivElement>) => {
		event.dataTransfer.dropEffect = "move";
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/plain", `${index}`);
		// We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
		const options = {
			effect: "move",
		};
		event.dataTransfer.setData("application/json", JSON.stringify(options));
	};
};

const CharacterBlock: React.FC<CharacterBlockProps> = observer(
	({ characterId, target, index }: CharacterBlockProps) => {
		const characterById = use$(profilesManagement$.activeProfile.characterById);
		const allycode = use$(profilesManagement$.profiles.activeAllycode);
		const baseCharacterById = use$(characters$.baseCharacterById);
		const character = characterById[characterId];
		const showEditCharacterModalCallback = useCallback(
			() => showEditCharacterModal(allycode, character, index, target),
			[allycode, character, index, target],
		);
		const activePlan = target.id;
		const charactersLockedStatus = use$(() =>
			lockedStatus$.isCharacterLockedForActivePlayer(characterId),
		);

		return (
			<div className={"p-x-0 p-y-1 m-0 w-60"} key={character.id}>
				<article
					className={`max-w-full p-1 bg-blue-700/20 border-1 border-solid border-[dodgerblue] grid grid-cols-[fit-content(1em)_auto] grid-rows-[auto_20px] gap-x-2 text-left [&.drop-character]:shadow-[0_2px_3px_0_darkred] cursor-grab ${charactersLockedStatus ? "locked" : ""}`}
					aria-label={`Character ${baseCharacterById[character.id]?.name || character.id} - draggable`}
					draggable={true}
					onDragStart={characterBlockDragStart(index)}
					onDoubleClick={() => compilations$.unselectCharacter(index)}
				>
					<CharacterAvatar
						character={character}
						className={
							"row-start-1 row-end-1 col-start-1 col-end-1 text-size-3.2"
						}
					/>
					<div
						className={
							"inline-block grid-row-2 col-start-1 col-end-3 align-middle pointer-events-none"
						}
					>
						{baseCharacterById[character.id]
							? baseCharacterById[character.id].name
							: character.id}
					</div>
					<div
						className={
							"grid-row-1 grid-col-2 flex flex-col gap-2 justify-center"
						}
					>
						<Computed>{CharacterTargetStatusIcons(character, target)}</Computed>
						<div
							className={"p-y-1 items-center grid grid-rows-[auto_20px] gap-2"}
						>
							<div className="flex items-center justify-between">
								<Label className="align-middle">Target:</Label>
								<Button
									className="px-5"
									size={"xs"}
									type={"button"}
									onClick={() => showEditCharacterModalCallback()}
								>
									Edit
								</Button>
							</div>
							<Label className="grid-row-2 align-middle dark:text-white light:text-black">
								{activePlan}
							</Label>
						</div>
					</div>
				</article>
			</div>
		);
	},
);

CharacterBlock.displayName = "CharacterBlock";

export default CharacterBlock;
