/**
 * A class to hold static settings for each character that the optimizer knows about.
 */
import type { CharacterNames } from "../constants/characterSettings";

const alignments = new Map<AnyAlignments, BaseCharacterAlignments>(
  [
    ['light', 'light'],
    ['dark', 'dark'],
    ['Light Side', 'light'],
    ['Dark Side', 'dark'],
    ['', '']
  ]
);

type BaseCharacterAlignments = 'light' | 'dark' | '';
export type FlatBaseCharacterAlignments = 'Dark Side' | 'Light Side' | '';
type AnyAlignments = BaseCharacterAlignments | FlatBaseCharacterAlignments;

export interface IFlatBaseCharacter {
  baseID: CharacterNames;
  name: string;
  avatarUrl: string;
  tags: string[];
  description: string;
  alignment: FlatBaseCharacterAlignments;
}

export type FlatBaseCharacters = {
  [characterID in CharacterNames]: IFlatBaseCharacter
}

export type BaseCharacters = {
  [characterID in CharacterNames]: BaseCharacter
}

/**
 * Class to hold Character information that doesn't change, except with a game update.
 */
export class BaseCharacter {
  baseID: CharacterNames;
  name: string;
  avatarUrl: string;
  tags: string[];
  description: string;
  alignment: BaseCharacterAlignments;

  static defaultAvatarUrl: string = '//swgoh.gg/static/img/assets/blank-character.png';

  constructor(
    baseID: CharacterNames,
    name: string,
    avatarUrl = 'https://swgoh.gg/static/img/assets/blank-character.png',
    tags = [] as string[],
    description = '',
    alignment = '' as AnyAlignments
  ) {
    this.baseID = baseID;
    this.name = name;
    if (avatarUrl.startsWith('/')) {
      this.avatarUrl = `https://swgoh.gg${avatarUrl}`;
    } else {
      this.avatarUrl = avatarUrl;
    }
    this.tags = tags;
    this.description = description;    
    this.alignment = alignments.get(alignment)!;

    Object.freeze(this);
  }

  getDisplayName() {
    return this.name || this.baseID;
  }

  serialize() {
    return this;
  }

  static deserialize(flatBaseChar: IFlatBaseCharacter | null): BaseCharacter | null {
    if (flatBaseChar) {
      return new BaseCharacter(
        flatBaseChar.baseID,
        flatBaseChar.name,
        flatBaseChar.avatarUrl,
        flatBaseChar.tags,
        flatBaseChar.description,
        flatBaseChar.alignment
      );
    } else {
      return null;
    }
  }
}
