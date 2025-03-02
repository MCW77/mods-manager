// state
import type { Observable } from "@legendapp/state";

// domain
import type {
	LockedStatusByCharacterId,
	LockedStatusByCharacterIdByAllycode,
	LockedStatusPersistedData,
} from "./LockedStatusByCharacterId";

interface LockedStatusObservable {
	persistedData: LockedStatusPersistedData;
	byCharacterIdByAllycode: () => Observable<LockedStatusByCharacterIdByAllycode>;
	ofActivePlayerByCharacterId: () => Observable<LockedStatusByCharacterId>;
	lockAll: () => void;
	unlockAll: () => void;
	reset: () => void;
}

const getInitialLockedStatus = (): LockedStatusPersistedData => {
	const lockedStatus: LockedStatusPersistedData = {
		lockedStatus: {
			id: "lockedStatus",
			lockedStatusByCharacterIdByAllycode: {},
		},
	};
	return lockedStatus;
};

export { type LockedStatusObservable, getInitialLockedStatus };
