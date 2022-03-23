/**
 * interface to hold static settings for each character that the optimizer knows about.
 */
import groupByKey from "../utils/groupByKey";
import type { CharacterNames } from "../constants/characterSettings";

export type APIBaseCharacterAlignments = 0 | 1 | 2 | 3;
export type BaseCharacterAlignments =
  'noforce'
  | 'neutral'
  | 'light'
  | 'dark'
;

export interface APIBaseCharacterCategory {
  display: string;
  key: string;
}
export interface APIBaseCharacter {
  baseId: CharacterNames;
  name: string;
  baseImage: string;
  categories: string[];
  description: string;
  alignment: APIBaseCharacterAlignments;
  role: APIBaseCharacterCategory[];
  shipSlot: number;
  affiliation: APIBaseCharacterCategory[];
  species: APIBaseCharacterCategory[];
  profession: APIBaseCharacterCategory[];
}

export interface BaseCharacter {
  baseID: CharacterNames;
  name: string;
  avatarUrl: string;
  categories: string[];
  description: string;
  alignment: BaseCharacterAlignments;
}

const API2BaseCharacterAlignment = {
  0: 'noforce',
  1: 'neutral',
  2: 'light',
  3: 'dark',  
}

export function mapAPI2BaseCharactersById(baseCharacters: APIBaseCharacter[]) {
  return groupByKey(
    baseCharacters.map(bc => {
      const categories = bc.affiliation
        .concat(bc.profession)
        .concat(bc.role)
        .concat(bc.species)
        .map(category => category.display)
        .concat(bc.shipSlot !== 0 ? ['Crew Member'] : [])
      ;
      return {
        baseID: bc.baseId,
        name: bc.name,
        avatarUrl: `https://api.hotutils.com/images${bc.baseImage}`,
        categories: categories,
        description: bc.description,
        alignment: API2BaseCharacterAlignment[bc.alignment],
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
  alignment: 'light',
} as BaseCharacter;
