// utils
import { groupBy } from "#/utils/groupBy";
import memoizeOne from "memoize-one";
import orderBy from "lodash-es/orderBy";
import mapValues from "lodash-es/mapValues";

// domain
import type {
	Filter,
	ViewSetup,
	PartialFilter,
	TriStateFilterKeys,
} from "./ModsViewOptions";
import type { SortConfigById } from "./SortConfig";
import { Mod } from "#/domain/Mod";

type ModFilterPredicate = (mod: Mod) => boolean;

const combineFilters: (filters: ModFilterPredicate[]) => ModFilterPredicate =
	(filters) => (item: Mod) => {
		return filters.map((filter) => filter(item)).every((x) => x === true);
	};

class ModsFilter {
	selectedOptions: PartialFilter = {
		slot: [],
		modset: [],
		rarity: [],
		tier: [],
		level: [],
		equipped: [],
		primary: [],
		secondary: [],
		assigned: [],
		calibration: [],
	};

	unselectedOptions: PartialFilter = structuredClone(this.selectedOptions);
	filters: ModFilterPredicate[] = [];
	quickFilter: ModFilterPredicate;
	sortOptions: SortConfigById;
	isGroupingEnabled: boolean;

	constructor(modsViewOptions: ViewSetup, quickFilter: Filter) {
		Mod.setupAccessors();
		[this.selectedOptions, this.unselectedOptions] =
			this.extractSelectedAndUnselectedOptions(quickFilter);
		this.quickFilter = combineFilters([
			this.selectedOptionsFilter(this.selectedOptions),
			this.unselectedOptionsFilter(this.unselectedOptions),
			this.extractScoreFilter(quickFilter, modsViewOptions.modScore),
			this.extractSpeedFilter(quickFilter),
		]);

		for (const filter of Object.values(modsViewOptions.filterById)) {
			[this.selectedOptions, this.unselectedOptions] =
				this.extractSelectedAndUnselectedOptions(filter);
			this.filters.push(
				combineFilters([
					this.selectedOptionsFilter(this.selectedOptions),
					this.unselectedOptionsFilter(this.unselectedOptions),
					this.extractScoreFilter(filter, modsViewOptions.modScore),
					this.extractSpeedFilter(filter),
				]),
			);
		}

		this.isGroupingEnabled = modsViewOptions.isGroupingEnabled;

		this.sortOptions = structuredClone(modsViewOptions.sort);

		if (this.sortOptions.size === 0) {
			const id = crypto.randomUUID();
			this.sortOptions.set(id, {
				id,
				sortBy: "characterID",
				sortOrder: "asc",
			});
		}
	}

	extractSpeedFilter(filter: Filter) {
		return (mod: Mod) => {
			const [min, max] = filter.speedRange;
			const modSpeed =
				mod.secondaryStats.find((secondary) => secondary.type === "Speed")
					?.value ?? 0;
			return min <= modSpeed && modSpeed <= max;
		};
	}

	extractScoreFilter(filter: Filter, scoreName: string) {
		return (mod: Mod) => {
			const [min, max] = filter.score;
			return min <= mod.scores[scoreName] && mod.scores[scoreName] <= max;
		};
	}

	extractSelectedAndUnselectedOptions(filters: Filter) {
		const selectedOptions: PartialFilter = {
			slot: [],
			modset: [],
			rarity: [],
			tier: [],
			level: [],
			equipped: [],
			primary: [],
			secondary: [],
			assigned: [],
			calibration: [],
		};
		const unselectedOptions: PartialFilter = {
			slot: [],
			modset: [],
			rarity: [],
			tier: [],
			level: [],
			equipped: [],
			primary: [],
			secondary: [],
			assigned: [],
			calibration: [],
		};

		type FilterKV = [TriStateFilterKeys, Filter[TriStateFilterKeys]];

		const entries2 = Object.entries(filters) as FilterKV[];

		for (const [type, values] of entries2) {
			selectedOptions[type] = Object.entries(values)
				.filter(([option, value]) => 1 === value)
				.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
			unselectedOptions[type] = Object.entries(values)
				.filter(([option, value]) => -1 === value)
				.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
		}

		return [selectedOptions, unselectedOptions];
	}

