// domain
import type { CharacterNames } from "#/constants/characterSettings";

import type { Mod } from "#/domain/Mod";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { MissedGoals } from "#/domain/PlayerProfile";

interface ModAssignment {
	id: CharacterNames;
	target: OptimizationPlan;
	assignedMods: Mod[];
	missedGoals: MissedGoals;
	messages?: string[];
}

const createModAssignment = (
	id: CharacterNames,
	target: OptimizationPlan,
	assignedMods: Mod[],
	missedGoals: MissedGoals = [],
	messages: string[] = [],
): ModAssignment => ({
	id,
	target,
	assignedMods,
	missedGoals,
	messages,
});

type ModAssignments = ModAssignment[];

export { type ModAssignment, type ModAssignments, createModAssignment };

