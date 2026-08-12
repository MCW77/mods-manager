// state
import {
	beginBatch,
	endBatch,
	linked,
	observable,
	type Observable,
	type ObservableObject,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type * as C3POMods from "#/modules/profilesManagement/dtos/c3po/index";
import * as C3POMappers from "#/modules/profilesManagement/mappers/c3po/index";
import type { CharacterNames } from "#/constants/CharacterNames";
import { type GIMOFlatMod, gimoSlots } from "#/domain/types/ModTypes";

import { cloneMod, deserializeMod, serializeMod, type Mod } from "#/domain/Mod";

import {
	getInitialMods,
	getinitialPersistedMods,
	type ModsObservable,
} from "../domain/ModsObservable";
import type {
	ModByIdForProfile,
	ModById,
	PersistedModById,
	PersistedModByIdForProfile,
	PersistedModByIdForProfileByAllycode,
} from "../domain/Mods";

const isObservableMod = (
	mod: Observable<Mod | undefined> | Observable<Mod>,
): mod is Observable<Mod> => {
	return mod.peek() !== undefined;
};

const mods$: ObservableObject<ModsObservable> = observable({
	persistedData: getInitialMods(),
	persistedModByIdByAllycode: getinitialPersistedMods(),
	activeModById: () => {
		const activeAllycode = profilesManagement$.activeAllycode.get();
		return (
			mods$.modByIdByAllycode[activeAllycode]?.modById ??
			observable(new Map<string, Mod>() as ModById)
		);
	},
	modByIdByAllycode: (allycode: string) => {
		return linked({
			get: () => {
				const modByIdByAllycode = mods$.persistedModByIdByAllycode.get();
				const profile = modByIdByAllycode[allycode];
				const newModById: ModByIdForProfile = {
					id: allycode,
					modById: new Map<string, Mod>(),
				};
				if (profile !== undefined) {
					for (const [modId, mod] of profile.modById.entries()) {
						newModById.modById.set(modId, deserializeMod(mod));
					}
				}
				return observable(newModById);
			},
			set: ({ value }) => {
				const newPersistedModById: PersistedModByIdForProfile = {
					id: allycode,
					modById: new Map<string, GIMOFlatMod>(),
				};
				for (const [modId, mod] of value.modById.entries()) {
					newPersistedModById.modById.set(modId, serializeMod(mod));
				}
				mods$.persistedModByIdByAllycode[allycode].set(newPersistedModById);
			},
		});
	},
	addProfile: (allycode: string) => {
		if (Object.hasOwn(mods$.persistedModByIdByAllycode.peek(), allycode))
			return;
		mods$.persistedModByIdByAllycode[allycode].set({
			id: allycode,
			modById: new Map<string, GIMOFlatMod>(),
		});
	},
	deleteProfile: (allycode: string) => {
		delete mods$.persistedModByIdByAllycode[allycode];
	},
	reset: () => {
		beginBatch();
		mods$.persistedData.set(getInitialMods());
		mods$.persistedModByIdByAllycode.set(getinitialPersistedMods());
		endBatch();
	},
	toPersistable: () => {
		const modsPersistedData = mods$.persistedData.get();
		const allycodes = Object.keys(modsPersistedData);
		const result: PersistedModByIdForProfileByAllycode = {};
		for (const allycode of allycodes) {
			const modById: PersistedModById = new Map<string, GIMOFlatMod>();
			for (const [modId, mod] of modsPersistedData[allycode].modById) {
				modById.set(modId, serializeMod(mod));
			}
			result[allycode] = {
				id: allycode,
				modById: modById,
			};
		}
		return result;
	},
	importModsFromC3PO: (modsJSON: string) => {
		let totalMods = 0;
		try {
			const unequippedC3POMods: C3POMods.C3POModDTO[] =
				JSON.parse(modsJSON).inventory.unequippedMod;
			const unequippedMods = unequippedC3POMods.map((mod) =>
				C3POMappers.ModMapper.fromC3PO(mod),
			);
			for (const mod of unequippedMods) {
				mods$.activeModById[mod.id].set(mod);
			}
			totalMods = unequippedMods.length;
			return {
				error: "",
				totalMods: totalMods,
			};
		} catch (error) {
			return {
				error: (error as Error).message,
				totalMods: 0,
			};
		}
	},
	reassignMod: (modId: string, newCharacterId: CharacterNames) => {
		const modToReassign$ = mods$.activeModById[modId];
		if (modToReassign$ === undefined) return;
		const modToReassign = modToReassign$.peek() as Mod | undefined;
		if (modToReassign === undefined) return;
		const currentlyEquippedModId =
			mods$.activeModById
				.values()
				.find(
					(mod) =>
						mod.slot === modToReassign.slot &&
						mod.characterID === newCharacterId,
				)?.id ?? "";
		beginBatch();
		if (currentlyEquippedModId !== "") {
			const currentlyEquippedMod$ = mods$.activeModById[currentlyEquippedModId];
			if (isObservableMod(currentlyEquippedMod$)) {
				const currentlyEquippedMod = currentlyEquippedMod$.peek() as
					| Mod
					| undefined;
				if (currentlyEquippedMod !== undefined) {
					const newMod = cloneMod(currentlyEquippedMod);
					newMod.characterID = "null";
					currentlyEquippedMod$.set(newMod);
				}
			}
		}
		const newMod = cloneMod(modToReassign);
		newMod.characterID = newCharacterId;
		modToReassign$.set(newMod);
		endBatch();
	},
	reassignMods: (mods: Mod[], newCharacterId: CharacterNames) => {
		beginBatch();
		for (const mod of mods) {
			mods$.reassignMod(mod.id, newCharacterId);
		}
		endBatch();
	},
	unequipMod: (modId: string) => {
		const modToUnequip$ = mods$.activeModById[modId];
		if (!isObservableMod(modToUnequip$)) return;
		const modToUnequip = modToUnequip$.peek() as Mod | undefined;
		if (modToUnequip === undefined) return;
		const newMod = cloneMod(modToUnequip);
		newMod.characterID = "null";
		modToUnequip$.set(newMod);
	},
	unequipMods: (mods: Mod[]) => {
		beginBatch();
		for (const mod of mods) {
			mods$.unequipMod(mod.id);
		}
		endBatch();
	},
	deleteMod: (modId: string) => {
		const modToDelete = mods$.activeModById[modId];
		if (modToDelete.peek() === undefined) return;
		mods$.activeModById.delete(modId);
	},
	deleteMods: (mods: Mod[]) => {
		beginBatch();
		for (const mod of mods) {
			mods$.deleteMod(mod.id);
		}
		endBatch();
	},
	minimalFull6Dot: () => {
		const mods = Array.from(mods$.activeModById.get().values());
		const all6DotMods = mods.filter((mod) => mod.pips === 6);
		let minimalFull6Dot = all6DotMods.length;
		for (const slot of gimoSlots) {
			const modsInSlot = all6DotMods.filter((mod) => mod.slot === slot);
			if (modsInSlot.length < minimalFull6Dot) {
				minimalFull6Dot = modsInSlot.length;
			}
		}
		return minimalFull6Dot;
	},
});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	mods$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		mods$.persistedModByIdByAllycode.set({});
		return;
	}
	mods$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	mods$.persistedModByIdByAllycode,
	persistOptions({
		persist: {
			name: "Mods",
		},
		initial: getinitialPersistedMods(),
	}),
);

export { mods$, syncStatus$ };

/*
 */
