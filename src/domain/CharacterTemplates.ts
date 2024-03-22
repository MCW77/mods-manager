// domain
import { SelectedCharacters } from "./SelectedCharacters";

/**
 * ```
 * {
 *   name: string,
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
 *   name: string,
 *   selectedCharacters: {
 *     id: CharacterNames,
 *     target: OptimizationPlan
 *   }[]
 * }
 * ```
 */
export interface CharacterTemplate {
	name: string;
	selectedCharacters: SelectedCharacters;
}

/**
 * ```
 * {
 *   [key: string]: {
 *     name: string,
 *     selectedCharacters: {
 *       id: CharacterNames,
 *       target: OptimizationPlan
 *     }[]
 *   }
 * }
 * ```
 */
export type CharacterTemplatesByName = Record<string, CharacterTemplate>;
