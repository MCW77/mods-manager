// state
import { beginBatch, endBatch, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

// domain
import type { Categories } from "../domain/Categories";
import { defaultViewSetupByCategory, quickFilter, type ViewSetupById, type Filter, type FilterKeys, type TriState } from "../domain/ModsViewOptions";

const clonedQuickFilter = structuredClone(quickFilter);
const defaultRevealViewSetup = structuredClone(defaultViewSetupByCategory.Reveal);
const defaultLevelViewSetup = structuredClone(defaultViewSetupByCategory.Level);
const defaultSlice5DotViewSetup = structuredClone(defaultViewSetupByCategory.Slice5Dot);
const defaultSlice6EViewSetup = structuredClone(defaultViewSetupByCategory.Slice6E);
const defaultSlice6DotViewSetup = structuredClone(defaultViewSetupByCategory.Slice6Dot);
const defaultCalibrateViewSetup = structuredClone(defaultViewSetupByCategory.Calibrate);

const modsView$ = observable({
  activeCategory: "Reveal" as Categories,
  idOfActiveViewSetupByCategory: {
    Reveal: "*DefaultReveal*",
    Level: "*DefaultLevel*",
    Slice5Dot: "*DefaultSlice5Dot*",
    Slice6E: "*DefaultSlice6E*",
    Slice6Dot: "*DefaultSlice6Dot*",
    Calibrate: "*DefaultCalibrate*",
  },
  idOfSelectedFilterByCategory: {
    Reveal: "*QuickFilter*",
    Level: "*QuickFilter*",
    Slice5Dot: "*QuickFilter*",
    Slice6E: "*QuickFilter*",
    Slice6Dot: "*QuickFilter*",
    Calibrate: "*QuickFilter*",
  },
  viewSetupByIdByCategory: {
    Reveal: {[defaultRevealViewSetup.id]: defaultRevealViewSetup} as ViewSetupById,
		Level: {[defaultLevelViewSetup.id]: defaultLevelViewSetup} as ViewSetupById,
		Slice5Dot: {[defaultSlice5DotViewSetup.id]: defaultSlice5DotViewSetup} as ViewSetupById,
		Slice6E: {[defaultSlice6EViewSetup.id]: defaultSlice6EViewSetup} as ViewSetupById,
		Slice6Dot: {[defaultSlice6DotViewSetup.id]: defaultSlice6DotViewSetup} as ViewSetupById,
		Calibrate: {[defaultCalibrateViewSetup.id]: defaultCalibrateViewSetup} as ViewSetupById,
  },
	quickFilter: clonedQuickFilter,
	viewSetupByIdInActiveCategory: () => modsView$.viewSetupByIdByCategory[modsView$.activeCategory.get()],
	idOfActiveViewSetupInActiveCategory: () => {
		const category = modsView$.activeCategory.get();
		const result = modsView$.idOfActiveViewSetupByCategory[category];
		return result;
	},
	idOfSelectedFilterInActiveCategory: () => modsView$.idOfSelectedFilterByCategory[modsView$.activeCategory.get()],
	activeViewSetupInActiveCategory: () => {
		console.log("compute activeViewSetupInActiveCategory: ", modsView$.activeViewSetupInActiveCategory.peek());
    const filter = modsView$.activeFilter.get();
		const viewSetup = modsView$.viewSetupByIdInActiveCategory[modsView$.idOfActiveViewSetupInActiveCategory.get()];
		if (viewSetup !== undefined) {
			return viewSetup;
		}
		throw new Error("Active view setup not found");
	},
	activeFilter: () => {
		console.log("compute activeFilter");
		const idOfSelectedFilterInActiveCategory = modsView$.idOfSelectedFilterInActiveCategory.get();
		const filter = modsView$.activeViewSetupInActiveCategory.filterById[idOfSelectedFilterInActiveCategory].primary.get();
		const quick = modsView$.quickFilter.primary.get();

		if (idOfSelectedFilterInActiveCategory === "*QuickFilter*") {
			return modsView$.quickFilter;
		}
		return modsView$.activeViewSetupInActiveCategory.filterById[idOfSelectedFilterInActiveCategory] ?? modsView$.quickFilter;
	},
	resetActiveViewSetup: () => {
		modsView$.activeViewSetupInActiveCategory.set(structuredClone(defaultViewSetupByCategory[modsView$.activeCategory.peek()]));
	},
	setFilterId: (filterId: string) => {
		modsView$.idOfSelectedFilterInActiveCategory.set(filterId);
	},
	massSetFilter: (filterName: FilterKeys, value: TriState) => {
		const filter = modsView$.activeFilter[filterName];
		beginBatch();
		for (const key of Object.keys(filter)) {
			filter[key].set(value);
		}
		endBatch();
	},
	cycleState: (filterName: FilterKeys, valueKey: string) => {
		const filter = modsView$.activeFilter[filterName][valueKey];
		const value = filter.get();
		if (value === -1) filter.set(0);
		if (value === 0) filter.set(1);
		if (value === 1) filter.set(-1);
	},
});

const filters$ = observable({
	allFilters: [] as Filter[],
	filtersByCategory: {} as Record<Categories, Filter>,
});

const status$ = syncObservable(modsView$.viewSetupByIdByCategory, {
	persist: {
		name: "ViewSetup",
	},
});
await when(status$.isPersistLoaded);

modsView$.activeCategory.onChange(({value, getPrevious}) => {
	console.log(`activeCategory changed from ${getPrevious()} to ${value}`);
});

modsView$.idOfActiveViewSetupByCategory.onChange(({value, getPrevious}) => {
	console.log(`idOfActiveViewSetupByCategory changed from ${getPrevious()} to ${value}`);
});

modsView$.idOfSelectedFilterByCategory.onChange(({value, getPrevious}) => {
	console.log(`idOfSelectedFilterByCategory changed from ${getPrevious()} to ${value}`);
});

modsView$.idOfActiveViewSetupInActiveCategory.onChange(({value, getPrevious}) => {
	console.log(`idOfActiveViewSetupInActiveCategory changed from ${getPrevious()} to ${value}`);
});

modsView$.idOfSelectedFilterInActiveCategory.onChange(({value, getPrevious}) => {
	console.log(`idOfSelectedFilterInActiveCategory changed from ${getPrevious()} to ${value}`);
});

modsView$.activeViewSetupInActiveCategory.onChange(({value, getPrevious}) => {
	console.log("activeViewSetupInActiveCategory changed from ");
	console.dir(getPrevious());
	console.log("to ");
	console.dir(value);
});

modsView$.activeFilter.onChange(({value, getPrevious}) => {
	console.log("activeFilter changed from ");
	console.dir(getPrevious());
	console.log("to ");
	console.dir(value);
});

export { modsView$ };
