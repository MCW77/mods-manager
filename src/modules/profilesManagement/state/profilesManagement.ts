// utils
import { formatTimespan } from "../utils/formatTimespan";

// state
import { type ObservableObject, observable, event } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

// domain
import type { PlayerProfile } from "#/domain/PlayerProfile";

interface Profiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profilesByAllycode: Record<string, PlayerProfile>;
}

interface ProfilesManagement {
	profiles: Profiles;
	now: number;
	activeLastUpdated: () => string;
	activePlayer: () => string;
	activeProfile: () => PlayerProfile;
	hasProfiles: () => boolean;
	addProfile: (profile: PlayerProfile) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
	updateProfile: (profile: PlayerProfile) => void;
}

export const profilesManagement$: ObservableObject<ProfilesManagement> =
	observable<ProfilesManagement>({
		now: Date.now(),
		profiles: {
			activeAllycode: "",
			playernameByAllycode: {},
			profilesByAllycode: {},
			lastUpdatedByAllycode: {},
		},
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
			return profilesManagement$.profiles.playernameByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			].get();
		},
		activeProfile: () => {
			if (!profilesManagement$.hasProfiles.get()) {
				return {} as PlayerProfile; // PlayerProfile.Default
			}
			return profilesManagement$.profiles.profilesByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			].get();
		},
		hasProfiles: () => {
			return (
				Object.keys(profilesManagement$.profiles.profilesByAllycode.get())
					.length > 0
			);
		},
		addProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode.set({
				...profilesManagement$.profiles.profilesByAllycode.peek(),
				[profile.allyCode]: { allyCode: profile.allyCode } as PlayerProfile, // TODO save the profile once PlayerProfiles are serializable
			});
			profilesManagement$.profiles.playernameByAllycode.set({
				...profilesManagement$.profiles.playernameByAllycode.peek(),
				[profile.allyCode]: profile.playerName,
			});
			profilesChanged$.fire();
		},
		clearProfiles: () => {
			profilesManagement$.profiles.profilesByAllycode.set({});
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
			profilesChanged$.fire();
		},
		deleteProfile: (allyCode: string) => {
			profilesManagement$.profiles.profilesByAllycode[allyCode].delete();
			profilesManagement$.profiles.playernameByAllycode[allyCode].delete();
			profilesManagement$.profiles.activeAllycode.set(
				Object.keys(profilesManagement$.profiles.profilesByAllycode.peek())
					.length > 0
					? Object.keys(
							profilesManagement$.profiles.profilesByAllycode.peek(),
						)[0]
					: "",
			);
			profilesChanged$.fire();
		},
		updateProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode[profile.allyCode].set(
				{} as PlayerProfile,
			); // TODO save the profile once PlayerProfiles are serializable
			profilesManagement$.profiles.lastUpdatedByAllycode.set({
				...profilesManagement$.profiles.lastUpdatedByAllycode.peek(),
				[profile.allyCode]: { id: profile.allyCode, lastUpdated: Date.now() },
			});
			profilesChanged$.fire();
		},
	});

export const profilesChanged$ = event();

const nowTimer = setInterval(() => {
	profilesManagement$.now.set(Date.now());
}, 500);

syncObservable(profilesManagement$.profiles, {
	persist: {
		name: "Profiles",
		indexedDB: {
			itemID: "profiles",
		},
	},
});

syncObservable(profilesManagement$.profiles.lastUpdatedByAllycode, {
	persist: {
		name: "ProfilesUpdates",
	},
});
