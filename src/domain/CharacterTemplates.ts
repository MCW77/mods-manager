// domain
import type { SelectedCharacters } from "./SelectedCharacters";

/**
 * ```
 * {
 *   id: string,
 *   selectedCharacters: {
 *     id: CharacterNames,
 *     target: OptimizationPlan
 *   }[]
 * }[]
 * ```
 */
export type CharacterTemplates = CharacterTemplate[];

/**
 * ```
 * {
 *   id: string,
 *   selectedCharacters: {
 *     id: CharacterNames,
 *     target: OptimizationPlan
 *   }[]
 * }
 * ```
 */
export interface CharacterTemplate {
	id: string;
	selectedCharacters: SelectedCharacters;
}

/**
 * ```
 * {
 *   [key: string]: {
 *     id: string,
 *     selectedCharacters: {
 *       id: CharacterNames,
 *       target: OptimizationPlan
 *     }[]
 *   }
 * }
 * ```
 */
export type CharacterTemplatesByName = Record<string, CharacterTemplate>;
