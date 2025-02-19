// state
import type { Observable } from "@legendapp/state";

// domain
import type { PlayerProfile } from "./PlayerProfile";
import type { Profiles, PersistedProfiles } from "./Profiles";
import type { CharacterNames } from "#/constants/CharacterNames";
import type { Mod } from "#/domain/Mod";

interface ProfilesManagementObservable {
	defaultProfile: PlayerProfile;
	lastProfileAdded: string;
	lastProfileDeleted: string;
	profiles: Profiles;
	now: number;
	activeLastUpdated: () => string;
	activePlayer: () => string;
	activeProfile: () => Observable<PlayerProfile>;
	hasProfileWithAllycode: (allycode: string) => boolean;
	hasProfiles: () => boolean;
	addProfile: (allycode: string, name: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allycode: string) => void;
	updateProfile: (profile: PlayerProfile) => void;
	reset: () => void;
	importModsFromC3PO: (modsJSON: string) => {
		error: string;
		totalMods: number;
	};
	toPersistable: () => PersistedProfiles;
	toJSON: () => string;
	fromJSON: (profilesManagementJSON: string) => PersistedProfiles;
	reassignMod: (modId: string, characterId: CharacterNames) => void;
	reassignMods: (mods: Mod[], characterId: CharacterNames) => void;
	unequipMod: (modId: string) => void;
	unequipMods: (mods: Mod[]) => void;
	deleteMod: (modId: string) => void;
	deleteMods: (mods: Mod[]) => void;
}

export type { ProfilesManagementObservable };
