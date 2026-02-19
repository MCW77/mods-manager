// state
import { modScores$ } from "#/modules/modScores/state/modScores";

// domain
import type { Mod } from "#/domain/Mod";
import type {
	Filter,
	PartialFilter,
	TriStateFilterKeys,
} from "./ModsViewOptions";

type ModFilterPredicate = (mod: Mod) => boolean;

function createCombinedPredicate(
	filter: Filter,
	modScore: string,
): ModFilterPredicate {
	const [selectedOptions, unselectedOptions] =
		extractSelectedAndUnselectedOptions(filter);
	return combineFilters([
		createSelectedOptionsFilter(selectedOptions),
		createUnselectedOptionsFilter(unselectedOptions),
		extractScoreFilter(filter, modScore),
		extractSpeedFilter(filter),
		extractSecondaryFilter(filter),
	]);
}

/**
 * Combines multiple filter predicates into a single predicate using AND logic.
 */
function combineFilters(filters: ModFilterPredicate[]): ModFilterPredicate {
	return (mod: Mod) => filters.every((filter) => filter(mod));
}

/**
 * Extract speed filter from filter config.
 */
function extractSpeedFilter(filter: Filter): ModFilterPredicate {
	return (mod: Mod) => {
		const [min, max] = filter.speedRange;
		const modSpeed =
			mod.secondaryStats.find((secondary) => secondary.type === "Speed")
				?.value ?? 0;
		return min <= modSpeed && modSpeed <= max;
	};
}

/**
 * Extract score filter from filter config.
 */
function extractScoreFilter(
	filter: Filter,
	scoreName: string,
): ModFilterPredicate {
	return (mod: Mod) => {
		const [min, max] = filter.score;
		const modScoreValue = modScores$.getModScore(mod, scoreName).value;
		return min <= modScoreValue && modScoreValue <= max;
	};
}

/**
 * Extract secondary stat rolls filter from filter config.
 */
function extractSecondaryFilter(filter: Filter): ModFilterPredicate {
	return (mod: Mod) => {
		for (const [statType, minMaxRolls] of Object.entries(filter.secondary)) {
			const [minRolls, maxRolls] = minMaxRolls as [number, number];
			const secondaryStat = mod.secondaryStats.find(
				(secondary) => secondary.type === statType,
			);
			const rollCount = secondaryStat ? secondaryStat.rolls : 0;

			if (rollCount < minRolls || rollCount > maxRolls) {
				return false;
			}
		}
		return true;
	};
}

/**
 * Extract selected/unselected options from a filter.
 */
function extractSelectedAndUnselectedOptions(
	filters: Filter,
): [PartialFilter, PartialFilter] {
	const selectedOptions: PartialFilter = {
		slot: [],
		modset: [],
		rarity: [],
		tier: [],
		level: [],
		equipped: [],
		primary: [],
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
		assigned: [],
		calibration: [],
	};

	type FilterKV = [TriStateFilterKeys, Filter[TriStateFilterKeys]];
	const entries = Object.entries(filters) as FilterKV[];

	for (const [type, values] of entries) {
		if (selectedOptions[type] === undefined) continue;
		selectedOptions[type] = Object.entries(values)
			.filter(([_option, value]) => 1 === value)
			.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
		unselectedOptions[type] = Object.entries(values)
			.filter(([_option, value]) => -1 === value)
			.map(([option]) => (Number.isNaN(Number(option)) ? option : +option));
	}

	return [selectedOptions, unselectedOptions];
}

/**
 * Create filter predicate for selected options.
 */
function createSelectedOptionsFilter(
	selectedOptions: PartialFilter,
): ModFilterPredicate {
	return (mod: Mod) => {
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
}

/**
 * Create filter predicate for unselected options.
 */
function createUnselectedOptionsFilter(
	unselectedOptions: PartialFilter,
): ModFilterPredicate {
	return (mod: Mod) => {
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
			unselectedOptions.calibration.length > 0 &&
			!unselectedOptions.calibration.every(
				(calibrationCost) => mod.reRollPrice() !== calibrationCost,
			)
		)
			return false;
		if (unselectedOptions.assigned.length > 0 && mod.isAssigned()) return false;
		return true;
	};
}

export { type ModFilterPredicate, createCombinedPredicate };
