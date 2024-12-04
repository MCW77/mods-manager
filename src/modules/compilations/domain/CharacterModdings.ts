// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { MissedGoals } from "./MissedGoals";

interface FlatCharacterModding {
	characterId: CharacterNames;
	target: OptimizationPlan;
	assignedMods: string[];
	missedGoals: MissedGoals;
	messages?: string[];
}

interface CharacterModding {
	characterId: CharacterNames;
	target: OptimizationPlan;
	assignedMods: Mod[];
	missedGoals: MissedGoals;
	messages?: string[];
}

const createCharacterModding = (
	characterId: CharacterNames,
	target: OptimizationPlan,
	assignedMods: Mod[],
	missedGoals: MissedGoals = [],
	messages: string[] = [],
): CharacterModding => ({
	characterId,
	target,
	assignedMods,
	missedGoals,
	messages,
});

type FlatCharacterModdings = FlatCharacterModding[];
type CharacterModdings = CharacterModding[];

export {
	type FlatCharacterModding,
	type FlatCharacterModdings,
	type CharacterModding,
	type CharacterModdings,
	createCharacterModding,
};
