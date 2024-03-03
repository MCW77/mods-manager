// domain
import { SelectedCharacters } from "./SelectedCharacters";


export type FlatCharacterTemplates = FlatCharacterTemplate[];

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

export interface FlatCharacterTemplate {
  name: string,
  selectedCharacters: SelectedCharacters
}

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
  name: string,
  selectedCharacters: SelectedCharacters
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
export interface CharacterTemplatesByName {
  [key: string]: CharacterTemplate;
};

