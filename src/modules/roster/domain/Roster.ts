import type { CharacterById } from "#/domain/Character";

interface CharacterByIdForProfile {
	id: string;
	characterById: CharacterById;
}
type RosterPersistedData = Record<string, CharacterByIdForProfile>;

export type { RosterPersistedData, CharacterByIdForProfile };
