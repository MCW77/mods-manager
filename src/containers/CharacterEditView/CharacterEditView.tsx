// react
import type React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// styles
import "./CharacterEditView.css";

// state
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";

import { characters$ } from "#/modules/characters/state/characters";
import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Storage } from "#/state/modules/storage";

// domain
import { characterSettings } from "#/constants/characterSettings";

import { defaultBaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import * as Character from "#/domain/Character";

// components
import { SelectionActions } from "./SelectionActions";
import { TemplatesActions } from "./TemplatesActions";
import { CharacterActions } from "./CharacterActions";
import { CharacterFilters } from "./CharacterFilters";
import { CharacterWidget } from "./CharacterWidget";

import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";

import { CharacterList } from "#/containers/CharacterList/CharacterList";

const isSelectionExpanded$ = observable(false);

const CharacterEditView = observer(() => {
	const dispatch: ThunkDispatch = useDispatch();
	const [t] = useTranslation("optimize-ui");
	const profile = useSelector(Storage.selectors.selectActiveProfile);
	const characters = useSelector(
		Storage.selectors.selectCharactersInActiveProfile,
	);
	const baseCharactersById = characters$.baseCharactersById.get();

	const selectedCharacters = useSelector(
		CharacterEdit.selectors.selectSelectedCharactersInActiveProfile,
	);
	const lastSelectedCharacter = selectedCharacters.length - 1;

	let availableCharacters = [] as Character.Character[];
	availableCharacters = Object.values(characters)
		.filter((character) => character.playerValues.level >= 50)
		.filter(
			(character) =>
				!charactersManagement$.filters.hideSelectedCharacters.get() ||
				!profile.selectedCharacters
					.map(({ id }) => id)
					.includes(character.id),
		)
		.sort((left, right) => Character.compareGP(left, right));

	/**
	 * Checks whether a character matches the filter string in name or tags
	 * @param character {Character} The character to check
	 * @returns boolean
	 */
	const filterCharacters = (character: Character.Character) => {
		const baseCharacter = baseCharactersById[character.id] ?? {
			...defaultBaseCharacter,
			id: character.id,
			name: character.id,
		};
		const characterFilter = charactersManagement$.filters.characterFilter.get();

		return (
			characterFilter === "" ||
			baseCharacter.name.toLowerCase().includes(characterFilter) ||
			(["lock", "locked"].includes(characterFilter) &&
				lockedStatus$.ofActivePlayerByCharacterId[character.id]) ||
			(["unlock", "unlocked"].includes(characterFilter) &&
				!lockedStatus$.ofActivePlayerByCharacterId[character.id]) ||
			baseCharacter.categories
				.concat(
					characterSettings[character.id]
						? characterSettings[character.id].extraTags
						: [],
				)
				.some((tag) => tag.toLowerCase().includes(characterFilter))
		);
	};

	const highlightedCharacters = availableCharacters.filter(filterCharacters);
	const filteredCharacters =
		availableCharacters.filter((c) => !filterCharacters(c)) ?? [];

	const dragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const dragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		(event.target as HTMLDivElement).classList.remove("drop-character");
	};

	const availableCharactersDragEnter = (
		event: React.DragEvent<HTMLDivElement>,
	) => {
		event.preventDefault();
	};

	const availableCharactersDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const options = JSON.parse(event.dataTransfer.getData("application/json"));

		switch (options.effect) {
			case "move": {
				// This is coming from the selected characters - remove the character from the list
				const characterIndex = +event.dataTransfer.getData("text/plain");
				dispatch(CharacterEdit.thunks.unselectCharacter(characterIndex));
				break;
			}
			default:
			// Do nothing
		}
	};

	return (
		<div
			className={`character-edit flex flex-col flex-grow-1 ${
				isSelectionExpanded$.get() ? "sort-view" : ""
			}`}
		>
			<div className="flex flex-gap-2 flex-wrap justify-around items-stretch w-full p-y-2">
				<DefaultCollapsibleCard title="Filters">
					<CharacterFilters />
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Actions">
					<CharacterActions />
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Selection">
					<SelectionActions
						visibleCharacters={highlightedCharacters}
						lastSelectedCharacterIndex={lastSelectedCharacter}
						isSelectionExpanded$={isSelectionExpanded$}
					/>
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Templates">
					<TemplatesActions
						hasNoSelectedCharacters={selectedCharacters.length === 0}
						visibleCharacters={highlightedCharacters}
						lastSelectedCharacterIndex={lastSelectedCharacter}
					/>
				</DefaultCollapsibleCard>
			</div>
			<div className="flex h-full">
				<div
					className="available-characters"
					onDragEnter={availableCharactersDragEnter}
					onDragOver={dragOver}
					onDragLeave={dragLeave}
					onDrop={availableCharactersDrop}
				>
					<div
						className={
							"grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] p-x-1"
						}
					>
						{highlightedCharacters.map((character) => (
							<CharacterWidget
								key={character.id}
								character={character}
								className={"active"}
							/>
						))}
						{filteredCharacters.map((character) => (
							<CharacterWidget
								key={character.id}
								character={character}
								className={"inactive"}
							/>
						))}
					</div>
				</div>
				<div className="selected-characters">
					<CharacterList />
				</div>
			</div>
		</div>
	);
});

export { CharacterEditView };
