// utils
import { groupBy } from "../../../utils/groupBy";
import memoizeOne from "memoize-one";
import { orderBy, mapValues } from "lodash-es";

// domain
import type {
	EquippedSettings,
	FilterKeys,
	FilterOptions,
	LevelSettings,
	ModsViewOptions,
	PrimarySettings,
	RaritySettings,
	SecondariesScoreTierSettings,
	SecondarySettings,
	SetSettings,
	SlotSettings,
	TierSettings,
} from "../../../domain/types/ModsViewOptionsTypes";
import { Mod } from "../../../domain/Mod";
import type { OptimizerSettings } from "../../../domain/OptimizerSettings";

type AnyFilterOptions = {
	[key in keyof FilterOptions]: any[];
};

class ModsFilter {
	selectedOptions: AnyFilterOptions;
	unselectedOptions: AnyFilterOptions;

	sortOptions: string[];
	isGroupingEnabled: boolean;

	constructor(modsViewOptions: ModsViewOptions) {
		Mod.setupAccessors();
		[this.selectedOptions, this.unselectedOptions] =
			this.extractSelectedAndUnselectedOptions(modsViewOptions.filtering);

		this.isGroupingEnabled = modsViewOptions.isGroupingEnabled;

		this.sortOptions = modsViewOptions.sort;
		this.sortOptions = this.sortOptions.filter((option) => option !== "");

		if (!this.sortOptions.includes("character")) {
			this.sortOptions.push("character");
			this.sortOptions.push("characterID");
		}
	}

	extractSelectedAndUnselectedOptions(filters: FilterOptions) {
		const selectedOptions: { [key in FilterKeys]: any[] } = {
			slot: [],
			set: [],
			rarity: [],
			tier: [],
			level: [],
			equipped: [],
			primary: [],
			secondary: [],
			optimizer: [],
			secondariesscoretier: [],
		};
		const unselectedOptions: { [key in FilterKeys]: any[] } = {
			slot: [],
			set: [],
			rarity: [],
			tier: [],
			level: [],
			equipped: [],
			primary: [],
			secondary: [],
			optimizer: [],
			secondariesscoretier: [],
		};

		// #region CombinedSettings
		type CombinedSettings =
			| SlotSettings
			| SetSettings
			| RaritySettings
			| TierSettings
			| LevelSettings
			| PrimarySettings
			| SecondarySettings
			| EquippedSettings
			| OptimizerSettings
			| SecondariesScoreTierSettings;
		// #endregion

		type FilterKV = [FilterKeys, CombinedSettings];

		const entries = Object.entries(filters) as FilterKV[];

		for (const [type, values] of entries) {
			selectedOptions[type] = Object.entries(values)
				.filter(([option, value]) => 1 === value)
				.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
			unselectedOptions[type] = Object.entries(values)
				.filter(([option, value]) => -1 === value)
				.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
		}

		return [selectedOptions, unselectedOptions];
	}

	selectedOptionsFilter = (mod: Mod) => {
		if (
			this.selectedOptions.slot.length > 0 &&
			!this.selectedOptions.slot.every((slot) => mod.slot === slot)
		)
			return false;
		if (
			this.selectedOptions.set.length > 0 &&
			!this.selectedOptions.set.every((set) => mod.set === set)
		)
			return false;
		if (
			this.selectedOptions.rarity.length > 0 &&
			!this.selectedOptions.rarity.every((pips) => mod.pips === pips)
		)
			return false;
		if (
			this.selectedOptions.tier.length > 0 &&
			!this.selectedOptions.tier.every((tier) => mod.tier === tier)
		)
			return false;
		if (
			this.selectedOptions.level.length > 0 &&
			!this.selectedOptions.level.every((level) => mod.level === level)
		)
			return false;
		if (this.selectedOptions.equipped.length > 0 && mod.characterID === "null")
			return false;
		if (
			this.selectedOptions.primary.length > 0 &&
			!this.selectedOptions.primary.every(
				(primary) => mod.primaryStat.type === primary,
			)
		)
			return false;
		if (
			this.selectedOptions.secondary.length > 0 &&
			!this.selectedOptions.secondary.every((secondary) =>
				mod.secondaryStats.some(
					(modSecondary) => modSecondary.type === secondary,
				),
			)
		)
			return false;
		if (this.selectedOptions.optimizer.length > 0 && !mod.isAssigned())
			return false;
		return true;
	};

	unselectedOptionsFilter = (mod: Mod) => {
		if (
			this.unselectedOptions.slot.length > 0 &&
			!this.unselectedOptions.slot.every((slot) => mod.slot !== slot)
		)
			return false;
		if (
			this.unselectedOptions.set.length > 0 &&
			!this.unselectedOptions.set.every((set) => mod.set !== set)
		)
			return false;
		if (
			this.unselectedOptions.rarity.length > 0 &&
			!this.unselectedOptions.rarity.every((pips) => mod.pips !== pips)
		)
			return false;
		if (
			this.unselectedOptions.tier.length > 0 &&
			!this.unselectedOptions.tier.every((tier) => mod.tier !== tier)
		)
			return false;
		if (
			this.unselectedOptions.level.length > 0 &&
			!this.unselectedOptions.level.every((level) => mod.level !== level)
		)
			return false;
		if (
			this.unselectedOptions.equipped.length > 0 &&
			mod.characterID !== "null"
		)
			return false;
		if (
			this.unselectedOptions.primary.length > 0 &&
			!this.unselectedOptions.primary.every(
				(primary) => mod.primaryStat.type !== primary,
			)
		)
			return false;
		if (
			this.unselectedOptions.secondary.length > 0 &&
			!this.unselectedOptions.secondary.every((secondary) =>
				mod.secondaryStats.every(
					(modSecondary) => modSecondary.type !== secondary,
				),
			)
		)
			return false;
		if (this.unselectedOptions.optimizer.length > 0 && mod.isAssigned())
			return false;
		return true;
	};

	filterMods(mods: Mod[]) {
		return mods
			.filter(this.selectedOptionsFilter)
			.filter(this.unselectedOptionsFilter);
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
				(mod: Mod) => `${mod.slot}-${mod.set}-${mod.primaryStat.type}`,
			);
		});

		if (this.isGroupingEnabled) return groupedMods(mods);

		return ungroupedMods(mods);
	}

	sortGroupedMods(groupedMods: Record<string, Mod[]>): Record<string, Mod[]> {
		return mapValues(groupedMods, (mods: Mod[]) =>
			orderBy(
				mods,
				this.sortOptions,
				this.sortOptions.map((opt) => "desc"),
			),
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
