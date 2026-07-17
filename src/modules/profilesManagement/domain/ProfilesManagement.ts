// state
import type { Observable } from "@legendapp/state";

// domain
import type { Profiles, ProfilesManagementPersistedData } from "./Profiles";

interface ProfilesManagementObservable {
	persistedData: ProfilesManagementPersistedData;
	lastProfileAdded: string;
	lastProfileDeleted: string;
	profiles: () => Observable<Profiles>;
	now: number;
	activeAllycode: () => string;
	activeLastUpdated: () => string;
	activePlayer: () => string;
	hasProfileWithAllycode: (allycode: string) => boolean;
	hasProfiles: () => boolean;
	addProfile: (allycode: string, name: string) => void;
	clearProfiles: () => void;
	deleteProfile: (allycode: string) => void;
	updateProfile: (allycode: string) => void;
	reset: () => void;
}

export type { ProfilesManagementObservable };
