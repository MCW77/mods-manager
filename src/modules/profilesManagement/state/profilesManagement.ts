// utils
import { formatTimespan } from "../utils/formatTimespan";

// state
import {
	type ObservableObject,
	observable,
	type Observable,
	beginBatch,
	endBatch,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// domain
import type * as C3POMods from "#/modules/profilesManagement/dtos/c3po";
import * as C3POMappers from "#/modules/profilesManagement/mappers/c3po";
import {
	type PersistedPlayerProfile,
	type PlayerProfile,
	createPlayerProfile,
	getProfileFromPersisted,
	getProfileToPersist,
} from "../domain/PlayerProfile";
import type {
	Profiles,
	PersistedProfiles,
	PersistedDataWithProfiles,
} from "../domain/Profiles";
import type { ProfilesManagementObservable } from "../domain/ProfilesManagement";
import type { CharacterNames } from "#/constants/CharacterNames";
import type * as Character from "#/domain/Character";
import { Mod } from "#/domain/Mod";
import type { GIMOFlatMod } from "#/domain/types/ModTypes";

const isObservableMod = (
	mod: Observable<Mod | undefined> | Observable<Mod>,
): mod is Observable<Mod> => {
	return mod.peek() !== undefined;
};

const getInitialProfiles = () => {
	const initialProfiles: PersistedDataWithProfiles = {
		id: "profiles",
		profiles: {
			activeAllycode: "",
			playernameByAllycode: {},
			profileByAllycode: {},
			lastUpdatedByAllycode: {},
		},
	};
	return structuredClone(initialProfiles);
};

const profilesManagement$: ObservableObject<ProfilesManagementObservable> =
	observable<ProfilesManagementObservable>({
		persistedData: getInitialProfiles(),
		defaultProfile: {
			allycode: "",
			characterById: {} as Character.CharacterById,
			modById: new Map<string, Mod>(),
			playerName: "",
		},
		now: Date.now(),
		profiles: () => profilesManagement$.persistedData.profiles,
		lastProfileAdded: "",
		lastProfileDeleted: "",
		activeLastUpdated: () => {
			const allycode = profilesManagement$.profiles.activeAllycode.get();
			const elapsedTime =
				profilesManagement$.now.get() -
				profilesManagement$.profiles.lastUpdatedByAllycode[
					allycode
				].lastUpdated.get();
			return formatTimespan(elapsedTime);
		},
		activePlayer: () => {
			const activeAllycode = profilesManagement$.profiles.activeAllycode.get();
			if (activeAllycode in profilesManagement$.profiles.playernameByAllycode) {
				return profilesManagement$.profiles.playernameByAllycode[
					activeAllycode
				].get();
			}
			return "";
		},
		activeProfile: () => {
			if (!profilesManagement$.hasProfiles.get()) {
				return profilesManagement$.defaultProfile;
			}
			const activeAllycode = profilesManagement$.profiles.activeAllycode.get();
			if (activeAllycode === "") {
				return profilesManagement$.defaultProfile;
			}
			return profilesManagement$.profiles.profileByAllycode[activeAllycode];
		},
		hasProfileWithAllycode: (allycode: string) => {
			const profile =
				profilesManagement$.profiles.profileByAllycode[allycode].peek();
			return profile !== undefined;
		},
		hasProfiles: () => {
			return (
				Object.keys(profilesManagement$.profiles.profileByAllycode.get())
					.length > 0
			);
		},
		addProfile: (allycode: string, name: string) => {
			if (profilesManagement$.hasProfileWithAllycode(allycode)) return;
			const profile: PlayerProfile = createPlayerProfile(allycode, name);
			beginBatch();
			profilesManagement$.profiles.profileByAllycode.set({
				...profilesManagement$.profiles.profileByAllycode.peek(),
				[profile.allycode]: profile,
			});
			profilesManagement$.profiles.playernameByAllycode.set({
				...profilesManagement$.profiles.playernameByAllycode.peek(),
				[profile.allycode]: profile.playerName,
			});
			profilesManagement$.lastProfileAdded.set(allycode);
			endBatch();
		},
		clearProfiles: () => {
			profilesManagement$.profiles.profileByAllycode.set({});
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
			profilesManagement$.lastProfileDeleted.set("all");
		},
		deleteProfile: (allycode: string) => {
			beginBatch();
			profilesManagement$.profiles.profileByAllycode[allycode].delete();
			profilesManagement$.profiles.playernameByAllycode[allycode].delete();
			const activeAllycode = profilesManagement$.profiles.activeAllycode.peek();
			if (activeAllycode === allycode) {
				const profilesByAllycode =
					profilesManagement$.profiles.profileByAllycode.peek();
				profilesManagement$.profiles.activeAllycode.set(
					Object.keys(profilesByAllycode).length > 0
						? Object.keys(profilesByAllycode)[0]
						: "",
				);
			}
			profilesManagement$.lastProfileDeleted.set(allycode);
			endBatch();
		},
		updateProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profileByAllycode[profile.allycode].set(
				profile,
			);
			profilesManagement$.profiles.lastUpdatedByAllycode.set({
				...profilesManagement$.profiles.lastUpdatedByAllycode.peek(),
				[profile.allycode]: { id: profile.allycode, lastUpdated: Date.now() },
			});
		},
		reset: () => {
			syncStatus$.reset();
			profilesManagement$.lastProfileDeleted.set("all");
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
					profilesManagement$.activeProfile.modById[mod.id].set(mod);
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
		toPersistable: () => {
			let result = {} as PersistedProfiles;
			const profiles = profilesManagement$.profiles.peek();
			const allycodeProfiles = Object.values(profiles.profileByAllycode);
			const newProfileByAllycode: Record<string, PersistedPlayerProfile> = {};
			for (const profile of allycodeProfiles) {
				newProfileByAllycode[profile.allycode] = getProfileToPersist(profile);
			}
			result = {
				...profiles,
				profileByAllycode: newProfileByAllycode,
			};
			return result;
		},
		toJSON: () => {
			return "";
		},
		fromJSON: (profilesManagementJSON: string) => {
			return {} as PersistedProfiles;
		},
		reassignMod: (modId: string, newCharacterId: CharacterNames) => {
			const modToReassign = profilesManagement$.activeProfile.modById[modId];
			if (modToReassign === undefined) return;
			const currentlyEquippedModId =
				profilesManagement$.activeProfile.modById
					.values()
					.find(
						(mod) =>
							mod.slot === modToReassign.slot.peek() &&
							mod.characterID === newCharacterId,
					)?.id ?? "";
			beginBatch();
			if (currentlyEquippedModId !== "") {
				const currentlyEquippedMod$ =
					profilesManagement$.activeProfile.modById[currentlyEquippedModId];
				if (isObservableMod(currentlyEquippedMod$))
					currentlyEquippedMod$.characterID.set("null");
			}
			modToReassign.characterID.set(newCharacterId);
			endBatch();
		},
		reassignMods: (mods: Mod[], newCharacterId: CharacterNames) => {
			beginBatch();
			for (const mod of mods) {
				profilesManagement$.reassignMod(mod.id, newCharacterId);
			}
			endBatch();
		},
		unequipMod: (modId: string) => {
			const modToUnequip = profilesManagement$.activeProfile.modById[modId];
			if (!isObservableMod(modToUnequip)) return;
			modToUnequip.characterID.set("null");
		},
		unequipMods: (mods: Mod[]) => {
			beginBatch();
			for (const mod of mods) {
				profilesManagement$.unequipMod(mod.id);
			}
			endBatch();
		},
		deleteMod: (modId: string) => {
			const modToDelete = profilesManagement$.activeProfile.modById[modId];
			if (modToDelete.peek() === undefined) return;
			profilesManagement$.activeProfile.modById.delete(modId);
		},
		deleteMods: (mods: Mod[]) => {
			beginBatch();
			for (const mod of mods) {
				profilesManagement$.deleteMod(mod.id);
			}
			endBatch();
		},
	});

const nowTimer = setInterval(() => {
	profilesManagement$.now.set(Date.now());
}, 500);

when(
	() => !profilesManagement$.hasProfiles.get(),
	() => {
		clearInterval(nowTimer);
	},
);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const hasModByIdMap = (obj: any): obj is { modById: Map<string, Mod> } => {
	return Object.hasOwn(obj, "modById") && obj.modById instanceof Map;
};

const hasModByIdRecord = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	obj: any,
): obj is { modById: Record<string, GIMOFlatMod> } => {
	return Object.hasOwn(obj, "modById") && obj.modById instanceof Object;
};

