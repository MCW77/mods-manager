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
	modById: Record<string, GIMOFlatMod>;
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
/*
	const modById = new Map<string, Mod>(
		profile.modById.map((mod) => [mod.mod_uid, Mod.deserialize(mod)]),
	);
*/
	const modById = new Map<string, Mod>();
	for (const [modUid, mod] of Object.entries(profile.modById)) {
		if (mod !== undefined)
			modById.set(modUid, Mod.deserialize(mod));
	}

	return {
		allycode: profile.allycode,
		characterById: profile.characterById,
		modById,
		playerName: profile.playerName,
	};
}

export const getProfileToPersist = (profile: PlayerProfile): PersistedPlayerProfile => {
/*
	const modById =
		profile.modById.size > 0
			? Array.from(profile.modById.values()).map((value) => value.serialize())
			: Object.values(profile.modById).map((value) => value.serialize());
*/
	const modById: Record<string, GIMOFlatMod> = {};
	for (const [modUid, mod] of profile.modById) {
		modById[modUid] = mod.serialize();
	}

	return {
		allycode: profile.allycode,
		characterById: profile.characterById,
		modById,
		playerName: profile.playerName,
	};
};