import type { CharacterNames } from "#/constants/CharacterNames";

export type LockedStatusByCharacterId = Record<CharacterNames, boolean>;

export type LockedStatusByCharacterIdByAllycode = Record<
	string,
	LockedStatusByCharacterId
>;
