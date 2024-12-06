// domain
import type { GIMOSetStatNames } from "./GIMOStatNames";
import type { SetStats } from "./Stats";

class SetBonus {
	constructor(
		public name: GIMOSetStatNames,
		public numberOfModsRequired: number,
		public smallBonus: SetStats.SetStat,
		public maxBonus: SetStats.SetStat,
	) {}
}

export default SetBonus;
