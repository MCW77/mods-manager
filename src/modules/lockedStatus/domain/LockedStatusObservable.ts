// state
import type { Observable } from "@legendapp/state";

// domain
import type {
	LockedCharacters,
	LockedCharactersByAllycode,
	LockedStatusPersistedData,
} from "./LockedStatusByCharacterId";
import type { CharacterNames } from "#/constants/CharacterNames";

interface LockedStatusObservable {
	persistedData: LockedStatusPersistedData;
	lockedCharactersByAllycode: () => Observable<LockedCharactersByAllycode>;
	lockedCharactersForActivePlayer: () => Observable<LockedCharacters>;
	isCharacterLockedForActivePlayer: (characterId: CharacterNames) => boolean;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	lockAll: () => void;
	unlockAll: () => void;
	toggleCharacterForActivePlayer: (characterId: CharacterNames) => void;
	reset: () => void;
}

const getInitialLockedStatus = (): LockedStatusPersistedData => {
	const lockedStatus: LockedStatusPersistedData = {
		lockedStatus: {
			id: "lockedStatus",
			lockedCharactersByAllycode: {},
		},
	};
	return lockedStatus;
};

export { type LockedStatusObservable, getInitialLockedStatus };
