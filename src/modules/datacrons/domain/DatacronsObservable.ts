// state
import type { Observable } from "@legendapp/state";

// domain
import type { DatacronFilter, DatacronSet } from "./DatacronFilter";
import type {
	DatacronById,
	DatacronsPersistedData,
	DatacronByIdForProfile,
	Affix,
} from "./Datacrons";

type AbilitiesDisplayMode =
	| "Show Full Abilities"
	| "Show Short Abilities"
	| "Hide Abilities";

interface DatacronsObservable {
	persistedData: DatacronsPersistedData;
	datacronByIdByAllycode: () => Observable<
		Record<string, DatacronByIdForProfile>
	>;
	datacronByIdForActiveAllycode: () => Observable<DatacronById>;
	filteredDatacronsIdsForActiveAllycode: () => string[];
	availableDatacronSets: () => Map<number, DatacronSet>;
	availableFocusedStates: () => { id: string; value: boolean }[];
	availableAlignments: () => Affix[];
	availableAlignmentAbilities: () => Affix[];
	availableCharacterAbilities: () => Affix[];
	availableCharacters: () => Affix[];
	availableFactionAbilities: () => Affix[];
	availableFactions: () => Affix[];
	availableNames: () => { id: string; name: string }[];
	availableNameModes: () => { id: string; value: boolean }[];
	filter: DatacronFilter;
	abilitiesDisplayMode: AbilitiesDisplayMode;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	resetFilters: () => void;
	reset: () => void;
}

const getInitialDatacrons = (): DatacronsPersistedData => {
	const datacrons: DatacronsPersistedData = {};
	return datacrons;
};

export {
	type AbilitiesDisplayMode,
	type DatacronsObservable,
	getInitialDatacrons,
};
