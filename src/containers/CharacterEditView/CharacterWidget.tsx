// react
import type React from "react";
import { lazy } from "react";

import { observer } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const lockedStatus$ = stateLoader$.lockedStatus$;

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";

// components
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);

type CharacterBlockProps = {
	character: Character.Character;
	className: string;
};

/**
 * Render a character widget. This includes the character portrait and a button
 * to (un-)lock the character
 * @param character Character
 * @param className String A class to apply to each character block
 */
const CharacterWidget: React.FC<CharacterBlockProps> = observer(
	({ character, className }) => {
		const selectedCharacters =
			compilations$.defaultCompilation.selectedCharacters.get();
		const baseCharacterById = characters$.baseCharacterById.get();
		const lastSelectedCharacter = selectedCharacters.length - 1;

		const isLocked =
			lockedStatus$.ofActivePlayerByCharacterId[character.id].get();
		const classAttr = `${isLocked ? "locked" : ""} ${className} character`;

		const isCharacterSelected = (characterID: CharacterNames) =>
			selectedCharacters.some(
				(selectedCharacter) => selectedCharacter.id === characterID,
			);

		const isDraggable = isCharacterSelected(character.id) ? undefined : true;

		const toggleCharacterLock = (characterID: CharacterNames) => {
			lockedStatus$.ofActivePlayerByCharacterId[characterID].toggle();
		};

		const dragStart = (character: Character.Character) => {
			return (event: React.DragEvent<HTMLDivElement>) => {
				event.dataTransfer.dropEffect = "copy";
				event.dataTransfer.effectAllowed = "copy";
				event.dataTransfer.setData("text/plain", character.id);
				// We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
				const options = {
					effect: "add",
				};
				event.dataTransfer.setData("application/json", JSON.stringify(options));
			};
		};

		return (
			<div className={classAttr} key={character.id}>
				<span
					className={`icon locked ${isLocked ? "active" : ""}`}
					onClick={() => toggleCharacterLock(character.id)}
					onKeyUp={(e) => {
						if (e.code === "Enter") toggleCharacterLock(character.id);
					}}
				/>
				<div
					className={`${isDraggable ? "cursor-grab" : ""}`}
					draggable={isDraggable}
					onDragStart={
						isCharacterSelected(character.id) ? undefined : dragStart(character)
					}
					onDoubleClick={() =>
						compilations$.selectCharacter(
							character.id,
							Character.defaultTarget(character),
							lastSelectedCharacter,
						)
					}
				>
					<CharacterAvatar character={character} />
				</div>
				<div className={"character-name"}>
					{baseCharacterById[character.id]
						? baseCharacterById[character.id].name
						: character.id}
				</div>
			</div>
		);
	},
);

CharacterWidget.displayName = "CharacterWidget";

export default CharacterWidget;
