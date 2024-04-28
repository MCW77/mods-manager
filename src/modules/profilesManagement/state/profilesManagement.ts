// state
import {
	type ObservableComputed,
	type ObservableObject,
	computed,
	observable,
} from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

// domain
import type { PlayerProfile } from "#/domain/PlayerProfile";

interface Profiles {
	activeAllycode: string;
	playernameByAllycode: Record<string, string>;
	profilesByAllycode: Record<string, PlayerProfile>;
}

interface ProfilesManagement {
	profiles: Profiles;
	activePlayer: ObservableComputed<string>;
	activeProfile: ObservableComputed<PlayerProfile>;
	hasProfiles: ObservableComputed<boolean>;
	addProfile: (profile: PlayerProfile) => void;
	clearProfiles: () => void;
	deleteProfile: (allyCode: string) => void;
	updateProfile: (profile: PlayerProfile) => void;
}

export const profilesManagement$: ObservableObject<ProfilesManagement> =
	observable<ProfilesManagement>({
		profiles: {
			activeAllycode: "",
			playernameByAllycode: {},
			profilesByAllycode: {},
		},
		activePlayer: computed<string>(() =>
			profilesManagement$.profiles.playernameByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			].get(),
		),
		activeProfile: computed<PlayerProfile>(() =>
			profilesManagement$.profiles.profilesByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			].get(),
		),
		hasProfiles: computed<boolean>(
			() =>
				Object.keys(profilesManagement$.profiles.profilesByAllycode.get())
					.length > 0,
		),
		addProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode.set({
				...profilesManagement$.profiles.profilesByAllycode.peek(),
				[profile.allyCode]: {} as PlayerProfile, // TODO save the profile once PlayerProfiles are serializable
			});
			profilesManagement$.profiles.playernameByAllycode.set({
				...profilesManagement$.profiles.playernameByAllycode.peek(),
				[profile.allyCode]: profile.playerName,
			});
		},
		clearProfiles: () => {
			profilesManagement$.profiles.profilesByAllycode.set({});
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
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
		},
		updateProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode[profile.allyCode].set(
				{} as PlayerProfile,
			); // TODO save the profile once PlayerProfiles are serializable
		},
	});

persistObservable(profilesManagement$.profiles, {
	local: {
		name: "Profiles",
		indexedDB: {
			itemID: "profiles",
		},
	},
});
