// react
import * as React from "react";
import { observer, Show, useValue } from "@legendapp/state/react";
import { useTranslation } from "react-i18next";

// state
import { review$ } from "#/modules/review/state/review";

// components
import { LegendList, type LegendListRef } from "@legendapp/list/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import CharacterAvatarMobile from "../components/CharacterAvatarMobile";
import CharacterModdingView from "../components/CharacterModdingView";
import ActionsWidget from "../components/ActionsWidget";
import DisplayWidget from "../components/DisplayWidget";
import { SummaryWidget } from "../components/SummaryWidget";

import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";

import { Label } from "#ui/label";

const ReviewMobile: React.FC = observer(() => {
	const [t] = useTranslation("optimize-ui");
	const charactersInCompilation = useValue(review$.charactersInCompilation);
	const selectedCharacter = useValue(review$.selectedCharacter);
	const oldCompilationValue = useValue(review$.oldCompilationValue);
	const newCompilationValue = useValue(review$.newCompilationValue);
	const modUpgradeCost = useValue(review$.modUpgradeCost);
	const modRemovalCost = useValue(review$.modRemovalCost);
	const removedModsCount = useValue(review$.removedModsCount);

	const focusedIndex = useValue(review$.focusedCharacterIndex);

	const focusedCharacterIndex = Math.min(
		focusedIndex,
		Math.max(0, charactersInCompilation.length - 1),
	);

	const listRef = React.useRef<LegendListRef>(null);

	const getScrollElement = (): HTMLElement | null =>
		listRef.current?.getScrollableNode() ?? null;

	const focusAvatarAt = (index: number) => {
		const element = getScrollElement();
		if (!element) return;
		let attempts = 0;
		const tryFocus = () => {
			const avatar = element.querySelector<HTMLElement>(
				`[data-character-index="${index}"]`,
			);
			if (avatar) {
				avatar.focus();
				return;
			}
			if (attempts < 60) {
				attempts += 1;
				requestAnimationFrame(tryFocus);
			}
		};
		tryFocus();
	};

	const selectCharacterAt = (index: number, animated = true) => {
		if (charactersInCompilation.length === 0) return;
		const clamped = Math.max(
			0,
			Math.min(charactersInCompilation.length - 1, index),
		);
		review$.focusedCharacterIndex.set(clamped);
		review$.selectedCharacter.set(charactersInCompilation[clamped].id);
		listRef.current?.scrollToIndex({
			index: clamped,
			animated,
			viewPosition: 0.5,
		});
		focusAvatarAt(clamped);
	};

	const selectPrevious = () => {
		selectCharacterAt(review$.focusedCharacterIndex.get() - 1);
	};

	const selectNext = () => {
		selectCharacterAt(review$.focusedCharacterIndex.get() + 1);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		if (e.key === "ArrowRight") {
			e.preventDefault();
			selectNext();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			selectPrevious();
		} else if (e.key === "Home") {
			e.preventDefault();
			selectCharacterAt(0);
		} else if (e.key === "End") {
			e.preventDefault();
			selectCharacterAt(charactersInCompilation.length - 1);
		} else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			const currentIndex = review$.focusedCharacterIndex.get();
			if (currentIndex >= 0 && currentIndex < charactersInCompilation.length) {
				review$.selectedCharacter.set(charactersInCompilation[currentIndex].id);
			}
		}
	};

	return (
		<div className="flex flex-col h-full w-full overflow-hidden">
			<div className="flex flex-wrap justify-center items-stretch p-y-2 gap-2">
				<div className="h-24 w-[90%] flex flex-gap-4 items-center">
					<button
						type="button"
						aria-label="Select previous character"
						className="shrink-0 cursor-pointer"
						onClick={selectPrevious}
					>
						<ArrowLeft size={64} />
					</button>
					<LegendList
						ref={listRef}
						data={charactersInCompilation}
						horizontal
						renderItem={({ item, index }) => (
							<CharacterAvatarMobile characterId={item.id} index={index} />
						)}
						keyExtractor={(item) => item.id}
						recycleItems
						className="size-full scrollbar-none overflow-x-auto select-none"
						tabIndex={0}
						role="listbox"
						aria-label="Characters"
						aria-activedescendant={`character-option-${focusedCharacterIndex}`}
						onKeyDown={handleKeyDown}
					/>
					<button
						type="button"
						aria-label="Select next character"
						className="shrink-0 cursor-pointer"
						onClick={selectNext}
					>
						<ArrowRight size={64} />
					</button>
				</div>
			</div>
			<div className="flex gap-4 justify-center">
				<Show
					if={() => 0 === charactersInCompilation.length}
					else={<CharacterModdingView characterName={selectedCharacter} />}
				>
					<Show
						if={() => 0 === removedModsCount}
						else={<Label>{t("review.AllModsMoved")}</Label>}
					>
						<div>
							<Label>You don't have any mods left to move! Great job!</Label>
							<Label>Don't forget to assign mods to all your pilots!</Label>
						</div>
					</Show>
				</Show>
				<DefaultCollapsibleCard>
					<div className="flex flex-col justify-center items-stretch p-y-2 gap-4">
						<DisplayWidget />
						<ActionsWidget />
						<SummaryWidget
							currentSetValue={oldCompilationValue}
							newSetValue={newCompilationValue}
							modRemovalCost={modRemovalCost}
							modUpgradeCost={modUpgradeCost}
							numMovingMods={removedModsCount}
						/>
					</div>
				</DefaultCollapsibleCard>{" "}
			</div>
		</div>
	);
});

ReviewMobile.displayName = "ReviewMobile";

export default ReviewMobile;
