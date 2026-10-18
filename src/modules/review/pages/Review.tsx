// react
import { useCallback, useEffect, useRef } from "react";
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

	const focusedIndex = useValue(review$.focusedCharacterIndex);

	const focusedCharacterIndex = Math.min(
		focusedIndex,
		Math.max(0, charactersInCompilation.length - 1),
	);

	const listRef = useRef<LegendListRef>(null);
	const dragState = useRef<{
		pointerId: number;
		lastX: number;
		moved: boolean;
	} | null>(null);
	const suppressClickRef = useRef(false);

	const getScrollElement = (): HTMLElement | null =>
		listRef.current?.getScrollableNode() ?? null;

	// Touch already pans natively, and Chrome does not translate a vertical
	// wheel gesture into horizontal scrolling, so dragging with the mouse is
	// the only way to scroll the list on desktop.
	//
	// The drag is tracked with window level listeners instead of
	// `setPointerCapture`: capturing the pointer retargets the compatibility
	// mouse events to the capture target, which would keep the avatars from
	// receiving click and double click events.
	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.pointerType !== "mouse" || e.button !== 0) return;
		const element = getScrollElement();
		if (!element) return;

		dragState.current = {
			pointerId: e.pointerId,
			lastX: e.clientX,
			moved: false,
		};

		const handleMove = (event: PointerEvent) => {
			const drag = dragState.current;
			if (!drag || drag.pointerId !== event.pointerId) return;
			const deltaX = event.clientX - drag.lastX;
			if (!drag.moved && Math.abs(deltaX) < 3) return;
			drag.moved = true;
			drag.lastX = event.clientX;
			element.scrollLeft -= deltaX;
		};

		const handleUp = () => {
			// Swallow the click that follows a drag so it does not move the focus.
			suppressClickRef.current = dragState.current?.moved ?? false;
			dragState.current = null;
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
			window.removeEventListener("pointercancel", handleUp);
		};

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp);
		window.addEventListener("pointercancel", handleUp);
	};

	// Chrome's native middle click autoscroll stalls on this list: the row is a
	// single line, so the autoscroll has no vertical range and it does nothing
	// whenever the gesture has no horizontal component. Take the gesture over
	// and scroll the list ourselves.
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 1) return;
		const element = getScrollElement();
		if (!element) return;
		// Suppress the native autoscroll session so the two do not fight.
		e.preventDefault();
		const startX = e.clientX;
		const startScrollLeft = element.scrollLeft;

		const handleMove = (event: MouseEvent) => {
			const distance = event.clientX - startX;
			// Small dead zone, then accelerate with the distance from the anchor so
			// a short pull does not scroll the whole list.
			const speed =
				Math.abs(distance) < 8 ? 0 : 1 + (Math.abs(distance) - 8) / 60;
			element.scrollLeft = startScrollLeft + distance * speed;
		};

		const handleUp = () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleUp);
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", handleUp);
	};

	const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!suppressClickRef.current) return;
		suppressClickRef.current = false;
		e.stopPropagation();
		e.preventDefault();
	};

	const focusAvatarAt = (index: number) => {
		const element = getScrollElement();
		if (!element) return;
		// The item may not be rendered yet, so retry until it shows up.
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

	const focusCharacterAt = (index: number, animated = true) => {
		if (charactersInCompilation.length === 0) return;
		const clamped = Math.max(
			0,
			Math.min(charactersInCompilation.length - 1, index),
		);
		review$.focusedCharacterIndex.set(clamped);
		listRef.current?.scrollToIndex({
			index: clamped,
			animated,
			viewPosition: 0.5,
		});
		focusAvatarAt(clamped);
	};

	// Holding an arrow button repeats the focus shift. The first repeat waits a
	// moment, then the delay between steps shrinks the longer the button is
	// held, so it starts slow and speeds up.
	const arrowRepeatRef = useRef<{ timer: number | null } | null>(null);

	const stopArrowRepeat = useCallback(() => {
		const repeat = arrowRepeatRef.current;
		if (!repeat) return;
		if (repeat.timer !== null) window.clearTimeout(repeat.timer);
		arrowRepeatRef.current = null;
	}, []);

	const startArrowRepeat = (direction: -1 | 1) => {
		stopArrowRepeat();
		focusCharacterAt(review$.focusedCharacterIndex.get() + direction);

		const startedAt = Date.now();
		const repeat = () => {
			const elapsed = Date.now() - startedAt;
			const delay = Math.max(40, 150 - Math.floor(elapsed / 100) * 10);
			const current = review$.focusedCharacterIndex.get();
			const target = Math.max(
				0,
				Math.min(charactersInCompilation.length - 1, current + direction),
			);
			if (target === current) {
				// Already at the end of the list, stop repeating.
				stopArrowRepeat();
				return;
			}
			focusCharacterAt(target, false);
			arrowRepeatRef.current = { timer: window.setTimeout(repeat, delay) };
		};

		arrowRepeatRef.current = { timer: window.setTimeout(repeat, 400) };
	};

	// Double clicking an arrow jumps to the first or the last character.
	const lastArrowPressRef = useRef<{
		time: number;
		direction: -1 | 1;
	} | null>(null);

	const handleArrowPointerDown = (direction: -1 | 1) => {
		const now = Date.now();
		const previous = lastArrowPressRef.current;
		const isDoublePress =
			previous !== null &&
			previous.direction === direction &&
			now - previous.time < 180;
		lastArrowPressRef.current = { time: now, direction };

		if (isDoublePress) {
			stopArrowRepeat();
			focusCharacterAt(
				direction === -1 ? 0 : charactersInCompilation.length - 1,
			);
			return;
		}

		startArrowRepeat(direction);
	};

	useEffect(() => stopArrowRepeat, [stopArrowRepeat]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		if (e.key === "ArrowRight") {
			e.preventDefault();
			focusCharacterAt(focusedCharacterIndex + 1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focusCharacterAt(focusedCharacterIndex - 1);
		} else if (e.key === "Home") {
			e.preventDefault();
			focusCharacterAt(0);
		} else if (e.key === "End") {
			e.preventDefault();
			focusCharacterAt(charactersInCompilation.length - 1);
		}
	};

	return (
		<div className="flex flex-col h-full w-full overflow-hidden">
			<div className="flex flex-wrap justify-center items-stretch p-y-2 gap-2">
				<div className="h-24 w-[90%] flex flex-gap-4 items-center">
					<button
						type="button"
						aria-label="Focus previous character"
						className="shrink-0 cursor-pointer"
						onPointerDown={(e) => {
							// Keep the DOM focus on the list so the arrow keys keep working.
							e.preventDefault();
							handleArrowPointerDown(-1);
						}}
						onPointerUp={stopArrowRepeat}
						onPointerCancel={stopArrowRepeat}
						onPointerLeave={stopArrowRepeat}
						onClick={(e) => {
							// Keyboard activation only: pointer activation already moved the
							// focus on pointerdown.
							if (e.detail !== 0) return;
							focusCharacterAt(review$.focusedCharacterIndex.get() - 1);
						}}
						/*
            onDoubleClick={() => {
              stopArrowRepeat();
              focusCharacterAt(0);
              }} */
					>
						<ArrowLeft size={64} />
					</button>
					<LegendList
						ref={listRef}
						data={charactersInCompilation}
						horizontal
						renderItem={({ item, index }) => (
							<CharacterAvatar characterId={item.id} index={index} />
						)}
						keyExtractor={(item) => item.id}
						recycleItems
						className="size-full scrollbar-none overflow-x-auto select-none"
						style={{ cursor: "grab" }}
						onPointerDown={handlePointerDown}
						onMouseDown={handleMouseDown}
						onClickCapture={handleClickCapture}
						tabIndex={0}
						role="listbox"
						aria-label="Characters"
						aria-activedescendant={`character-option-${focusedCharacterIndex}`}
						onKeyDown={handleKeyDown}
					/>
					<button
						type="button"
						aria-label="Focus next character"
						className="shrink-0 cursor-pointer"
						onPointerDown={(e) => {
							// Keep the DOM focus on the list so the arrow keys keep working.
							e.preventDefault();
							handleArrowPointerDown(1);
						}}
						onPointerUp={stopArrowRepeat}
						onPointerCancel={stopArrowRepeat}
						onPointerLeave={stopArrowRepeat}
						onClick={(e) => {
							// Keyboard activation only: pointer activation already moved the
							// focus on pointerdown.
							if (e.detail !== 0) return;
							focusCharacterAt(review$.focusedCharacterIndex.get() + 1);
						}}
						/*
            onDoubleClick={() => {
              stopArrowRepeat();
              focusCharacterAt(charactersInCompilation.length - 1);
            }}
           */
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
