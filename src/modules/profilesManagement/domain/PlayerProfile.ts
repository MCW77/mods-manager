// domain
import type { GIMOFlatMod } from "#/domain/types/ModTypes";
import type * as Character from "#/domain/Character";
import { Mod } from "#/domain/Mod";

export interface PlayerProfile {
	allycode: string;
	characterById: Character.CharacterById;
	modById: Map<string, Mod>;
	playerName: string;
}

export interface PersistedPlayerProfile {
	allycode: string;
	characterById: Character.CharacterById;
	modById: Map<string, GIMOFlatMod>;
	playerName: string;
}

export const createPlayerProfile = (
	allycode: string,
	playerName: string,
): PlayerProfile => {
	return {
		allycode,
		characterById: {} as Character.CharacterById,
		modById: new Map<string, Mod>(),
		playerName,
	};
};

export const getProfileFromPersisted = (
	profile: PersistedPlayerProfile,
): PlayerProfile => {
	const modById = new Map<string, Mod>(
		profile.modById.entries().map(([key, mod]) => [key, Mod.deserialize(mod)]),
	);

	return {
		allycode: profile.allycode,
		characterById: profile.characterById,
		modById,
		playerName: profile.playerName,
	};
};

export const getProfileToPersist = (
	profile: PlayerProfile,
): PersistedPlayerProfile => {
	const modById: Map<string, GIMOFlatMod> = new Map();
	for (const [modUid, mod] of profile.modById) {
		modById.set(modUid, mod.serialize());
	}

	return {
		allycode: profile.allycode,
		characterById: profile.characterById,
		modById,
		playerName: profile.playerName,
	};
};
