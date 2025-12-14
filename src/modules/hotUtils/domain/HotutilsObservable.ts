// state
import type { Observable } from "@legendapp/state";

// domain
import type { FetchedGIMOProfile } from "./FetchedGIMOProfile";
import type { FetchedFullGIMOProfile } from "./FetchedFullGIMOProfile";
import type { ProfileCreationData } from "./ProfileCreationData";
import type { SessionIDsByProfile } from "./SessionIDsByProfile";

interface HotutilsObservable {
	persistedData: {
		id: "sessionIDsByProfile";
		sessionIDsByProfile: SessionIDsByProfile;
	};
	activeSessionId: string;
	hasActiveSession: () => Promise<boolean>;
	getGIMOSessionIdOfProfile: (allycode: string) => string;
	getHUSessionIdOfProfile: (allycode: string) => string;
	isSubscribed: boolean;
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
