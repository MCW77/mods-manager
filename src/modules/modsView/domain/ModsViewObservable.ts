import type { Observable, ObservablePrimitive } from "@legendapp/state";
import type { Categories } from "./Categories";
import type {
	Filter,
	FilterKeys,
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
	massSetFilter: (filterName: FilterKeys, value: TriState) => void;
	cycleState: (filterName: FilterKeys, valueKey: string) => void;
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
}

export type { ModsViewObservable, ModsViewPersistedData };
