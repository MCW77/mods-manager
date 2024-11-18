// utils
import { formatTimespan } from "../utils/formatTimespan";

// state
import {
	type ObservableObject,
	observable,
	event,
	type Observable,
	beginBatch,
	endBatch,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { compilations$ } from "#/modules/compilations/state/compilations";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";

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
	CharacterNames,
} from "#/constants/characterSettings";
import type * as Character from "#/domain/Character";
import { Mod } from "#/domain/Mod";
import type { GIMOFlatMod } from "#/domain/types/ModTypes";

interface Profiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profileByAllycode: Record<string, PlayerProfile>;
}

export interface PersistedProfiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profileByAllycode: Record<string, PersistedPlayerProfile>;
}

interface ProfilesManagement {
	defaultProfile: PlayerProfile;
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
	importModsFromC3PO: (modsJSON: string) => number;
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

const isMod = (mod: Mod | undefined): mod is Mod => {
	return mod !== undefined;
};

const isObservableMod = (mod: Observable<Mod | undefined> | Observable<Mod>): mod is Observable<Mod> => {
	return mod.peek() !== undefined;
};

const getInitialProfiles = () => {
	const initialProfiles: Profiles = {
		activeAllycode: "",
		playernameByAllycode: {},
		profileByAllycode: {},
		lastUpdatedByAllycode: {},
	};
	return structuredClone(initialProfiles);
};

const profilesManagement$: ObservableObject<ProfilesManagement> =
	observable<ProfilesManagement>({
		defaultProfile: {
			allycode: "",
			characterById: {} as Character.CharacterById,
			modById: new Map<string, Mod>(),
			playerName: "",
		},
		now: Date.now(),
		profiles: getInitialProfiles(),
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
			const profile = profilesManagement$.profiles.profileByAllycode[allycode].peek();
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
			optimizationSettings$.addProfile(allycode);
			incrementalOptimization$.addProfile(allycode);
			compilations$.addProfile(allycode);
			endBatch();
			profilesChanged$.fire();
		},
		clearProfiles: () => {
			profilesManagement$.profiles.profileByAllycode.set({});
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
			profilesChanged$.fire();
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
			optimizationSettings$.deleteProfile(allycode);
			incrementalOptimization$.deleteProfile(allycode);
			endBatch();
			profilesChanged$.fire();
		},
		updateProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profileByAllycode[profile.allycode].set(
				profile,
			);
			profilesManagement$.profiles.lastUpdatedByAllycode.set({
				...profilesManagement$.profiles.lastUpdatedByAllycode.peek(),
				[profile.allycode]: { id: profile.allycode, lastUpdated: Date.now() },
			});
			profilesChanged$.fire();
		},
		reset: () => {
			syncStatus$.reset();
		},
		importModsFromC3PO: (modsJSON: string) => {
			try {
				const mods: C3POMods.C3POModDTO[] = JSON.parse(modsJSON);
				const unequippedMods = mods
					.filter((mod) => mod.equippedUnit === "none")
					.map((mod) => C3POMappers.ModMapper.fromC3PO(mod));
				for (const mod of unequippedMods) {
					profilesManagement$.activeProfile.modById[mod.id].set(mod);
				}
				const totalMods = unequippedMods.length;
				return totalMods;
			} catch (error) {
				dialog$.showError((error as Error).message);
				return 0;
			}
		},
		toPersistable: () => {
			const modById = 0;
			const result = {} as PersistedProfiles;
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

const profilesChanged$ = event();

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
const hasModById = (obj: any): obj is { modById: Map<string, GIMOFlatMod> } => {
	return Object.hasOwn(obj, "modById");
};

const hasProfileByAllycode = (obj: object): obj is { profileByAllycode: Record<string, Partial<PlayerProfile>> } => {
	return Object.hasOwn(obj, "profileByAllycode");
}

const hasPersistedProfileByAllycode = (obj: object): obj is { profileByAllycode: Record<string, PersistedPlayerProfile> } => {
	return Object.hasOwn(obj, "profileByAllycode");
}

const isFullPlayerProfile = (obj: object): obj is PlayerProfile => {
	return Object.hasOwn(obj, "allycode") && Object.hasOwn(obj, "modById") && Object.hasOwn(obj, "characterById");
};

const isFullPersistedPlayerProfile = (obj: object): obj is PersistedPlayerProfile => {
	return Object.hasOwn(obj, "allycode") && Object.hasOwn(obj, "modById") && Object.hasOwn(obj, "characterById");
};

const syncStatus$ = syncObservable(
	profilesManagement$.profiles,
	persistOptions({
		persist: {
			name: "Profiles",
			indexedDB: {
				itemID: "profiles",
			},

			transform: {
				load: (value) => {
					if (hasPersistedProfileByAllycode(value)) {
						const profiles = Object.values(value.profileByAllycode);
						const allycodes = Object.keys(value.profileByAllycode);
						if (profiles.length > 0) {
							if (isFullPersistedPlayerProfile(profiles[0])) {
								const newProfileByAllycode: Record<string, PlayerProfile> = {};
								for (const profile of profiles) {
									if (hasModById(profile)) {
										newProfileByAllycode[profile.allycode] = getProfileFromPersisted(profile);
									}
								}
								const result = {
									...value,
									profileByAllycode: newProfileByAllycode,
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
				save: (value: Partial<Profiles>) => {
					if (hasProfileByAllycode(value)) {
						const profiles = Object.values(value.profileByAllycode);
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
									...value,
									profileByAllycode: newProfileByAllycode,
								};
								return result;
							}
							if (hasModById(profiles[0])) {
								const allycode = Object.keys(value.profileByAllycode)[0];
								const modId = Object.keys(value.profileByAllycode[allycode].modById)[0];
								const modById = value.profileByAllycode[allycode].modById as Map<string, Mod> & Record<string, Mod>;
								return {
									profileByAllycode: {
										[allycode]: {
											modById: {
												[modId]: modById[modId]?.serialize(),
											}
										}
									}
								};
							}
						}
					}
					return value;
				},
			},
		},
		initial: getInitialProfiles(),
	}),
);
console.log("Waiting for Profiles to load");
await when(syncStatus$.isPersistLoaded);
console.log("Profiles loaded");

profilesManagement$.activeProfile.modById.onChange(({value, getPrevious}) => {
	console.log("modById changed from");
	console.dir(getPrevious());
	console.log("to");
	console.dir(value);
});

export { profilesManagement$, profilesChanged$ };
