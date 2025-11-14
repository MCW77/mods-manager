// domain
import type { BaseCharacterById } from "./BaseCharacter.js";

interface CharactersObservable {
	baseCharacterById: () => Promise<BaseCharacterById>;
}

export type { CharactersObservable };
