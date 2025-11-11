// utils
import { cn } from "#/lib/utils";

// react
import { useObservable } from "@legendapp/state/react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const lockedStatus$ = stateLoader$.lockedStatus$;

// domain
import type * as Character from "#/domain/Character";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { LockedToggle } from "#/components/LockedToggle/LockedToggle";

function CharacterTargetStatusIcons(
	character: Character.Character,
	target: OptimizationPlan.OptimizationPlan,
) {
	const isLocked$ = useObservable(() => {
		const _reactiveIsLocked =
			lockedStatus$.lockedCharactersForActivePlayer.get();
		return lockedStatus$.isCharacterLockedForActivePlayer(character.id);
	});
	const restrictionsActive = OptimizationPlan.hasRestrictions(target);
	const targetStatActive = target.targetStats?.length > 0;
	const negativeWeightsActive = OptimizationPlan.hasNegativeWeights(target);
	const blankTargetActive = OptimizationPlan.isBlank(target);

	return (
		<div className={"flex justify-between grid-col-2 grid-row-2"}>
			<span
				className={cn(
					`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:160px_32px] bg-[position:-32px_-16px] w-[16px] h-[16px] leading-6 text-center mx-0.5 p-0`,
					restrictionsActive ? "bg-[position:-32px_0px]" : "",
				)}
				title={
					restrictionsActive
						? "This character has restrictions active"
						: "This character has no restrictions active"
				}
			/>
			<span
				className={cn(
					`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:160px_32px] bg-[position:-48px_-16px] w-[16px] h-[16px] leading-6 text-center mx-0.5 p-0`,
					targetStatActive ? "bg-[position:-48px_0px]" : "",
				)}
				title={
					targetStatActive
						? "This character has a target stat selected"
						: "This character has no target stat selected"
				}
			/>
			<span
				className={cn(
					`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:160px_32px] bg-[position:-80px_-16px] w-[16px] h-[16px] leading-6 text-center mx-0.5 p-0`,
					negativeWeightsActive ? "bg-[position:-80px_0px]" : "",
				)}
				title={
					negativeWeightsActive
						? "This character's target has negative stat weights"
						: "This character's target has no negative stat weights"
				}
			/>
			<span
				className={cn(
					`inline-block text-xs bg-[url('/img/character_icons.webp')] bg-[length:160px_32px] bg-[position:-112px_-16px] size-[16px] leading-6 text-center mx-0.5 p-0`,
					blankTargetActive ? "bg-[position:-112px_0px]" : "",
				)}
				title={
					blankTargetActive
						? "This character's target has no assigned stat weights"
						: "This character's target has at least one stat given a value"
				}
			/>
			<LockedToggle
				$pressed={isLocked$}
				onPressedChange={() => {
					lockedStatus$.toggleCharacterForActivePlayer(character.id);
				}}
			/>
		</div>
	);
}

export { CharacterTargetStatusIcons };
