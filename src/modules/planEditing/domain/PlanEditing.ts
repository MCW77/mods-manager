// state
import type { ObservableObject } from "@legendapp/state";

// domain
import type * as Character from "#/domain/Character";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { SetStats } from "#/domain/Stats";

type PlanEditing = ObservableObject<{
	character: Character.Character;
	isDefaultTarget: () => boolean;
	isInAdvancedEditMode: boolean;
	isTargetChanged: () => boolean;
	target: OptimizationPlan.OptimizationPlan;
	uneditedTarget: OptimizationPlan.OptimizationPlan;
	addSetBonus: (setName: SetStats.GIMOStatNames) => void;
	addTargetStat: () => void;
	removeSetBonus: (setName: SetStats.GIMOStatNames) => void;
	removeTargetStatById: (id: string) => void;
	zeroAll: () => void;
}>;

export type { PlanEditing };
