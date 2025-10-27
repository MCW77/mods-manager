// utils
import { cn } from "#/lib/utils";

// react
import type React from "react";
import { lazy } from "react";
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
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Toggle } from "#/components/reactive/Toggle";

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
		const activePlan = target.id;
		const charactersLockedStatus = use$(() =>
			lockedStatus$.isCharacterLockedForActivePlayer(characterId),
		);

		/*
		let handleValueChange = (value: string) => {
			const newTarget = structuredClone(target);
			newTarget.minimumModDots = Number(value);
			compilations$.saveTarget(character.id, newTarget);
			(document?.activeElement as HTMLSelectElement)?.blur();
		};
*/
		/**
		 * Renders the set of 10 icons that show the state of a selected character
		 * @param character {Character}
		 * @param target {OptimizationPlan}
		 */
		const renderCharacterIcons = (
			character: Character.Character,
			target: OptimizationPlan.OptimizationPlan,
		) => {
			const restrictionsActive = OptimizationPlan.hasRestrictions(target);
			const targetStatActive = target.targetStats?.length > 0;
			const negativeWeightsActive = OptimizationPlan.hasNegativeWeights(target);
			const blankTargetActive = OptimizationPlan.isBlank(target);

			return (
				<div className={"grid-col-2 grid-row-2"}>
					<span
						className={cn(
							`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:180px_36px] bg-[position:-36px_-18px] w-[18px] h-[18px] leading-6 text-center mx-0.5 p-0`,
							restrictionsActive ? "bg-[position:-36px_0px]" : "",
						)}
						title={
							restrictionsActive
								? "This character has restrictions active"
								: "This character has no restrictions active"
						}
					/>
					<span
						className={cn(
							`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:180px_36px] bg-[position:-54px_-18px] w-[18px] h-[18px] leading-6 text-center mx-0.5 p-0`,
							targetStatActive ? "bg-[position:-54px_0px]" : "",
						)}
						title={
							targetStatActive
								? "This character has a target stat selected"
								: "This character has no target stat selected"
						}
					/>
					<span
						className={cn(
							`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:180px_36px] bg-[position:-90px_-18px] w-[18px] h-[18px] leading-6 text-center mx-0.5 p-0`,
							negativeWeightsActive ? "bg-[position:-90px_0px]" : "",
						)}
						title={
							negativeWeightsActive
								? "This character's target has negative stat weights"
								: "This character's target has no negative stat weights"
						}
					/>
					<span
						className={cn(
							`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:180px_36px] bg-[position:-126px_-18px] w-[18px] h-[18px] leading-6 text-center mx-0.5 p-0`,
							blankTargetActive ? "bg-[position:-126px_0px]" : "",
						)}
						title={
							blankTargetActive
								? "This character's target has no assigned stat weights"
								: "This character's target has at least one stat given a value"
						}
					/>
					<Toggle
						className={cn(
							`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:180px_36px] bg-[position:-144px_-18px] w-[18px] min-w-[18px] h-[18px] leading-6 text-center mx-0.5 p-0 rounded-none`,
							charactersLockedStatus ? "bg-[position:-144px_0px]" : "",
						)}
						$pressed={() =>
							lockedStatus$.isCharacterLockedForActivePlayer(characterId)
						}
						onPressedChange={() => {
							lockedStatus$.toggleCharacterForActivePlayer(character.id);
						}}
						title={
							charactersLockedStatus
								? "This character is locked. Its mods will not be assigned to other characters"
								: "This character is not locked"
						}
					/>
				</div>
			);
		};

		const showEditCharacterModal = (
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

		return (
			<div className={"w-80 p-x-0 p-y-1 m-0"} key={character.id}>
				<article
					className={`max-w-full p-1 bg-blue-700/20 border-1 border-solid border-[dodgerblue] grid grid-cols-[fit-content(1em)_auto] gap-x-2 text-left [&.drop-character]:shadow-[0_2px_3px_0_darkred] cursor-grab ${charactersLockedStatus ? "locked" : ""}`}
					aria-label={`Character ${baseCharacterById[character.id]?.name || character.id} - draggable`}
					draggable={true}
					onDragStart={characterBlockDragStart(index)}
					onDoubleClick={() => compilations$.unselectCharacter(index)}
				>
					<Computed>{renderCharacterIcons(character, target)}</Computed>
					<CharacterAvatar
						character={character}
						className={
							"row-start-1 row-end-3 col-start-1 col-end-1 text-size-3.2"
						}
					/>
					<div
						className={
							"inline-block grid-row-1 grid-col-2 align-middle pointer-events-none"
						}
					>
						{baseCharacterById[character.id]
							? baseCharacterById[character.id].name
							: character.id}
					</div>
					<div
						className={
							"grid-row-3 grid-col-2 p-y-1 flex items-center flex-wrap gap-2"
						}
					>
						<Label className="align-middle">Target:</Label>
						<Label className="align-middle dark:text-white light:text-black">
							{activePlan}
						</Label>
						<Button
							size={"xs"}
							type={"button"}
							onClick={() => showEditCharacterModal(character, index, target)}
						>
							Edit
						</Button>
					</div>
				</article>
			</div>
		);
	},
);

CharacterBlock.displayName = "CharacterBlock";

export default CharacterBlock;
