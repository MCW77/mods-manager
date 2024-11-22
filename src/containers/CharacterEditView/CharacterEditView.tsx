// react
import type React from "react";
import { useTranslation } from "react-i18next";

// styles
import "./CharacterEditView.css";

// state
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);
const { characters$ } = await import("#/modules/characters/state/characters");
const { charactersManagement$ } = await import(
	"#/modules/charactersManagement/state/charactersManagement"
);
const { lockedStatus$ } = await import(
	"#/modules/lockedStatus/state/lockedStatus"
);

// domain
import { characterSettings } from "#/constants/characterSettings";

import { defaultBaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import type { CharacterFilter } from "#/modules/charactersManagement/domain/CharacterFilterById";
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
	const [t] = useTranslation("optimize-ui");
	const characterById = profilesManagement$.activeProfile.characterById.get();
	const baseCharacterById = characters$.baseCharacterById.get();
	const selectedCharacters =
		compilations$.defaultCompilation.selectedCharacters.get();
	const lastSelectedCharacter = selectedCharacters.length - 1;

	let availableCharacters = [] as Character.Character[];
	availableCharacters = Object.values(characterById)
		.filter((character) => character.playerValues.level >= 50)
		.filter(
			(character) =>
				!charactersManagement$.filterSetup.hideSelectedCharacters.get() ||
				!selectedCharacters.map(({ id }) => id).includes(character.id),
		)
		.sort((left, right) => Character.compareGP(left, right));

	const createFilterFunction = (characterFilter: CharacterFilter) => {
		/**
		 * Checks whether a character matches the filter string in name or tags
		 * @param character {Character} The character to check
		 * @returns boolean
		 */
		const filterCharacters = (character: Character.Character) => {
			const baseCharacter = baseCharacterById[character.id] ?? {
				...defaultBaseCharacter,
				id: character.id,
				name: character.id,
			};
			const filter = characterFilter.filter;

			return (
				filter === "" ||
				baseCharacter.name.toLowerCase().includes(filter) ||
				(["lock", "locked"].includes(filter) &&
					lockedStatus$.ofActivePlayerByCharacterId[character.id]) ||
				(["unlock", "unlocked"].includes(filter) &&
					!lockedStatus$.ofActivePlayerByCharacterId[character.id]) ||
				baseCharacter.categories
					.concat(
						characterSettings[character.id]
							? characterSettings[character.id].extraTags
							: [],
					)
					.some((tag) => tag.toLowerCase().includes(filter))
			);
		};

		switch (characterFilter.type) {
			case "text":
				return filterCharacters;
			case "custom":
				return characterFilter.filterPredicate;
			default:
				return () => true;
		}
	};

	let highlightedCharacters = availableCharacters.filter(
		createFilterFunction(charactersManagement$.filterSetup.quickFilter.get()),
	);
	for (const filter of charactersManagement$.filterSetup.filtersById
		.get()
		.values()) {
		if (filter !== undefined)
			highlightedCharacters = highlightedCharacters.filter(
				createFilterFunction(filter),
			);
	}
	if (charactersManagement$.filterSetup.customFilterId.get() !== "None") {
		highlightedCharacters = highlightedCharacters.filter(
			charactersManagement$.activeCustomFilter(),
		);
	}

	const starsReactivity = charactersManagement$.filterSetup.starsRange.get();
	const levelReactivity = charactersManagement$.filterSetup.levelRange.get();
	const gearLevelReactivity =
		charactersManagement$.filterSetup.gearLevelRange.get();
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById.peek().get("stars")
			?.filterPredicate ?? ((character: Character.Character) => true),
	);
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById.peek().get("level")
			?.filterPredicate ?? ((character: Character.Character) => true),
	);
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById
			.peek()
			.get("gearLevel")?.filterPredicate ??
			((character: Character.Character) => true),
	);
	const filteredCharacters = availableCharacters.filter(
		(character) => !highlightedCharacters.includes(character),
	);

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
				compilations$.unselectCharacter(characterIndex);
				break;
			}
			default:
			// Do nothing
		}
	};

	return (
		<div
			className={`character-edit flex flex-col flex-grow-1 gap-2 ${
				isSelectionExpanded$.get() ? "sort-view" : ""
			}`}
		>
			<div className="flex flex-gap-2 flex-wrap justify-around items-stretch w-full p-y-2 max-h-[15%] overflow-auto">
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
			<div className="flex h-[83%]">
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
