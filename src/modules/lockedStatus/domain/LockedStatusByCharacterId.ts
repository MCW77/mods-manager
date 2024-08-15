import type { CharacterNames } from "#/constants/characterSettings";

export type LockedStatusByCharacterId = Record<CharacterNames, boolean>;

export type LockedStatusByCharacterIdByAllycode = Record<string, LockedStatusByCharacterId>;