// domain
import type { CharacterNames } from "../constants/CharacterNames";

import type {
	OptimizationPlan,
	ShortOptimizationPlanParam,
} from "./OptimizationPlan";

export type SelectedCharacters = SelectedCharacter[];
export type ShortSelectedCharacters = ShortSelectedCharacter[];

export interface ShortSelectedCharacter {
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
export interface SelectedCharacter {
	id: CharacterNames;
	target: OptimizationPlan;
}

export type SelectedCharactersByTemplateName = Record<
	string,
	SelectedCharacters
>;
