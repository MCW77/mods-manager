// state
import type { Observable, ObservablePrimitive } from "@legendapp/state";

//domain
import type { Mod } from "#/domain/Mod";
import type { Categories } from "./Categories";
import type { ModFilterPredicate } from "./ModFilterPredicate";
import type {
	Filter,
	TriStateFilterKeys,
	ModsViewSetupByIdByCategory,
	PersistableModsViewSetupByIdByCategory,
	TriState,
	ViewSetup,
	ViewSetupById,
} from "./ModsViewOptions";

interface ModsViewPersistedData {
	viewSetup: {
		id: "viewSetup";
		byIdByCategory: ModsViewSetupByIdByCategory;
	};
}

interface ModsViewObservable {
	persistedData: {
		viewSetup: {
			id: "viewSetup";
			byIdByCategory: ModsViewSetupByIdByCategory;
		};
	};
	activeCategory: Categories;
	idOfActiveViewSetupByCategory: Record<Categories, string>;
	idOfSelectedFilterByCategory: Record<Categories, string>;
	viewSetupByIdByCategory: () => Observable<ModsViewSetupByIdByCategory>;
	quickFilter: Filter;
	viewSetupByIdInActiveCategory: () => Observable<ViewSetupById>;
	idOfActiveViewSetupInActiveCategory: () => ObservablePrimitive<string>;
	idOfSelectedFilterInActiveCategory: () => ObservablePrimitive<string>;
	activeViewSetupInActiveCategory: () => Observable<ViewSetup>;
	activeFilter: () => Observable<Filter>;
	resetActiveViewSetup: () => void;
	resetActiveFilter: () => void;
	setFilterId: (filterId: string) => void;
	massSetFilter: (filterName: TriStateFilterKeys, value: TriState) => void;
	cycleState: (filterName: TriStateFilterKeys, valueKey: string) => void;
	reset: () => void;
	restoreFromPersistable: (
		persistable: PersistableModsViewSetupByIdByCategory,
	) => void;
	toPersistable: () => PersistableModsViewSetupByIdByCategory;
	addViewSetup: () => void;
	removeViewSetup: (id: string) => void;
	renameViewSetup: (id: string, newName: string) => void;
	addSortConfig: () => void;
	addFilter: () => void;
	removeFilter: (id: string) => void;
	renameFilter: (id: string, newName: string) => void;
	// Computed observables for filtering, grouping, and sorting

	// Computed: Filter mods based on named filters and quick filter
	filteredMods: () => Mod[];
	// Computed: Group filtered mods by slot, modset and primary stat
	groupedMods: () => Record<string, Mod[]>;
	// Computed: Finish mods transform by sorting each group and return as array of Mod[]
	transformedMods: () => Mod[][];
	transformedModsCount: () => number;
	quickFilterPredicate: () => { predicates: ModFilterPredicate[]; id: number };
	namedFiltersPredicates: () => ModFilterPredicate[];
}

export type { ModsViewObservable, ModsViewPersistedData };
