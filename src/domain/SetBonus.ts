// domain
import type { SetStats } from "./Stats";

class SetBonus {
	constructor(
		public name: SetStats.GIMOStatNames,
		public numberOfModsRequired: number,
		public smallBonus: SetStats.SetStat,
		public maxBonus: SetStats.SetStat,
	) {}
}

export default SetBonus;
