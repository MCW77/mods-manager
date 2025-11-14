// state
import type { Observable } from "@legendapp/state";

// domain
import type { FetchedGIMOProfile } from "./FetchedGIMOProfile.js";
import type { FetchedFullGIMOProfile } from "./FetchedFullGIMOProfile.js";
import type { ProfileCreationData } from "./ProfileCreationData.js";
import type { SessionIDsByProfile } from "./SessionIDsByProfile.js";

interface HotutilsObservable {
	persistedData: {
		id: "sessionIDsByProfile";
		sessionIDsByProfile: SessionIDsByProfile;
	};
	activeSessionId: string;
	hasActiveSession: () => boolean;
	getGIMOSessionIdOfProfile: (allycode: string) => string;
	getHUSessionIdOfProfile: (allycode: string) => string;
	isSubscribed: () => boolean;
	sessionIDsByProfile: () => Observable<SessionIDsByProfile>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	checkSubscriptionStatus: () => Promise<boolean>;
	createProfile: (profile: ProfileCreationData) => Promise<void>;
	fetchProfile: (allycode: string) => Promise<FetchedGIMOProfile>;
	fetchFullProfile: (allycode: string) => Promise<FetchedFullGIMOProfile>;
}

export type { HotutilsObservable, SessionIDsByProfile as SessionIdByProfile };
