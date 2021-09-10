/**
 * interface to hold static settings for each character that the optimizer knows about.
 */
import groupByKey from "../utils/groupByKey";
import type { CharacterNames } from "../constants/characterSettings";

export type BaseCharacterAlignments = 'Dark Side' | 'Light Side';

export interface APIBaseCharacter {
  base_id: CharacterNames;
  name: string;
  image: string;
  categories: string[];
  description: string;
  alignment: BaseCharacterAlignments;
  role: string;
  ship_slot: number;
}

export interface BaseCharacter {
  baseID: CharacterNames;
  name: string;
  avatarUrl: string;
  categories: string[];
  description: string;
  alignment: BaseCharacterAlignments;
}

export function mapAPI2BaseCharactersById(baseCharacters: APIBaseCharacter[]) {
  return groupByKey(
    baseCharacters.map(bc => {
      return {
        baseID: bc.base_id,
        name: bc.name,
        avatarUrl: bc.image,
        categories: bc.categories
          .concat([bc.alignment])
          .concat(null !== bc.ship_slot ? ['Crew Member'] : []),
        description: bc.description,
        alignment: bc.alignment, 
      } as BaseCharacter
    })
    , (bc: BaseCharacter) => bc.baseID) as BaseCharactersById
}

export type BaseCharactersById = {
  [characterId in CharacterNames]: BaseCharacter;
}

export type BaseCharacters = BaseCharacter[];

export const defaultBaseCharacter = {
  baseID: 'FINN',
  name: '',
  avatarUrl: 'https://swgoh.gg/static/img/assets/blank-character.png',
  categories: [],
  description: '',
  alignment: 'Light Side',
} as BaseCharacter;
