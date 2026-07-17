// utils
import copyToClipboard from "#/utils/clipboard";

// react
import { useId } from "react";
import { useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const roster$ = stateLoader$.roster$;
const characters$ = stateLoader$.characters$;
// domain
import type * as Character from "#/domain/Character";

import type { BaseCharacterById } from "#/modules/characters/domain/BaseCharacter";
import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { ScrollArea, ScrollBar } from "#/components/custom/ScrollArea";

import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";

const capitalize = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

const setMap = {
	"Speed %": "Speed",
	"Offense %": "Offense",
	"Defense %": "Defense",
	"Health %": "Health",
	"Critical Chance %": "Critchance",
	"Critical Damage %": "Critdamage",
	"Potency %": "Potency",
	"Tenacity %": "Tenacity",
};

const summaryListContent = (
	baseCharacterById: BaseCharacterById,
	characterById: Character.CharacterById,
	modAssignments: CharacterModdings,
) => {
	return modAssignments
		.map(({ characterId: id, target, assignedMods: mods }) => {
			const assignedCharacter = characterById[id];
			const characterName =
				baseCharacterById[assignedCharacter.id]?.name ?? assignedCharacter.id;

			return [`${characterName} - ${target.id}`]
				.concat(
					mods.map((mod) => {
						const moveFrom =
							mod.characterID !== "null"
								? baseCharacterById[mod.characterID].name
								: "your unassigned mods";
						return `Move ${setMap[mod.modset]}(${
							mod.primaryStat.type
						}) ${capitalize(mod.slot)} from ${moveFrom}.`;
					}),
				)
				.join("\r\n");
		})
		.join("\r\n\r\n");
};

/**
 * Copies the summary display text into the clipboard
 */
const copySummaryToClipboard = (
	baseCharacterById: BaseCharacterById,
	characterById: Character.CharacterById,
	modAssignments: CharacterModdings,
) => {
	copyToClipboard(
		summaryListContent(baseCharacterById, characterById, modAssignments),
	);
};

type TextualReviewProps = {
	modAssignments: CharacterModdings;
};

/**
 * Render copy-paste-able review of the mods to move (used inside a modal dialog)
 * @returns Array[JSX Element]
 */
const TextualReview = ({ modAssignments }: TextualReviewProps) => {
	const summaryId = useId();
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const characterById = useValue(roster$.activeCharacterById);

	return (
		<>
			<DialogHeader>
				<DialogTitle>Move Summary</DialogTitle>
				<DialogDescription />
			</DialogHeader>
			<ScrollArea
				className={"max-h-[60vh] w-full min-w-0 bg-background border rounded"}
			>
				<div className="w-max min-w-full">
					<pre
						id={`summary_pre_${summaryId}`}
						className={
							"w-max min-w-full p-1 text-shadow-none max-h-[calc(100vh-27em)]"
						}
					>
						{summaryListContent(
							baseCharacterById,
							characterById,
							modAssignments,
						)}
					</pre>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<DialogFooter className="sm:justify-center pb-1">
				<div className="flex flex-row gap-2 items-center justify-center">
					<DialogClose
						render={
							<Button
								type={"button"}
								onClick={() =>
									copySummaryToClipboard(
										baseCharacterById,
										characterById,
										modAssignments,
									)
								}
							>
								Copy to Clipboard
							</Button>
						}
					/>
					<DialogClose render={<Button type={"button"}>OK</Button>} />
				</div>
			</DialogFooter>
		</>
	);
};

TextualReview.displayName = "TextualReview";

export default TextualReview;
