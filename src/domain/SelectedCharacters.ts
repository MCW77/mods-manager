// domain
import { CharacterNames } from "../constants/characterSettings";

import { OptimizationPlan } from "./OptimizationPlan";


export type FlatSelectedCharacters = SelectedCharacter[];
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

export interface FlatSelectedCharacter {
  id: CharacterNames;
  target: OptimizationPlan;
}

export type SelectedCharactersByTemplateName = Record<string, SelectedCharacters>;