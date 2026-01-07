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

interface DatacronsObservable {
	persistedData: DatacronsPersistedData;
	datacronByIdByAllycode: () => Observable<
		Record<string, DatacronByIdForProfile>
	>;
	datacronByIdForActiveAllycode: () => Observable<DatacronById>;
	filteredDatacronsIdsForActiveAllycode: () => string[];
	availableDatacronSets: () => Map<number, DatacronSet>;
	availableAlignmentAbilities: () => Affix[];
	availableCharacterAbilities: () => Affix[];
	availableCharacters: () => Affix[];
	availableFactionAbilities: () => Affix[];
	availableFactions: () => Affix[];
	filter: DatacronFilter;
	showShortDescription: boolean;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	resetFilters: () => void;
	reset: () => void;
}

const getInitialDatacrons = (): DatacronsPersistedData => {
	const datacrons: DatacronsPersistedData = {};
	return datacrons;
};

export { type DatacronsObservable, getInitialDatacrons };
