// state
import {
	beginBatch,
	endBatch,
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

import { Mod } from "#/domain/Mod";

import { getInitialMods, type ModsObservable } from "../domain/ModsObservable";
import {
	getModsFromPersisted,
	isPersistedModByIdForProfileByAllycode,
	type ModById,
	type ModsDataToPersist,
	type PersistedModById,
	type PersistedModByIdForProfileByAllycode,
} from "../domain/Mods";

const isObservableMod = (
	mod: Observable<Mod | undefined> | Observable<Mod>,
): mod is Observable<Mod> => {
	return mod.peek() !== undefined;
};

const mods$: ObservableObject<ModsObservable> = observable({
	persistedData: getInitialMods(),
	activeModById: () => {
		const activeAllycode = profilesManagement$.activeAllycode.get();
		return (
			mods$.persistedData[activeAllycode]?.modById ??
			observable(new Map<string, Mod>() as ModById)
		);
	},
	modByIdByAllycode: () => {
		return mods$.persistedData;
	},
	addProfile: (allycode: string) => {
		if (Object.hasOwn(mods$.modByIdByAllycode.peek(), allycode)) return;
		mods$.persistedData[allycode].set({
			id: allycode,
			modById: new Map<string, Mod>(),
		});
	},
	deleteProfile: (allycode: string) => {
		delete mods$.persistedData[allycode];
	},
	reset: () => {
		beginBatch();
		mods$.persistedData.set(getInitialMods());
		endBatch();
	},
	toPersistable: () => {
		const modsPersistedData = mods$.persistedData.get();
		const allycodes = Object.keys(modsPersistedData);
		const result: PersistedModByIdForProfileByAllycode = {};
		for (const allycode of allycodes) {
			const modById: PersistedModById = new Map<string, GIMOFlatMod>();
			for (const [modId, mod] of modsPersistedData[allycode].modById) {
				modById.set(modId, mod.serialize());
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
					const newMod = currentlyEquippedMod.clone();
					newMod.characterID = "null";
					currentlyEquippedMod$.set(newMod);
				}
			}
		}
		const newMod = modToReassign.clone();
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
		const newMod = modToUnequip.clone();
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
		mods$.modByIdByAllycode.set({});
		return;
	}
	mods$.deleteProfile(value);
});

const hasIdKey = (obj: object): obj is { id: unknown; modById: ModById } => {
	return (
		obj !== undefined &&
		Object.hasOwn(obj, "id") &&
		Object.hasOwn(obj, "modById")
	);
};

const syncStatus$ = syncObservable(
	mods$.persistedData,
	persistOptions({
		persist: {
			name: "Mods",
			transform: {
				load: (value: PersistedModByIdForProfileByAllycode & GIMOFlatMod) => {
					// console.log("Loading mods data:", value);
					if (isPersistedModByIdForProfileByAllycode(value)) {
						try {
							const newModsToPersist = getModsFromPersisted(value);
							return newModsToPersist;
						} catch (error) {
							console.error("Error loading persisted mods:", error);
							syncStatus$.error.set(error as Error);
						}
					}

					if (Object.hasOwn(value, "mod_uid")) {
						return Mod.deserialize(value);
					}
					return value;
				},
				save: (
					value: ModsDataToPersist | Record<string, { modById: ModById }>,
				) => {
					//					console.log("Saving mods data:", value);
					const allycode = Object.keys(value)[0];
					const profile = value[allycode];
					if (hasIdKey(profile)) {
						const result = {
							[allycode]: {
								id: profile.id,
								modById: new Map<string, GIMOFlatMod>(
									profile.modById.size === 0
										? Object.entries(profile.modById).map(([key, mod]) => [
												key,
												mod.serialize(),
											])
										: profile.modById
												.entries()
												.map(([key, mod]) => [key, mod.serialize()]),
								),
							},
						};
						return result;
					}
					const result = {
						[allycode]: {
							modById: new Map<string, GIMOFlatMod>(
								profile.modById.size === 0
									? Object.entries(profile.modById).map(([key, mod]) => [
											key,
											mod.serialize(),
										])
									: profile.modById
											.entries()
											.map(([key, mod]) => [key, mod.serialize()]),
							),
						},
					};
					return result;
				},
			},
		},
		initial: getInitialMods(),
	}),
);

export { mods$, syncStatus$ };

/*
 */
