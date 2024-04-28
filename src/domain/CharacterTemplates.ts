// domain
import type { SelectedCharacters } from "./SelectedCharacters";

/**
 * ```
 * {
 *   id: string,
 *   category: string,
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
 *   category: string,
 *   selectedCharacters: {
 *     id: CharacterNames,
 *     target: OptimizationPlan
 *   }[]
 * }
 * ```
 */
export interface CharacterTemplate {
	id: string;
	category: string;
	selectedCharacters: SelectedCharacters;
}

/**
 * ```
 * {
 *   [key: string]: {
 *     id: string,
 *  	 category: string,
 *     selectedCharacters: {
 *       id: CharacterNames,
 *       target: OptimizationPlan
 *     }[]
 *   }
 * }
 * ```
 */
export type CharacterTemplatesByName = Record<string, CharacterTemplate>;
