// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// domain
import type { Categories } from "../domain/Categories";
import {
	defaultViewSetupByCategory,
	quickFilter,
	type ViewSetupById,
	type Filter,
	type FilterKeys,
	type TriState,
} from "../domain/ModsViewOptions";
import type { ModsViewObservable } from "../domain/ModsViewObservable";

const cloneQuickFilter = () => structuredClone(quickFilter);
const clonedQuickFilter = cloneQuickFilter();
const defaultRevealViewSetup = structuredClone(
	defaultViewSetupByCategory.Reveal,
);
const defaultLevelViewSetup = structuredClone(defaultViewSetupByCategory.Level);
const defaultSlice5DotViewSetup = structuredClone(
	defaultViewSetupByCategory.Slice5Dot,
);
const defaultSlice6EViewSetup = structuredClone(
	defaultViewSetupByCategory.Slice6E,
);
const defaultSlice6DotViewSetup = structuredClone(
	defaultViewSetupByCategory.Slice6Dot,
);
const defaultCalibrateViewSetup = structuredClone(
	defaultViewSetupByCategory.Calibrate,
);
const defaultAllModsViewSetup = structuredClone(
	defaultViewSetupByCategory.AllMods,
);
const defaultViewSetup = {
	Reveal: {
		[defaultRevealViewSetup.id]: defaultRevealViewSetup,
	} as ViewSetupById,
	Level: { [defaultLevelViewSetup.id]: defaultLevelViewSetup } as ViewSetupById,
	Slice5Dot: {
		[defaultSlice5DotViewSetup.id]: defaultSlice5DotViewSetup,
	} as ViewSetupById,
	Slice6E: {
		[defaultSlice6EViewSetup.id]: defaultSlice6EViewSetup,
	} as ViewSetupById,
	Slice6Dot: {
		[defaultSlice6DotViewSetup.id]: defaultSlice6DotViewSetup,
	} as ViewSetupById,
	Calibrate: {
		[defaultCalibrateViewSetup.id]: defaultCalibrateViewSetup,
	} as ViewSetupById,
	AllMods: {
		[defaultAllModsViewSetup.id]: defaultAllModsViewSetup,
	} as ViewSetupById,
};

