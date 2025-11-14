import type { CharacterNames } from "#/constants/CharacterNames.js";

interface LockedStatusPersistedData {
	lockedStatus: {
		id: "lockedStatus";
		lockedCharactersByAllycode: LockedCharactersByAllycode;
	};
}
type LockedCharacters = Set<CharacterNames>;

type LockedCharactersByAllycode = Record<string, LockedCharacters>;

export type {
	LockedCharacters,
	LockedCharactersByAllycode,
	LockedStatusPersistedData,
};
