// state
import type { Observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { CharacterById } from "#/domain/Character";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { RosterPersistedData } from "./Roster";

interface RosterObservable {
	persistedData: RosterPersistedData;
	characterByIdByAllycode: () => Observable<RosterPersistedData>;
	activeCharacterById: () => Observable<CharacterById>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	saveTarget: (
		characterId: CharacterNames,
		newTarget: OptimizationPlan,
	) => void;
	indexOfTarget: (characterId: CharacterNames, targetId: string) => number;
	deleteTarget: (characterId: CharacterNames, targetIndex: number) => void;
}

const getInitialRoster = (): RosterPersistedData => {
	const roster: RosterPersistedData = {};
	return roster;
};

export { getInitialRoster, type RosterObservable };