const modsView$: ObservableObject<ModsViewObservable> =
	observable<ModsViewObservable>({
		activeCategory: "Reveal" as Categories,
		idOfActiveViewSetupByCategory: {
			Reveal: "DefaultReveal",
			Level: "DefaultLevel",
			Slice5Dot: "DefaultSlice5Dot",
			Slice6E: "DefaultSlice6E",
			Slice6Dot: "DefaultSlice6Dot",
			Calibrate: "DefaultCalibrate",
			AllMods: "DefaultAllMods",
		},
		idOfSelectedFilterByCategory: {
			Reveal: "QuickFilter",
			Level: "QuickFilter",
			Slice5Dot: "QuickFilter",
			Slice6E: "QuickFilter",
			Slice6Dot: "QuickFilter",
			Calibrate: "QuickFilter",
			AllMods: "QuickFilter",
		},
		viewSetupByIdByCategory: structuredClone(defaultViewSetup),
		quickFilter: clonedQuickFilter,
		viewSetupByIdInActiveCategory: () =>
			modsView$.viewSetupByIdByCategory[modsView$.activeCategory.get()],
		idOfActiveViewSetupInActiveCategory: () => {
			const category = modsView$.activeCategory.get();
			const reactivity =
				modsView$.idOfActiveViewSetupByCategory[category].get();
			const result = modsView$.idOfActiveViewSetupByCategory[category];
			return result;
		},
		idOfSelectedFilterInActiveCategory: () =>
			modsView$.idOfSelectedFilterByCategory[modsView$.activeCategory.get()],
		activeViewSetupInActiveCategory: () => {
			console.log(
				"compute activeViewSetupInActiveCategory: ",
				modsView$.activeViewSetupInActiveCategory.peek(),
			);
			const viewSetup =
				modsView$.viewSetupByIdInActiveCategory[
					modsView$.idOfActiveViewSetupInActiveCategory.get()
				];
			if (viewSetup !== undefined) {
				return viewSetup;
			}
			throw new Error("Active view setup not found");
		},
		activeFilter: () => {
			console.log("compute activeFilter");
			const idOfSelectedFilterInActiveCategory =
				modsView$.idOfSelectedFilterInActiveCategory.get();

			if (idOfSelectedFilterInActiveCategory === "QuickFilter") {
				return modsView$.quickFilter;
			}
			return modsView$.activeViewSetupInActiveCategory.filterById[
				idOfSelectedFilterInActiveCategory
			];
		},
		resetActiveViewSetup: () => {
			modsView$.activeViewSetupInActiveCategory.set(
				structuredClone(
					defaultViewSetupByCategory[modsView$.activeCategory.peek()],
				),
			);
		},
		resetActiveFilter: () => {
			const id = modsView$.idOfSelectedFilterInActiveCategory.peek();
			beginBatch();
			modsView$.activeFilter.set(cloneQuickFilter());
			modsView$.activeFilter.id.set(id);
			endBatch();
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
		reset: () => {
			beginBatch();
			syncStatus$.reset();
			modsView$.quickFilter.assign(cloneQuickFilter());
			endBatch();
		},
		addViewSetup: () => {
			const oldId = modsView$.idOfActiveViewSetupInActiveCategory.peek();
			let id = oldId;
			while (
				id in
				modsView$.viewSetupByIdByCategory[
					modsView$.activeCategory.peek()
				].peek()
			) {
				id += "*";
			}
			beginBatch();
			modsView$.viewSetupByIdByCategory[modsView$.activeCategory.peek()][
				id
			].set(structuredClone(modsView$.activeViewSetupInActiveCategory.peek()));
			modsView$.viewSetupByIdByCategory[modsView$.activeCategory.peek()][
				id
			].id.set(id);
			modsView$.idOfActiveViewSetupByCategory[
				modsView$.activeCategory.peek()
			].set(id);
			endBatch();
		},
		removeViewSetup: (id: string) => {
			const category = modsView$.activeCategory.peek();
			const isIdActive =
				modsView$.idOfActiveViewSetupByCategory[category].peek() === id;
			beginBatch();
			modsView$.viewSetupByIdByCategory[category][id].delete();
			if (isIdActive)
				modsView$.idOfActiveViewSetupByCategory[category].set(
					`Default${category}`,
				);
			endBatch();
		},
		renameViewSetup: (id: string, newName: string) => {
			const category = modsView$.activeCategory.peek();
			const isIdActive =
				modsView$.idOfActiveViewSetupByCategory[category].peek() === id;
			const viewSetup = modsView$.viewSetupByIdByCategory[category][id];

			beginBatch();
			viewSetup.id.set(newName);
			modsView$.viewSetupByIdByCategory[category][newName].set(
				structuredClone(viewSetup.peek()),
			);
			modsView$.viewSetupByIdByCategory[category][id].delete();
			if (isIdActive) {
				modsView$.idOfActiveViewSetupByCategory[category].set(newName);
			}
			endBatch();
		},
		addSortConfig: () => {
			const id = crypto.randomUUID();
			modsView$.activeViewSetupInActiveCategory.sort.set(id, {
				id,
				sortBy: "characterID",
				sortOrder: "asc",
			});
		},
		addFilter: () => {
			beginBatch();
			modsView$.activeViewSetupInActiveCategory.filterById[
				`${modsView$.activeFilter.id.peek()}*`
			].set(structuredClone(modsView$.activeFilter.peek()));
			modsView$.activeViewSetupInActiveCategory.filterById[
				`${modsView$.activeFilter.id.peek()}*`
			].id.set(`${modsView$.activeFilter.id.peek()}*`);
			modsView$.idOfSelectedFilterInActiveCategory.set(
				`${modsView$.activeFilter.id.peek()}*`,
			);
			endBatch();
		},
		removeFilter: (id: string) => {
			const isIdActive =
				modsView$.idOfSelectedFilterInActiveCategory.peek() === id;
			beginBatch();
			modsView$.activeViewSetupInActiveCategory.filterById[id].delete();
			if (isIdActive)
				modsView$.idOfSelectedFilterInActiveCategory.set("QuickFilter");
			endBatch();
		},
		renameFilter: (id: string, newName: string) => {
			const isIdActive =
				modsView$.idOfSelectedFilterInActiveCategory.peek() === id;
			const filter = modsView$.activeViewSetupInActiveCategory.filterById[id];

			beginBatch();
			filter.id.set(newName);
			modsView$.activeViewSetupInActiveCategory.filterById[newName].set(
				structuredClone(filter.peek()),
			);
			modsView$.activeViewSetupInActiveCategory.filterById[id].delete();
			if (isIdActive) {
				modsView$.idOfSelectedFilterInActiveCategory.set(newName);
			}
			endBatch();
		},
	});

const filters$ = observable({
	allFilters: [] as Filter[],
	filtersByCategory: {} as Record<Categories, Filter>,
});

const syncStatus$ = syncObservable(
	modsView$.viewSetupByIdByCategory,
	persistOptions({
		persist: {
			name: "ViewSetup",
		},
		initial: structuredClone(defaultViewSetup),
	}),
);
await when(syncStatus$.isPersistLoaded);

export { modsView$ };