	selectedOptionsFilter = (selectedOptions: PartialFilter) => (mod: Mod) => {
		if (
			selectedOptions.slot.length > 0 &&
			!selectedOptions.slot.every((slot) => mod.slot === slot)
		)
			return false;
		if (
			selectedOptions.modset.length > 0 &&
			!selectedOptions.modset.every((set) => mod.modset === set)
		)
			return false;
		if (
			selectedOptions.rarity.length > 0 &&
			!selectedOptions.rarity.every((pips) => mod.pips === pips)
		)
			return false;
		if (
			selectedOptions.tier.length > 0 &&
			!selectedOptions.tier.every((tier) => mod.tier === tier)
		)
			return false;
		if (
			selectedOptions.level.length > 0 &&
			!selectedOptions.level.every((level) => mod.level === level)
		)
			return false;
		if (selectedOptions.equipped.length > 0 && mod.characterID === "null")
			return false;
		if (
			selectedOptions.primary.length > 0 &&
			!selectedOptions.primary.every(
				(primary) => mod.primaryStat.type === primary,
			)
		)
			return false;
		if (
			selectedOptions.secondary.length > 0 &&
			!selectedOptions.secondary.every((secondary) =>
				mod.secondaryStats.some(
					(modSecondary) => modSecondary.type === secondary,
				),
			)
		)
			return false;
		if (selectedOptions.assigned.length > 0 && !mod.isAssigned()) return false;
		if (
			selectedOptions.calibration.length > 0 &&
			!selectedOptions.calibration.every(
				(calibrationCost) => mod.reRollPrice() === calibrationCost,
			)
		)
			return false;
		return true;
	};

	unselectedOptionsFilter =
		(unselectedOptions: PartialFilter) => (mod: Mod) => {
			if (
				unselectedOptions.slot.length > 0 &&
				!unselectedOptions.slot.every((slot) => mod.slot !== slot)
			)
				return false;
			if (
				unselectedOptions.modset.length > 0 &&
				!unselectedOptions.modset.every((set) => mod.modset !== set)
			)
				return false;
			if (
				unselectedOptions.rarity.length > 0 &&
				!unselectedOptions.rarity.every((pips) => mod.pips !== pips)
			)
				return false;
			if (
				unselectedOptions.tier.length > 0 &&
				!unselectedOptions.tier.every((tier) => mod.tier !== tier)
			)
				return false;
			if (
				unselectedOptions.level.length > 0 &&
				!unselectedOptions.level.every((level) => mod.level !== level)
			)
				return false;
			if (unselectedOptions.equipped.length > 0 && mod.characterID !== "null")
				return false;
			if (
				unselectedOptions.primary.length > 0 &&
				!unselectedOptions.primary.every(
					(primary) => mod.primaryStat.type !== primary,
				)
			)
				return false;
			if (
				unselectedOptions.secondary.length > 0 &&
				!unselectedOptions.secondary.every((secondary) =>
					mod.secondaryStats.every(
						(modSecondary) => modSecondary.type !== secondary,
					),
				)
			)
				return false;
			if (
				unselectedOptions.calibration.length > 0 &&
				!unselectedOptions.calibration.every(
					(calibrationCost) => mod.reRollPrice() !== calibrationCost,
				)
			)
				return false;
			if (unselectedOptions.assigned.length > 0 && mod.isAssigned())
				return false;
			return true;
		};

	filterMods(mods: Mod[]) {
		let result: Mod[] = this.filters.length === 0 ? mods : [];
		let filteredMods: Mod[] = [];
		for (const filter of this.filters) {
			filteredMods = mods.filter(filter);
			for (const mod of filteredMods) {
				if (!result.includes(mod)) result.push(mod);
			}
		}
		result = result.filter(this.quickFilter);
		return result;
	}

	filterGroupedMods(groupedMods: Record<string, Mod[]>): Record<string, Mod[]> {
		const filteredMods: Record<string, Mod[]> = mapValues(
			groupedMods,
			(mods: Mod[]) => this.filterMods(mods),
		);
		for (const group in filteredMods) {
			if (filteredMods[group].length === 0) delete filteredMods[group];
		}
		return filteredMods;
	}

	groupMods(mods: Mod[]) {
		const ungroupedMods = memoizeOne((mods: Mod[]) => {
			return {
				all: mods,
			};
		});

		const groupedMods = memoizeOne((mods: Mod[]) => {
			return groupBy(
				mods,
				(mod: Mod) => `${mod.slot}-${mod.modset}-${mod.primaryStat.type}`,
			);
		});

		if (this.isGroupingEnabled) return groupedMods(mods);

		return ungroupedMods(mods);
	}

	sortGroupedMods(groupedMods: Record<string, Mod[]>): Record<string, Mod[]> {
		const sortBys: string[] = [];
		const sortDirections: ("asc" | "desc")[] = [];
		for (const sortConfig of this.sortOptions.values()) {
			sortBys.push(sortConfig.sortBy);
			sortDirections.push(sortConfig.sortOrder);
		}
		return mapValues(groupedMods, (mods: Mod[]) =>
			orderBy(mods, sortBys, sortDirections),
		);
	}

	getGroupedModsCount(groupedMods: Record<string, Mod[]>) {
		return Object.entries(groupedMods).reduce((acc, [group, mods]) => {
			return acc + mods.length;
		}, 0);
	}

	applyModsViewOptions(mods: Mod[]): [Record<string, Mod[]>, number] {
		let groupedMods = this.groupMods(mods);
		groupedMods = this.filterGroupedMods(groupedMods);
		groupedMods = this.sortGroupedMods(groupedMods);
		return [groupedMods, this.getGroupedModsCount(groupedMods)];
	}
}

export { ModsFilter };
