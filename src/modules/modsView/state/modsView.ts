// utils
import { groupBy } from "#/utils/groupBy";
import { objectKeys } from "#/utils/objectKeys";
import mapValues from "lodash-es/mapValues";
import orderBy from "lodash-es/orderBy";

// state
import {
	ObservableHint,
	type ObservableObject,
	beginBatch,
	endBatch,
	observable,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const profilesManagement$ = stateLoader$.profilesManagement$;

// domain
import type { Mod } from "#/domain/Mod";
import type { Categories } from "../domain/Categories";
import {
	createCombinedPredicate,
	type ModFilterPredicate,
} from "../domain/ModFilterPredicate";
import type {
	ModsViewObservable,
	ModsViewPersistedData,
} from "../domain/ModsViewObservable";
import {
	defaultViewSetupByCategory,
	quickFilter,
	type ViewSetupById,
	type TriStateFilterKeys,
	type TriState,
	type ModsViewSetupByIdByCategory,
	type PersistableModsViewSetupByIdByCategory,
	type PersistableViewSetup,
} from "../domain/ModsViewOptions";
import { createSortConfig } from "../domain/SortConfig";
import { getSortValue } from "../domain/sortValue";

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
const defaultViewSetup: ModsViewPersistedData = {
	viewSetup: {
		id: "viewSetup",
		byIdByCategory: {
			Reveal: {
				[defaultRevealViewSetup.id]: defaultRevealViewSetup,
			} as ViewSetupById,
			Level: {
				[defaultLevelViewSetup.id]: defaultLevelViewSetup,
			} as ViewSetupById,
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
		},
	},
};

let quickFilterPredicateCallCount = 0;

const modsView$: ObservableObject<ModsViewObservable> =
	observable<ModsViewObservable>({
		persistedData: structuredClone(defaultViewSetup),
		activeCategory: "AllMods" as Categories,
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
		viewSetupByIdByCategory: () =>
			modsView$.persistedData.viewSetup.byIdByCategory,
		quickFilter: clonedQuickFilter,
		viewSetupByIdInActiveCategory: () =>
			modsView$.viewSetupByIdByCategory[modsView$.activeCategory.get()],
		idOfActiveViewSetupInActiveCategory: () => {
			const category = modsView$.activeCategory.get();
			const _reactivity =
				modsView$.idOfActiveViewSetupByCategory[category].get();
			const result = modsView$.idOfActiveViewSetupByCategory[category];
			return result;
		},
		idOfSelectedFilterInActiveCategory: () =>
			modsView$.idOfSelectedFilterByCategory[modsView$.activeCategory.get()],
		activeViewSetupInActiveCategory: () => {
			const viewSetupById = modsView$.viewSetupByIdInActiveCategory;
			const id = modsView$.idOfActiveViewSetupInActiveCategory.get();

			const viewSetup = viewSetupById[id];
			if (viewSetup !== undefined) {
				return ObservableHint.plain(viewSetup);
			}
			throw new Error("Active view setup not found");
		},
		activeFilter: () => {
			const idOfSelectedFilterInActiveCategory =
				modsView$.idOfSelectedFilterInActiveCategory.get();

			if (idOfSelectedFilterInActiveCategory === "QuickFilter") {
				return modsView$.quickFilter;
			}
			return modsView$.activeViewSetupInActiveCategory.filterById[
				idOfSelectedFilterInActiveCategory
			];
		},
		filteredMods: () => {
			const modById = profilesManagement$.activeProfile.modById.get();
			const mods = Array.from(modById.values());
			const namedFiltersPredicates = modsView$.namedFiltersPredicates.get();
			const quickFilterPredicateResult = modsView$.quickFilterPredicate.get();

			let result: Mod[] = namedFiltersPredicates.length === 0 ? mods : [];
			let filteredMods: Mod[] = [];
			for (const filter of namedFiltersPredicates) {
				filteredMods = mods.filter(filter);
				for (const mod of filteredMods) {
					if (!result.includes(mod)) result.push(mod);
				}
			}
			result = result.filter(quickFilterPredicateResult.predicates[0]);

			// Mark the array as opaque to prevent Legend State from recursively traversing it
			// Note: We cannot mark individual Mod objects as opaque because components need to observe them
			return ObservableHint.plain(result);
		},
		groupedMods: () => {
			const mods = modsView$.filteredMods.get();
			const viewSetup = modsView$.activeViewSetupInActiveCategory.get();

			if (!viewSetup.isGroupingEnabled) {
				return ObservableHint.plain({ all: mods });
			}

			const result = groupBy(
				mods,
				(mod: Mod) => `${mod.slot}-${mod.modset}-${mod.primaryStat.type}`,
			);
			return ObservableHint.plain(result);
		},
		transformedMods: () => {
			const grouped = modsView$.groupedMods.get();
			const sortOptions = structuredClone(
				modsView$.activeViewSetupInActiveCategory.sort.get(),
			);

			if (sortOptions.size === 0) {
				const id = crypto.randomUUID();
				sortOptions.set(id, {
					id,
					sortBy: "characterID",
					sortOrder: "asc",
				});
			}

			const sortBys: string[] = [];
			const sortDirections: ("asc" | "desc")[] = [];
			for (const sortConfig of sortOptions.values()) {
				sortBys.push(sortConfig.sortBy);
				sortDirections.push(sortConfig.sortOrder);
			}

			const sortedMods = mapValues(grouped, (mods: Mod[]) => {
				const cache = new Map<string, string | number>();
				const iteratees = sortBys.map(
					(sortBy) => (mod: Mod) => getSortValue(mod, sortBy, cache),
				);
				const sortedMods = orderBy(mods, iteratees, sortDirections);
				return sortedMods;
			});
			const mods = Object.values(sortedMods);
			const result = mods.sort((mods1, mods2) => mods1.length - mods2.length);
			return ObservableHint.plain(result);
		},
		transformedModsCount: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.length;
		},
		quickFilterPredicate: () => {
			quickFilterPredicateCallCount += 1;
			const filter = modsView$.quickFilter.get();
			const modScore = modsView$.activeViewSetupInActiveCategory.modScore.get();
			const predicate = createCombinedPredicate(filter, modScore);
			const predicates: ModFilterPredicate[] = [];
			predicates.push(predicate);
			// TEST: Add a unique ID to each array to force it to be seen as different
			return { predicates, id: quickFilterPredicateCallCount };
		},
		namedFiltersPredicates: () => {
			const filterById =
				modsView$.activeViewSetupInActiveCategory.filterById.get();

			const filters = Object.values(filterById);
			const predicates: ModFilterPredicate[] = [];
			for (const filter of filters) {
				const modScore =
					modsView$.activeViewSetupInActiveCategory.modScore.get();

				predicates.push(createCombinedPredicate(filter, modScore));
			}

			return predicates;
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
		massSetFilter: (filterName: TriStateFilterKeys, value: TriState) => {
			const filter = modsView$.activeFilter[filterName];
			beginBatch();
			for (const key of Object.keys(filter)) {
				filter[key].set(value);
			}
			endBatch();
		},
		cycleState: (filterName: TriStateFilterKeys, valueKey: string) => {
			const filter = modsView$.activeFilter[filterName][valueKey];
			const value = filter.peek();
			if (value === -1) filter.set(0);
			if (value === 0) filter.set(1);
			if (value === 1) filter.set(-1);
		},
		reset: () => {
			beginBatch();
			modsView$.idOfActiveViewSetupByCategory.set({
				Reveal: "DefaultReveal",
				Level: "DefaultLevel",
				Slice5Dot: "DefaultSlice5Dot",
				Slice6E: "DefaultSlice6E",
				Slice6Dot: "DefaultSlice6Dot",
				Calibrate: "DefaultCalibrate",
				AllMods: "DefaultAllMods",
			});
			modsView$.idOfSelectedFilterByCategory.set({
				Reveal: "QuickFilter",
				Level: "QuickFilter",
				Slice5Dot: "QuickFilter",
				Slice6E: "QuickFilter",
				Slice6Dot: "QuickFilter",
				Calibrate: "QuickFilter",
				AllMods: "QuickFilter",
			});
			endBatch();
			beginBatch();
			syncStatus$.reset();
			modsView$.quickFilter.assign(cloneQuickFilter());
			endBatch();
		},
		restoreFromPersistable: (
			persistedData: PersistableModsViewSetupByIdByCategory,
		) => {
			const viewSetupByIdByCategory: ModsViewSetupByIdByCategory = {
				Reveal: {} as ViewSetupById,
				Level: {} as ViewSetupById,
				Slice5Dot: {} as ViewSetupById,
				Slice6E: {} as ViewSetupById,
				Slice6Dot: {} as ViewSetupById,
				Calibrate: {} as ViewSetupById,
				AllMods: {} as ViewSetupById,
			};
			for (const category of objectKeys(persistedData)) {
				for (const [viewSetupId, viewSetup] of Object.entries(
					persistedData[category],
				)) {
					const viewSetupClone = {
						...viewSetup,
						sort: new Map(Object.entries(viewSetup.sort)),
					};
					viewSetupByIdByCategory[category][viewSetupId] = viewSetupClone;
				}
			}
			modsView$.viewSetupByIdByCategory.set(viewSetupByIdByCategory);
		},
		toPersistable: (): PersistableModsViewSetupByIdByCategory => {
			const clone: ModsViewSetupByIdByCategory = structuredClone(
				modsView$.viewSetupByIdByCategory.peek(),
			);
			const persistableViewSetupByIdByCategory: PersistableModsViewSetupByIdByCategory =
				{
					Reveal: {},
					Level: {},
					Slice5Dot: {},
					Slice6E: {},
					Slice6Dot: {},
					Calibrate: {},
					AllMods: {},
				};
			for (const category of objectKeys(clone)) {
				for (const [viewSetupId, viewSetup] of Object.entries(
					clone[category],
				)) {
					const persistableViewSetup: PersistableViewSetup = {
						...viewSetup,
						sort: Object.fromEntries(viewSetup.sort),
					};
					persistableViewSetupByIdByCategory[category][viewSetupId] =
						persistableViewSetup;
				}
			}
			return persistableViewSetupByIdByCategory;
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
			const sortConfig = createSortConfig("characterID", "asc");
			modsView$.activeViewSetupInActiveCategory.sort.set(
				sortConfig.id,
				sortConfig,
			);
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

const syncStatus$ = syncObservable(
	modsView$.persistedData,
	persistOptions({
		persist: {
			name: "ViewSetup",
		},
		initial: structuredClone(defaultViewSetup),
	}),
);

export { modsView$, syncStatus$ };
