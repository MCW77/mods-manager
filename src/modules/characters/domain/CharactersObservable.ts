// domain
import type { BaseCharacterById } from "./BaseCharacter";

interface CharactersObservable {
	baseCharacterById: () => Promise<BaseCharacterById>;
}

export type { CharactersObservable };
