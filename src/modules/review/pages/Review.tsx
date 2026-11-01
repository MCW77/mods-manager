// react
import { useRef } from "react";
import { observer, Show, useValue } from "@legendapp/state/react";
import { useTranslation } from "react-i18next";

// state
import { review$ } from "#/modules/review/state/review";

// components
import { LegendList, type LegendListRef } from "@legendapp/list/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CharacterModdingView from "../components/CharacterModdingView";
import ActionsWidget from "../components/ActionsWidget";
import CharacterAvatar from "../components/CharacterAvatar";
import DisplayWidget from "../components/DisplayWidget";
import { SummaryWidget } from "../components/SummaryWidget";
import { DefaultCollapsibleCard } from "#/components/DefaultCollapsibleCard";
import { Label } from "#ui/label";

const Review: React.FC = observer(() => {
	const [t] = useTranslation("optimize-ui");
	const charactersInCompilation = useValue(review$.charactersInCompilation);
	const selectedCharacter = useValue(review$.selectedCharacter);
	const oldCompilationValue = useValue(review$.oldCompilationValue);
	const newCompilationValue = useValue(review$.newCompilationValue);
	const modUpgradeCost = useValue(review$.modUpgradeCost);
	const modRemovalCost = useValue(review$.modRemovalCost);
	const removedModsCount = useValue(review$.removedModsCount);

	const selectedCharacterIndex = useValue(review$.selectedCharacterIndex);

	const listRef = useRef<LegendListRef>(null);

	const selectCharacterAt = async (index: number, animated = false) => {
		review$.setSelectedCharacterIndex(index);
		await listRef.current?.scrollToIndex({
			index,
			animated,
			viewPosition: 0.5,
		});
	};

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		if (e.key === "ArrowRight") {
			e.preventDefault();
			await selectCharacterAt(selectedCharacterIndex + 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			await selectCharacterAt(selectedCharacterIndex - 1);
		} else if (e.key === "Home") {
			e.preventDefault();
			await selectCharacterAt(0);
		} else if (e.key === "End") {
			e.preventDefault();
			await selectCharacterAt(charactersInCompilation.length - 1);
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
						onClick={() => selectCharacterAt(selectedCharacterIndex - 1)}
					>
						<ArrowLeft size={64} />
					</button>
					<LegendList
						ref={listRef}
						data={charactersInCompilation}
						horizontal
						renderItem={({ item, index }) => (
							<CharacterAvatar
								characterId={item.id}
								index={index}
								onClick={() => selectCharacterAt(index)}
							/>
						)}
						keyExtractor={(item) => item.id}
						recycleItems
						className="size-full scrollbar-width-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
						tabIndex={0}
						role="listbox"
						aria-label="Characters"
						aria-activedescendant={`character-option-${selectedCharacterIndex}`}
						onKeyDown={handleKeyDown}
					/>
					<button
						type="button"
						aria-label="Select next character"
						className="shrink-0 cursor-pointer"
						onClick={() => selectCharacterAt(selectedCharacterIndex + 1)}
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

Review.displayName = "Review";

export default Review;
