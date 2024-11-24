// state
import type { Observable } from "@legendapp/state";

// domain
import type {
	LockedStatusByCharacterId,
	LockedStatusByCharacterIdByAllycode,
} from "./LockedStatusByCharacterId";

interface LockedStatusObservable {
	lockedStatusByCharacterIdByAllycode: LockedStatusByCharacterIdByAllycode;
	ofActivePlayerByCharacterId: () => Observable<LockedStatusByCharacterId>;
	lockAll: () => void;
	unlockAll: () => void;
	reset: () => void;
}

export type { LockedStatusObservable };
