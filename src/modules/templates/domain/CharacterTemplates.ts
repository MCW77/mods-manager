// domain
import type {
	SelectedCharacters,
	ShortSelectedCharacters,
} from "../../../domain/SelectedCharacters";

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
export type ShortCharacterTemplates = ShortCharacterTemplate[];

interface ShortCharacterTemplate {
	id: string;
	category: string;
	selectedCharacters: ShortSelectedCharacters;
}

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
