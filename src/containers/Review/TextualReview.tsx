// react
import { useSelector } from "react-redux";

// utils
import copyToClipboard from "#/utils/clipboard";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { Data } from "#/state/modules/data";
import { Storage } from "#/state/modules/storage";

// domain
import type { BaseCharactersById } from "#/domain/BaseCharacter";
import type * as Character from "#/domain/Character";
import type { ModAssignments } from "#/domain/ModAssignment";

// components
import { Button } from "#/components/ui/button";

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
	baseCharacters: BaseCharactersById,
	characters: Character.Characters,
	modAssignments: ModAssignments,
) => {
	return modAssignments
		.map(({ id, target, assignedMods: mods }) => {
			const assignedCharacter = characters[id];
			const characterName =
				baseCharacters[assignedCharacter.baseID]?.name ??
				assignedCharacter.baseID;

			return [`${characterName} - ${target.name}`]
				.concat(
					mods.map((mod) => {
						const moveFrom =
							mod.characterID !== "null"
								? baseCharacters[mod.characterID].name
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
	baseCharacters: BaseCharactersById,
	characters: Character.Characters,
	modAssignments: ModAssignments,
) => {
	copyToClipboard(
		summaryListContent(baseCharacters, characters, modAssignments),
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
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
	const characters = useSelector(
		Storage.selectors.selectCharactersInActiveProfile,
	);

	return (
		<div>
			<h2>Move Summary</h2>
			<pre id="summary_pre" className={"summary"}>
				{summaryListContent(baseCharacters, characters, modAssignments)}
			</pre>
			<div className={"flex justify-center gap-2"}>
				<Button
					type={"button"}
					onClick={() =>
						copySummaryToClipboard(baseCharacters, characters, modAssignments)
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
