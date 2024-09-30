// utils
import copyToClipboard from "#/utils/clipboard";

// state
import { characters$ } from "#/modules/characters/state/characters";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { BaseCharacterById } from "#/modules/characters/domain/BaseCharacter";
import type * as Character from "#/domain/Character";
import type { ModAssignments } from "#/domain/ModAssignment";

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
	modAssignments: ModAssignments,
) => {
	return modAssignments
		.map(({ id, target, assignedMods: mods }) => {
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
						return `Move ${setMap[mod.set]}(${
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
	modAssignments: ModAssignments,
) => {
	copyToClipboard(
		summaryListContent(baseCharacterById, characterById, modAssignments),
	);
};

type TextualReviewProps = {
	modAssignments: ModAssignments;
};

/**
 * Render copy-paste-able review of the mods to move (used inside a modal dialog)
 * @returns Array[JSX Element]
 */
const TextualReview = ({ modAssignments }: TextualReviewProps) => {
	const baseCharacterById = characters$.baseCharacterById.get();
	const characterById = profilesManagement$.activeProfile.characterById.get();

	return (
		<div>
			<h2>Move Summary</h2>
			<pre id="summary_pre" className={"summary"}>
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

export { TextualReview };
