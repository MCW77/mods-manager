// domain
import type { CharacterNames } from "../constants/CharacterNames";

import type {
	OptimizationPlan,
	ShortOptimizationPlanParam,
} from "./OptimizationPlan";

interface ShortSelectedCharacter {
	id: CharacterNames;
	target: ShortOptimizationPlanParam;
}

/**
 * ```
 * {
 *   id: CharacterNames,
 *   target: OptimizationPlan
 * }
 * ```
 */
interface SelectedCharacter {
	id: CharacterNames;
	target: OptimizationPlan;
}

type SelectedCharacters = SelectedCharacter[];
type ShortSelectedCharacters = ShortSelectedCharacter[];

export type { SelectedCharacters, ShortSelectedCharacters };
