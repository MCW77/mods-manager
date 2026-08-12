// domain
import type { GIMOSetStatNames } from "./GIMOStatNames";
import type { SetStat } from "./SetStat";

interface SetBonus {
	name: GIMOSetStatNames;
	numberOfModsRequired: 2 | 4;
	smallBonus: SetStat;
	maxBonus: SetStat;
}

function createSetBonus(
	name: GIMOSetStatNames,
	numberOfModsRequired: 2 | 4,
	smallBonus: SetStat,
	maxBonus: SetStat,
): SetBonus {
	return {
		name,
		numberOfModsRequired,
		smallBonus,
		maxBonus,
	};
}

export { createSetBonus, type SetBonus };
