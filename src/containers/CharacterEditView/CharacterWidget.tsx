// react
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import * as Character from "#/domain/Character";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";

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
const CharacterWidget: React.FC<CharacterBlockProps> = ({
	character,
	className,
}) => {
	const dispatch: ThunkDispatch = useDispatch();
	const selectedCharacters = useSelector(
		CharacterEdit.selectors.selectSelectedCharactersInActiveProfile,
	);
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
	const lastSelectedCharacter = selectedCharacters.length - 1;

	const isLocked = character.optimizerSettings.isLocked;
	const classAttr = `${isLocked ? "locked" : ""} ${className} character`;

	const isCharacterSelected = (characterID: CharacterNames) =>
		selectedCharacters.some(
			(selectedCharacter) => selectedCharacter.id === characterID,
		);

	const isDraggable = isCharacterSelected(character.baseID) ? undefined : true;

	const toggleCharacterLock = (characterID: CharacterNames) => {
		dispatch(CharacterEdit.thunks.toggleCharacterLock(characterID));
	};

	const dragStart = (character: Character.Character) => {
		return (event: React.DragEvent<HTMLDivElement>) => {
			event.dataTransfer.dropEffect = "copy";
			event.dataTransfer.effectAllowed = "copy";
			event.dataTransfer.setData("text/plain", character.baseID);
			// We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
			const options = {
				effect: "add",
			};
			event.dataTransfer.setData("application/json", JSON.stringify(options));
		};
	};

	return (
		<div className={classAttr} key={character.baseID}>
			<span
				className={`icon locked ${isLocked ? "active" : ""}`}
				onClick={() => toggleCharacterLock(character.baseID)}
				onKeyUp={(e) => {
					if (e.code === "Enter") toggleCharacterLock(character.baseID);
				}}
			/>
			<div
				className={`${isDraggable ? "cursor-grab" : ""}`}
				draggable={isDraggable}
				onDragStart={
					isCharacterSelected(character.baseID)
						? undefined
						: dragStart(character)
				}
				onDoubleClick={() =>
					dispatch(
						CharacterEdit.thunks.selectCharacter(
							character.baseID,
							Character.defaultTarget(character),
							lastSelectedCharacter,
						),
					)
				}
			>
				<CharacterAvatar character={character} />
			</div>
			<div className={"character-name"}>
				{baseCharacters[character.baseID]
					? baseCharacters[character.baseID].name
					: character.baseID}
			</div>
		</div>
	);
};

CharacterWidget.displayName = "CharacterWidget";

export { CharacterWidget };
