// state
import type { Observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { Mod } from "#/domain/Mod";
import type {
	ModById,
	ModByIdForProfile,
	ModsDataToPersist,
	PersistedModByIdForProfileByAllycode,
} from "./Mods";

interface ModsObservable {
	persistedData: ModsDataToPersist;
	persistedModByIdByAllycode: PersistedModByIdForProfileByAllycode;
	modByIdByAllycode: (allycode: string) => Observable<ModByIdForProfile>;
	activeModById: () => Observable<ModById>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	toPersistable: () => PersistedModByIdForProfileByAllycode;
	importModsFromC3PO: (modsJSON: string) => {
		error: string;
		totalMods: number;
	};
	reassignMod: (modId: string, characterId: CharacterNames) => void;
	reassignMods: (mods: Mod[], characterId: CharacterNames) => void;
	unequipMod: (modId: string) => void;
	unequipMods: (mods: Mod[]) => void;
	deleteMod: (modId: string) => void;
	deleteMods: (mods: Mod[]) => void;
	minimalFull6Dot: () => number;
}

const getInitialMods = (): ModsDataToPersist => {
	const mods: ModsDataToPersist = {};
	return mods;
};

const getinitialPersistedMods = (): PersistedModByIdForProfileByAllycode => {
	const persistedMods: PersistedModByIdForProfileByAllycode = {};
	return persistedMods;
};

export { getInitialMods, getinitialPersistedMods, type ModsObservable };
