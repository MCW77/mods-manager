// react
import React, { lazy } from "react";
import { observer, use$ } from "@legendapp/state/react";

// styles
import "./CharacterList.css";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import { characterSettings } from "#/constants/characterSettings";

import * as Character from "#/domain/Character";

// components
const CharacterBlock = lazy(() => import("./CharacterBlock"));

const CharacterList = observer(
	React.memo(() => {
		const characterById = use$(profilesManagement$.activeProfile.characterById);
		const selectedCharacters = use$(
			compilations$.defaultCompilation.selectedCharacters,
		);

		const characterBlockDragEnter = () => {
			return (event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();

				(event.target as HTMLDivElement).classList.add("drop-character");
			};
		};

		const characterBlockDragOver = () => {
			return (event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();
			};
		};

		const characterBlockDragLeave = () => {
			return (event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();
				(event.target as HTMLDivElement).classList.remove("drop-character");
			};
		};

		/**
		 * @param dropCharacterIndex The index of the character on which the drop is occurring or null (No characters in the list)
		 * @returns {Function}
		 */
		const characterBlockDrop = (dropCharacterIndex: number | null) => {
			return (event: React.DragEvent<HTMLDivElement>) => {
				event.preventDefault();
				event.stopPropagation();
				const options = JSON.parse(
					event.dataTransfer.getData("application/json"),
				);

				switch (options.effect) {
					case "add": {
						const movingCharacterID: CharacterNames =
							event.dataTransfer.getData("text/plain") as CharacterNames;
						const movingCharacter = characterById[movingCharacterID];
						compilations$.selectCharacter(
							movingCharacterID,
							Character.defaultTarget(characterSettings, movingCharacter),
							dropCharacterIndex,
						);
						break;
					}
					case "move": {
						const movingCharacterIndex =
							+event.dataTransfer.getData("text/plain");
						compilations$.moveSelectedCharacter(
							movingCharacterIndex,
							dropCharacterIndex,
						);
						break;
					}
					default:
					// Do nothing
				}

				(event.target as HTMLDivElement).classList.remove("drop-character");
			};
		};

		return (
			<div
				className={"character-list overscroll-contain"}
				onDragEnter={characterBlockDragEnter()}
				onDragOver={characterBlockDragOver()}
				onDragLeave={characterBlockDragLeave()}
				onDrop={characterBlockDrop(selectedCharacters.length - 1)}
			>
				{0 < selectedCharacters.length && (
					// Add a block to allow characters to be dragged to the top of the list
					<div
						className={"top-block"}
						onDragEnd={characterBlockDragEnter()}
						onDragOver={characterBlockDragOver()}
						onDragLeave={characterBlockDragLeave()}
						onDrop={characterBlockDrop(0)}
					/>
				)}
				{0 < selectedCharacters.length &&
					selectedCharacters.map(({ id, target }, index) => (
						<CharacterBlock
							key={id}
							characterId={id}
							target={target}
							index={index}
						/>
					))}

				{0 === selectedCharacters.length && (
					<div
						className={"character-block"}
						onDragEnter={characterBlockDragEnter()}
						onDragOver={characterBlockDragOver()}
						onDragLeave={characterBlockDragLeave()}
						onDrop={characterBlockDrop(null)}
					/>
				)}
			</div>
		);
	}),
);

CharacterList.displayName = "CharacterList";

export default CharacterList;
