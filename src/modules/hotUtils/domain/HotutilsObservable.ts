import type { FetchedGIMOProfile } from "./FetchedGIMOProfile";
import type { ProfileCreationData } from "./ProfileCreationData";

type SessionIdByProfile = Record<string, string>;

interface HotutilsObservable {
	activeSessionId: string;
	hasActiveSession: () => boolean;
	getSessionIdOfProfile: (allycode: string) => string;
	isSubscribed: () => any;
	sessionIdByProfile: SessionIdByProfile;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	checkSubscriptionStatus: () => Promise<boolean>;
	createProfile: (profile: ProfileCreationData) => Promise<void>;
	fetchProfile: (allycode: string) => Promise<FetchedGIMOProfile>;
}

export type { HotutilsObservable, SessionIdByProfile };
