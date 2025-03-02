import type { CharacterNames } from "#/constants/CharacterNames";

interface LockedStatusPersistedData {
	lockedStatus: {
		id: "lockedStatus";
		lockedStatusByCharacterIdByAllycode: LockedStatusByCharacterIdByAllycode;
	};
}
type LockedStatusByCharacterId = Record<CharacterNames, boolean>;

type LockedStatusByCharacterIdByAllycode = Record<
	string,
	LockedStatusByCharacterId
>;

export type {
	LockedStatusByCharacterId,
	LockedStatusByCharacterIdByAllycode,
	LockedStatusPersistedData,
};
