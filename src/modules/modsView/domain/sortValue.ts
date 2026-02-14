// domain
import { fromScaled } from "#/utils/scaledNumber";
import { modScores, type Mod } from "#/domain/Mod";
import { SecondaryStat } from "#/domain/SecondaryStat";

type SortValueHandler = (mod: Mod) => string | number;

const sortValueHandlers = new Map<string, SortValueHandler>();

// Register Stat and StatScore handlers
for (const statName of SecondaryStat.statNames) {
	sortValueHandlers.set(`Stat${statName}`, (mod: Mod) => {
		for (const stat of mod.secondaryStats) {
			if (stat.type === statName) return stat.value;
		}
		return 0;
	});
	sortValueHandlers.set(`StatScore${statName}`, (mod: Mod) => {
		for (const stat of mod.secondaryStats) {
			if (stat.type === statName) return fromScaled(stat.score.value);
		}
		return 0;
	});
}

// Register ModScore handlers
for (const modScore of modScores) {
	sortValueHandlers.set(
		`ModScore${modScore.name}`,
		(mod: Mod) => mod.scores[modScore.name] ?? 0,
	);
}

// Register known calculated properties
sortValueHandlers.set("TotalCalibrations", (mod: Mod) =>
	mod.pips < 6 ? 0 : mod.tier + 1,
);

/**
 * Get the sort value for a mod based on the sortBy key.
 * Handles all 37 sortBy parameters: misc properties, stats, stat scores, and mod scores.
 * Optional cache parameter can be used to memoize values during heavy sort operations.
 */
export function getSortValue(
	mod: Mod,
	sortBy: string,
	cache?: Map<string, string | number>,
): string | number {
	const cacheKey = cache ? `${mod.id}-${sortBy}` : undefined;
	if (cache && cacheKey) {
		const cached = cache.get(cacheKey);
		if (cached !== undefined) return cached;
	}

	let value: string | number;
	const handler = sortValueHandlers.get(sortBy);

	if (handler) {
		value = handler(mod);
	} else {
		// Fallback for direct properties (e.g., "characterID", "speedRemainder", etc.)
		const prop = mod[sortBy as keyof Mod] as unknown as
			| string
			| number
			| undefined;
		// Return prop if it exists, otherwise 0 to be safe for sorting
		value = prop ?? 0;
	}

	if (cache && cacheKey) {
		cache.set(cacheKey, value);
	}

	return value;
}
