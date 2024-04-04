// domain
import { CharacterNames } from "#/constants/characterSettings";

import { Mod } from "#/domain/Mod";
import { OptimizationPlan } from "#/domain/OptimizationPlan";
import { MissedGoals } from "#/domain/PlayerProfile";

interface ModAssignment {
	id: CharacterNames;
	target: OptimizationPlan;
	assignedMods: Mod[];
	missedGoals: MissedGoals;
	messages?: string[];
}

type ModAssignments = ModAssignment[];

export type { ModAssignment, ModAssignments };
