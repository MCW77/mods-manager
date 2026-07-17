// utils
import { formatTimespan } from "../utils/formatTimespan";

// state
import {
	type ObservableObject,
	observable,
	beginBatch,
	endBatch,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// domain
import type { ProfilesManagementPersistedData } from "../domain/Profiles";
import type { ProfilesManagementObservable } from "../domain/ProfilesManagement";

const getInitialProfiles = () => {
	const initialProfiles: ProfilesManagementPersistedData = {
		id: "profiles",
		profiles: {
			activeAllycode: "",
			playernameByAllycode: {},
			lastUpdatedByAllycode: {},
		},
	};
	return structuredClone(initialProfiles);
};

const profilesManagement$: ObservableObject<ProfilesManagementObservable> =
	observable<ProfilesManagementObservable>({
		persistedData: getInitialProfiles(),
		now: Date.now(),
		profiles: () => profilesManagement$.persistedData.profiles,
		lastProfileAdded: "",
		lastProfileDeleted: "",
		activeAllycode: () => profilesManagement$.profiles.activeAllycode.get(),
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
			const activeAllycode = profilesManagement$.activeAllycode.get();
			if (activeAllycode in profilesManagement$.profiles.playernameByAllycode) {
				return profilesManagement$.profiles.playernameByAllycode[
					activeAllycode
				].get();
			}
			return "";
		},
		hasProfileWithAllycode: (allycode: string) => {
			const profile =
				profilesManagement$.profiles.playernameByAllycode[allycode].peek();
			return profile !== undefined;
		},
		hasProfiles: () => {
			return (
				Object.keys(profilesManagement$.profiles.playernameByAllycode.get())
					.length > 0
			);
		},
		addProfile: (allycode: string, name: string) => {
			if (profilesManagement$.hasProfileWithAllycode(allycode)) {
				profilesManagement$.lastProfileAdded.set(allycode);
				return;
			}
			beginBatch();
			profilesManagement$.profiles.playernameByAllycode.set({
				...profilesManagement$.profiles.playernameByAllycode.peek(),
				[allycode]: name,
			});
			profilesManagement$.lastProfileAdded.set(allycode);
			endBatch();
		},
		clearProfiles: () => {
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
			profilesManagement$.lastProfileDeleted.set("all");
		},
		deleteProfile: (allycode: string) => {
			beginBatch();
			profilesManagement$.profiles.playernameByAllycode[allycode].delete();
			profilesManagement$.profiles.lastUpdatedByAllycode[allycode].delete();
			const activeAllycode = profilesManagement$.profiles.activeAllycode.peek();
			if (activeAllycode === allycode) {
				const profilesByAllycode =
					profilesManagement$.profiles.playernameByAllycode.peek();
				profilesManagement$.profiles.activeAllycode.set(
					Object.keys(profilesByAllycode).length > 0
						? Object.keys(profilesByAllycode)[0]
						: "",
				);
			}
			profilesManagement$.lastProfileDeleted.set(allycode);
			endBatch();
		},
		updateProfile: (allycode: string) => {
			profilesManagement$.profiles.lastUpdatedByAllycode.set({
				...profilesManagement$.profiles.lastUpdatedByAllycode.peek(),
				[allycode]: { id: allycode, lastUpdated: Date.now() },
			});
		},
		reset: () => {
			syncStatus$.reset();
			profilesManagement$.lastProfileDeleted.set("all");
		},
	});

let nowTimer: ReturnType<typeof setInterval> | null = null;

const startNowTimer = () => {
	if (nowTimer !== null) return;
	nowTimer = setInterval(() => {
		profilesManagement$.now.set(Date.now());
	}, 5000);
};

const stopNowTimer = () => {
	if (nowTimer === null) return;
	clearInterval(nowTimer);
	nowTimer = null;
};

when(
	() => !profilesManagement$.hasProfiles.get(),
	() => {
		stopNowTimer();
	},
);

when(
	() => profilesManagement$.hasProfiles.get(),
	() => {
		startNowTimer();
	},
);

const syncStatus$ = syncObservable(
	profilesManagement$.persistedData,
	persistOptions({
		persist: {
			name: "Profiles",
			indexedDB: {
				itemID: "profiles",
			},
		},
		initial: getInitialProfiles(),
	}),
);

export { profilesManagement$, syncStatus$ };
