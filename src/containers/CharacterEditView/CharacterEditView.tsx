// react
import type React from "react";
import { lazy, Suspense } from "react";

// styles
import "./CharacterEditView.css";

// state
import { observable } from "@legendapp/state";
import { observer, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const charactersManagement$ = stateLoader$.charactersManagement$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import "#/modules/reoptimizationNeeded/state/reoptimizationNeeded";

// domain
import { characterSettings } from "#/constants/characterSettings";

import { defaultBaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import type { CharacterFilter } from "#/modules/charactersManagement/domain/CharacterFilterById";
import * as Character from "#/domain/Character";

// components
const SelectionActions = lazy(() => import("./SelectionActions"));
const TemplatesActions = lazy(() => import("./TemplatesActions"));
const CharacterActions = lazy(() => import("./CharacterActions"));
const CharacterFilters = lazy(() => import("./CharacterFilters"));
const CharacterWidget = lazy(() => import("./CharacterWidget"));

import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";
import { Spinner } from "#/components/Spinner/Spinner";

const CharacterList = lazy(
	() => import("#/containers/CharacterList/CharacterList"),
);

const isSelectionExpanded$ = observable(false);

const CharacterEditView = observer(() => {
	const characterById = use$(profilesManagement$.activeProfile.characterById);
	const baseCharacterById = use$(characters$.baseCharacterById);
	const selectedCharacters = use$(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const isSelectionExpanded = use$(isSelectionExpanded$);
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
					lockedStatus$.lockedCharactersForActivePlayer.has(character.id)) ||
				(["unlock", "unlocked"].includes(filter) &&
					!lockedStatus$.lockedCharactersForActivePlayer.has(character.id)) ||
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

	const starsReactivity = use$(charactersManagement$.filterSetup.starsRange);
	const levelReactivity = use$(charactersManagement$.filterSetup.levelRange);
	const gearLevelReactivity = use$(
		charactersManagement$.filterSetup.gearLevelRange,
	);
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById.peek().get("stars")
			?.filterPredicate ?? (() => true),
	);
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById.peek().get("level")
			?.filterPredicate ?? (() => true),
	);
	highlightedCharacters = highlightedCharacters.filter(
		charactersManagement$.filterSetup.permanentFilterById
			.peek()
			.get("gearLevel")?.filterPredicate ?? (() => true),
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
				isSelectionExpanded ? "sort-view" : ""
			}`}
		>
			<div className="flex flex-gap-2 flex-wrap justify-around items-stretch w-full p-y-2 max-h-[15%] overflow-auto">
				<DefaultCollapsibleCard title="Filters">
					<Suspense fallback={<div>Loading CharacterFilters</div>}>
						<CharacterFilters />
					</Suspense>
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Actions">
					<Suspense fallback={<div>Loading CharacterActions</div>}>
						<CharacterActions />
					</Suspense>
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Selection">
					<Suspense fallback={<div>Loading SelectionActions</div>}>
						<SelectionActions
							visibleCharacters={highlightedCharacters}
							lastSelectedCharacterIndex={lastSelectedCharacter}
							isSelectionExpanded$={isSelectionExpanded$}
						/>
					</Suspense>
				</DefaultCollapsibleCard>
				<DefaultCollapsibleCard title="Templates">
					<Suspense fallback={<div>Loading TemplatesActions</div>}>
						<TemplatesActions
							hasNoSelectedCharacters={selectedCharacters.length === 0}
							visibleCharacters={highlightedCharacters}
							lastSelectedCharacterIndex={lastSelectedCharacter}
						/>
					</Suspense>
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
							<Suspense
								key={character.id}
								fallback={<div>Loading CharacterWidget</div>}
							>
								<CharacterWidget
									key={character.id}
									character={character}
									className={"inactive"}
								/>
							</Suspense>
						))}
					</div>
				</div>
				<div className="selected-characters">
					<Suspense fallback={<Spinner isVisible={true} />}>
						<CharacterList />
					</Suspense>
				</div>
			</div>
		</div>
	);
});

export default CharacterEditView;
