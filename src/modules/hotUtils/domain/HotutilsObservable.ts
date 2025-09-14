// state
import type { Observable } from "@legendapp/state";

// domain
import type { FetchedGIMOProfile } from "./FetchedGIMOProfile";
import type { FetchedFullGIMOProfile } from "./FetchedFullGIMOProfile";
import type { ProfileCreationData } from "./ProfileCreationData";

type SessionIdByProfile = Record<string, string>;

interface HotutilsObservable {
	persistedData: {
		id: "sessionIdByProfile";
		sessionIdByProfile: SessionIdByProfile;
	};
	activeSessionId: string;
	hasActiveSession: () => boolean;
	getSessionIdOfProfile: (allycode: string) => string;
	isSubscribed: () => any;
	sessionIdByProfile: () => Observable<SessionIdByProfile>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	checkSubscriptionStatus: () => Promise<boolean>;
	createProfile: (profile: ProfileCreationData) => Promise<void>;
	fetchProfile: (allycode: string) => Promise<FetchedGIMOProfile>;
	fetchFullProfile: (allycode: string) => Promise<FetchedFullGIMOProfile>;
}

export type { HotutilsObservable, SessionIdByProfile };
