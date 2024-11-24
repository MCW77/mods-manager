import type { Observable, ObservablePrimitive } from "@legendapp/state";
import type { Categories } from "./Categories";
import {
	Filter,
	FilterKeys,
	TriState,
	ViewSetup,
	ViewSetupById,
} from "./ModsViewOptions";

interface ModsViewObservable {
	activeCategory: Categories;
	idOfActiveViewSetupByCategory: Record<Categories, string>;
	idOfSelectedFilterByCategory: Record<Categories, string>;
	viewSetupByIdByCategory: Record<Categories, ViewSetupById>;
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
	addViewSetup: () => void;
	removeViewSetup: (id: string) => void;
	renameViewSetup: (id: string, newName: string) => void;
	addSortConfig: () => void;
	addFilter: () => void;
	removeFilter: (id: string) => void;
	renameFilter: (id: string, newName: string) => void;
}

export type { ModsViewObservable };
