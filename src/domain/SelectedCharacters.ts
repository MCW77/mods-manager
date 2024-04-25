// domain
import type { CharacterNames } from "../constants/characterSettings";

import type { OptimizationPlan } from "./OptimizationPlan";

export type SelectedCharacters = SelectedCharacter[];

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
