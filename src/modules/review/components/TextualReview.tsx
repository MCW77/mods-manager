// utils
import copyToClipboard from "#/utils/clipboard";

// react
import { useId } from "react";
import { useValue } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const characters$ = stateLoader$.characters$;
import { dialog$ } from "#/modules/dialog/state/dialog";

// domain
import type * as Character from "#/domain/Character";

import type { BaseCharacterById } from "#/modules/characters/domain/BaseCharacter";
import type { CharacterModdings } from "#/modules/compilations/domain/CharacterModdings";

// components
import { Button } from "#ui/button";

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
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);

	return (
		<div>
			<h2>Move Summary</h2>
			<pre
				id={`summary_pre_${summaryId}`}
				className={
					"bg-background p-1 overflow-y-auto text-shadow-none max-h-[calc(100vh-27em)]"
				}
			>
				{summaryListContent(baseCharacterById, characterById, modAssignments)}
			</pre>
			<div className={"flex justify-center gap-2"}>
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
				<Button type={"button"} onClick={() => dialog$.hide()}>
					OK
				</Button>
			</div>
		</div>
	);
};

TextualReview.displayName = "TextualReview";

export default TextualReview;
