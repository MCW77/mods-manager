// state
import { observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames.js";

import * as OptimizationPlan from "#/domain/OptimizationPlan.js";

type Views = "basic" | "review" | "edit";
interface CurrentCharacter {
	id: CharacterNames;
	index: number;
	target: OptimizationPlan.OptimizationPlan;
}

interface OptimizerView {
	view: Views;
	currentCharacter: CurrentCharacter;
}

export const optimizerView$ = observable<OptimizerView>({
	view: "basic" as Views,
	currentCharacter: {
		id: "null" as CharacterNames,
		index: 0,
		target: OptimizationPlan.createOptimizationPlan("Speed"),
	},
});
