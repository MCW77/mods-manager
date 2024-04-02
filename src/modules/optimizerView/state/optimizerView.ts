// state
import { observable } from "@legendapp/state";

// domain
import { CharacterNames } from "#/constants/characterSettings";

import * as OptimizationPlan from "#/domain/OptimizationPlan";

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
