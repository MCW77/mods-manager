// react
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer, Show, useValue } from "@legendapp/state/react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import { characterSettings } from "#/constants/characterSettings";

import * as Character from "#/domain/Character";

// components
import { RenderIfVisible } from "#/components/RenderIfVisible/RenderIfVisible";
import { ScrollArea } from "#/components/custom/ScrollArea";
import CharacterBlock from "./CharacterBlock";

const CharacterList = observer(
	React.memo(() => {
		const [t] = useTranslation("optimize-ui");
		const characterById = useValue(
			profilesManagement$.activeProfile.characterById,
		);
		const selectedCharacters = useValue(
			compilations$.defaultCompilation.selectedCharacters,
		);

		const containerRef = useRef<HTMLDivElement>(null);
		const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
		const [disableLazyLoad, setDisableLazyLoad] = useState(false);
		const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
		const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (!containerRef.current) return;

			const container = containerRef.current;
			const mouseY = event.clientY;

			// Clear any existing drop-character classes
			for (const el of container.children) {
				el.classList.remove("drop-character", "drop-character-before");
			}

			if (selectedCharacters.length === 0) {
				// Empty list case - show feedback on container
				container.classList.add("drop-character");
				setDragOverIndex(null);
				return;
			}

			// Find the insertion point based on mouse position
			let dropIndex: number | null | undefined;

			for (let i = 0; i < container.children.length; i++) {
				const rect = container.children[i].getBoundingClientRect();
				const elementCenter = rect.top + rect.height / 2;

				if (mouseY < elementCenter) {
					// Insert before this element
					dropIndex = i === 0 ? null : i - 1; // null means before first element
					break;
				}
			}

			// If no match found, insert at end
			if (dropIndex === undefined) {
				// For dropping at the very end, we want to insert after the last element
				// Use a special value to indicate "after last element"
				dropIndex = selectedCharacters.length - 1; // This will be our "insert at end" indicator
			}

			setDragOverIndex(dropIndex);

			// Apply visual feedback
			if (dropIndex === null) {
				// Inserting at beginning - we need to show feedback above first element
				if (container.children[0]) {
					container.children[0].classList.add("drop-character-before");
				}
			} else {
				// Inserting between elements - highlight the element after which we'll insert
				if (container.children[dropIndex]) {
					container.children[dropIndex].classList.add("drop-character");
				}
			}
		};

		const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
			// Only clear feedback when truly leaving the container
			const relatedTarget = event.relatedTarget as Node;
			if (!containerRef.current?.contains(relatedTarget)) {
				setDragOverIndex(null);
				// Clear all drop-character classes
				if (containerRef.current) {
					containerRef.current.classList.remove("drop-character");
					const characterElements = containerRef.current.querySelectorAll(
						"[data-character-index]",
					);
					for (const el of characterElements) {
						el.classList.remove("drop-character", "drop-character-before");
					}
				}
			}
		};

		const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			const options = JSON.parse(
				event.dataTransfer.getData("application/json"),
			);

			// Disable lazy loading temporarily to prevent flickering during reorder
			setDisableLazyLoad(true);

			// Clear any existing timeout
			if (disableTimeoutRef.current) {
				clearTimeout(disableTimeoutRef.current);
			}

			switch (options.effect) {
				case "add": {
					const movingCharacterID: CharacterNames = event.dataTransfer.getData(
						"text/plain",
					) as CharacterNames;
					const movingCharacter = characterById[movingCharacterID];
					compilations$.selectCharacter(
						movingCharacterID,
						Character.defaultTarget(characterSettings, movingCharacter),
						dragOverIndex,
					);
					break;
				}
				case "move": {
					const movingCharacterIndex =
						+event.dataTransfer.getData("text/plain");
					compilations$.moveSelectedCharacter(
						movingCharacterIndex,
						dragOverIndex,
					);
					break;
				}
				default:
				// Do nothing
			}

			// Clean up
			setDragOverIndex(null);
			if (containerRef.current) {
				containerRef.current.classList.remove("drop-character");
				const characterElements = containerRef.current.querySelectorAll(
					"[data-character-index]",
				);
				for (const el of characterElements) {
					el.classList.remove("drop-character", "drop-character-before");
				}
			}

			// Re-enable lazy loading after React has finished reordering
			disableTimeoutRef.current = setTimeout(() => {
				setDisableLazyLoad(false);
				disableTimeoutRef.current = null;
			}, 500); // 500ms should be enough for React to complete the reorder
		};

		// Cleanup timeout on unmount
		useEffect(() => {
			return () => {
				if (disableTimeoutRef.current) {
					clearTimeout(disableTimeoutRef.current);
				}
			};
		}, []);

		// Disable scroll snap while actively scrolling
		useEffect(() => {
			const container = containerRef.current;
			if (!container) return;
			// Find the ScrollArea viewport element
			const viewport = container.querySelector(
				'[class*="rounded-[inherit]"]',
			) as HTMLElement;
			if (!viewport) return;

			let scrollTimeout: NodeJS.Timeout;

			const handleScroll = () => {
				// Disable snap type while scrolling
				viewport.style.scrollSnapType = "none";

				// Clear any existing timeout
				clearTimeout(scrollTimeout);

				// Re-enable snap type after 300ms of no scrolling
				scrollTimeout = setTimeout(() => {
					viewport.style.scrollSnapType = "y mandatory";
				}, 300);
			};

			viewport.addEventListener("scroll", handleScroll, { passive: true });

			return () => {
				viewport.removeEventListener("scroll", handleScroll);
				clearTimeout(scrollTimeout);
			};
		}, []);

		return (
			<div
				ref={containerRef}
				className="h-full"
				role="application"
				aria-label="Available characters drop zone"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<ScrollArea className="h-full p-y-1 p-r-1 m-r-2 snap-y snap-mandatory scroll-smooth overscroll-contain">
					<div className="group-[&.sort-view]:grid group-[&.sort-view]:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] group-[&.sort-view]:auto-rows-min group-[&.sort-view]:gap-2">
						<Show
							if={
								compilations$.defaultCompilation.selectedCharacters.length === 0
							}
							else={() =>
								selectedCharacters.map(({ id, target }, index) => (
									<RenderIfVisible
										key={id}
										data-character-index={index}
										className="[&.drop-character]:shadow-[0_2px_3px_0_darkred] [&.drop-character-before]:shadow-[0_-3px_5px_0_darkred] snap-start"
										defaultHeight={148}
										root={containerRef}
										visibleOffset={1480}
										disabled={disableLazyLoad}
									>
										<CharacterBlock
											characterId={id}
											target={target}
											index={index}
										/>
									</RenderIfVisible>
								))
							}
						>
							<div className="max-w-full p-1 bg-slate-950/50 border-1 border-solid border-[dodgerblue] grid grid-cols-[fit-content(1em)_auto] gap-x-2 text-left [&.drop-character]:shadow-[0_2px_3px_0_darkred] min-h-[4rem] flex items-center justify-center text-gray-400">
								{t("selected.DropHere")}
							</div>
						</Show>{" "}
					</div>{" "}
				</ScrollArea>
			</div>
		);
	}),
);

CharacterList.displayName = "CharacterList";

export default CharacterList;