const hasProfileByAllycode = (
	obj: object,
): obj is { profileByAllycode: Record<string, Partial<PlayerProfile>> } => {
	return Object.hasOwn(obj, "profileByAllycode");
};

const hasPersistedProfileByAllycode = (
	obj: object,
): obj is { profileByAllycode: Record<string, PersistedPlayerProfile> } => {
	return Object.hasOwn(obj, "profileByAllycode");
};

const isFullPlayerProfile = (obj: object): obj is PlayerProfile => {
	return (
		Object.hasOwn(obj, "allycode") &&
		Object.hasOwn(obj, "modById") &&
		Object.hasOwn(obj, "characterById")
	);
};

const isFullPersistedPlayerProfile = (
	obj: object,
): obj is PersistedPlayerProfile => {
	return (
		Object.hasOwn(obj, "allycode") &&
		Object.hasOwn(obj, "modById") &&
		Object.hasOwn(obj, "characterById")
	);
};

const syncStatus$ = syncObservable(
	profilesManagement$.persistedData,
	persistOptions({
		persist: {
			name: "Profiles",
			indexedDB: {
				itemID: "profiles",
			},

			transform: {
				load: (
					value: { id: "profiles"; profiles: PersistedProfiles } & GIMOFlatMod,
				) => {
					if (hasPersistedProfileByAllycode(value.profiles)) {
						const profiles = Object.values(value.profiles.profileByAllycode);
						const allycodes = Object.keys(value.profiles.profileByAllycode);
						if (profiles.length > 0) {
							if (isFullPersistedPlayerProfile(profiles[0])) {
								const newProfileByAllycode: Record<string, PlayerProfile> = {};
								for (const profile of profiles) {
									if (hasModByIdRecord(profile)) {
										newProfileByAllycode[profile.allycode] =
											getProfileFromPersisted(profile);
									}
								}
								const result = {
									id: "profiles",
									profiles: {
										...value.profiles,
										profileByAllycode: newProfileByAllycode,
									},
								};
								return result;
							}
						}
					}

					if (Object.hasOwn(value, "mod_uid")) {
						return Mod.deserialize(value);
					}
					return value;
				},
				save: (value: { profiles: Partial<Profiles> }) => {
					if (hasProfileByAllycode(value.profiles)) {
						const profiles = Object.values(value.profiles.profileByAllycode);
						if (profiles.length > 0) {
							if (isFullPlayerProfile(profiles[0])) {
								const newProfileByAllycode: Record<
									string,
									PersistedPlayerProfile
								> = {};
								for (const profile of profiles) {
									newProfileByAllycode[profile.allycode] =
										getProfileToPersist(profile);
								}
								const result = {
									profiles: {
										profileByAllycode: newProfileByAllycode,
									},
								};
								return result;
							}
							if (hasModByIdMap(profiles[0])) {
								const allycode = Object.keys(
									value.profiles.profileByAllycode,
								)[0];
								const modId = Object.keys(
									value.profiles.profileByAllycode[allycode].modById,
								)[0];
								const modById = value.profiles.profileByAllycode[allycode]
									.modById as Map<string, Mod> & Record<string, Mod>;
								return {
									profiles: {
										profileByAllycode: {
											[allycode]: {
												modById: {
													[modId]: modById[modId]?.serialize(),
												},
											},
										},
									},
								};
							}
						}
					}
					return structuredClone(value);
				},
			},
		},
		initial: getInitialProfiles(),
	}),
);
await when(syncStatus$.isPersistLoaded);

export { profilesManagement$ };
