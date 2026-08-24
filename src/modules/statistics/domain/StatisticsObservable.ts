// state
import type { Observable, ObservablePrimitive } from "@legendapp/state";

// domain
import type { Mod } from "#/domain/Mod";

interface StatisticsObservable {
	allMods: () => Mod[];
	speedGreaterThanTen: () => number;
	speedGreaterThanFifteen: () => number;
	speedGreaterThanTwenty: () => number;
	speedGreaterThanTwentyFive: () => number;
	speedDistribution: () => {
		speed: number;
		count: number;
	}[];
}

export type { StatisticsObservable };
