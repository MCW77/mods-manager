// react
import type React from "react";
import { lazy, Suspense, useEffect, useRef } from "react";

// state
import { observable } from "@legendapp/state";
import { Memo, observer, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const charactersManagement$ = stateLoader$.charactersManagement$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import "#/modules/reoptimizationNeeded/state/reoptimizationNeeded";

// domain
import { characterSettings } from "#/constants/characterSettings.js";

import { defaultBaseCharacter } from "#/modules/characters/domain/BaseCharacter.js";
import type { CharacterFilter } from "#/modules/charactersManagement/domain/CharacterFilterById.js";
import * as Character from "#/domain/Character.js";

// components
const SelectionActions = lazy(() => import("./SelectionActions.jsx"));
const TemplatesActions = lazy(() => import("./TemplatesActions.jsx"));
const CharacterActions = lazy(() => import("./CharacterActions.jsx"));
const CharacterFilters = lazy(() => import("./CharacterFilters.jsx"));
const CharacterWidget = lazy(() => import("./CharacterWidget.jsx"));

import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard.jsx";
import { Spinner } from "#/components/Spinner/Spinner.jsx";
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible.jsx";

const CharacterList = lazy(
	() => import("#/containers/CharacterList/CharacterList.jsx"),
);

const isSelectionExpanded$ = observable(false);

const CharacterEditView = observer(() => {
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);
	const baseCharacterById = useValue(characters$.baseCharacterById);
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const isSelectionExpanded = useValue(isSelectionExpanded$);
	const containerRef = useRef<HTMLDivElement>(null);
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

	const _starsReactivity = useValue(
		charactersManagement$.filterSetup.starsRange,
	);
	const _levelReactivity = useValue(
		charactersManagement$.filterSetup.levelRange,
	);
	const _gearLevelReactivity = useValue(
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

	// Disable scroll snap while actively scrolling
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let scrollTimeout: NodeJS.Timeout;

		const handleScroll = () => {
			// Disable snap type while scrolling
			container.style.scrollSnapType = "none";

			// Clear any existing timeout
			clearTimeout(scrollTimeout);

			// Re-enable snap type after 300ms of no scrolling
			scrollTimeout = setTimeout(() => {
				container.style.scrollSnapType = "y proximity";
			}, 30);
		};

		container.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			container.removeEventListener("scroll", handleScroll);
			clearTimeout(scrollTimeout);
		};
	}, []);

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
			className={`character-edit flex flex-col flex-grow-1 gap-2 overflow-hidden group ${
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
					className="w-auto overflow-y-auto snap-y snap-proximity flex-grow-1 group-[&.sort-view]:flex-grow-0 group-[&.sort-view]:w-0"
					role="application"
					aria-label="Available characters drop zone"
					onDragEnter={availableCharactersDragEnter}
					onDragOver={dragOver}
					onDragLeave={dragLeave}
					onDrop={availableCharactersDrop}
					ref={containerRef}
				>
					<div
						className={
							"grid grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] p-x-1 gap-2"
						}
					>
						{highlightedCharacters.map((character) => (
							<RenderIfVisible
								className="snap-start"
								key={character.id}
								defaultHeight={161}
								root={containerRef}
								visibleOffset={1610}
							>
								<CharacterWidget
									key={character.id}
									character={character}
									className={"active"}
								/>
							</RenderIfVisible>
						))}
						{filteredCharacters.map((character) => (
							<RenderIfVisible
								className="snap-start"
								key={character.id}
								defaultHeight={161}
								root={containerRef}
								visibleOffset={1610}
							>
								<Suspense
									key={character.id}
									fallback={<div>Loading CharacterWidget</div>}
								>
									<CharacterWidget
										key={character.id}
										character={character}
										className={"opacity-25"}
									/>
								</Suspense>
							</RenderIfVisible>
						))}
					</div>
				</div>
				<div className="w-64 flex-grow-0 group-[&.sort-view]:flex-grow-1 group-[&.sort-view]:w-initial m-l-1em">
					<Suspense fallback={<Spinner isVisible={true} />}>
						<Memo>
							<CharacterList />
						</Memo>
					</Suspense>
				</div>
			</div>
		</div>
	);
});

export default CharacterEditView;
