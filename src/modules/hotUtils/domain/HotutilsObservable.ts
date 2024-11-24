import { FetchedGIMOProfile } from "./FetchedGIMOProfile";
import { Loadout } from "./Loudout";
import { ProfileCreationData } from "./ProfileCreationData";

type SessionIdByProfile = Record<string, string>;

interface HotutilsObservable {
	activeSessionId: string;
	hasActiveSession: () => boolean;
	getSessionIdOfProfile: (allycode: string) => string;
	isMoving: boolean;
	isSubscribed: () => any;
	moveStatus: {
		taskId: number;
		progress: {
			count: number;
			elapsedMs: number;
			index: number;
			result: string;
		};
		message: string;
	};
	sessionIdByProfile: SessionIdByProfile;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	cancelModMove: () => Promise<void>;
	checkSubscriptionStatus: () => Promise<boolean>;
	createProfile: (profile: ProfileCreationData) => Promise<void>;
	fetchProfile: (allycode: string) => Promise<FetchedGIMOProfile>;
	moveMods: (loadout: Loadout) => Promise<boolean>;
	pollForModMoveStatus: () => Promise<void>;
}

export type { HotutilsObservable, SessionIdByProfile };
