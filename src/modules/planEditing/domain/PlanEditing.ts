// state
import type { ObservableObject } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

type PlanEditing = ObservableObject<{
	canDeleteTarget: () => boolean;
	hasAChangedName: () => boolean;
	isUnsaveable: () => boolean;
	characterId: CharacterNames;
	namesOfBuiltinTargets: () => string[];
	namesOfUserTargets: string[];
	namesOfAllTargets: () => string[];
	isBuiltinTarget: () => boolean;
	isInAdvancedEditMode: boolean;
	isTargetChanged: () => boolean;
	isUsedTargetName: () => boolean;
	target: OptimizationPlan.OptimizationPlan;
	uneditedTarget: OptimizationPlan.OptimizationPlan;
	addSetBonus: (setName: GIMOSetStatNames) => void;
	addTargetStat: () => void;
	removeSetBonus: (setName: GIMOSetStatNames) => void;
	removeTargetStatById: (id: string) => void;
	zeroAll: () => void;
}>;

export type { PlanEditing };
