import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import type { Pips } from "#/domain/Pips";
import type { GIMOSlots } from "#/domain/types/ModTypes";

interface Combination {
	slot: GIMOSlots;
	modset: GIMOSetStatNames;
	primaryStats: string[];
	pips: Pips;
}

type CombinationKey = `${GIMOSlots}-${GIMOSetStatNames}-${Pips}-${string}`;
type RequirementsCountByCombination = Map<
	CombinationKey,
	{ combination: Combination; count: number }
>;
function getCombinationKey(combination: Combination) {
	return `${combination.slot}-${combination.modset}-${combination.pips}-${combination.primaryStats.join(",")}` as const satisfies CombinationKey;
}

export {
	type Combination,
	type CombinationKey,
	type RequirementsCountByCombination,
	getCombinationKey,
};
