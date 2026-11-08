// domain
import type { BaseCharacterById } from "./BaseCharacter";

interface CharactersObservable {
  baseCharacterById: BaseCharacterById;
  fetchBaseCharacters: () => Promise<BaseCharacterById>;
}

export type { CharactersObservable };
