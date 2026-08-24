// state
import type { Observable, ObservablePrimitive } from "@legendapp/state";

// domain
import type { Mod } from "#/domain/Mod";

interface StatisticsObservable {
	allMods: () => Mod[];
	speedGreaterThanTen: () => [number, number];
	speedGreaterThanFifteen: () => [number, number];
	speedGreaterThanTwenty: () => [number, number];
	speedGreaterThanTwentyFive: () => [number, number];
	averageSpeed: () => number;
	speedDistributionAccumulated: () => {
		speed: number;
		count5Dot: number;
		count6Dot: number;
	}[];
	speedDistributionFull: () => {
		speed: number;
		count5Dot: number;
		count6Dot: number;
	}[];
}

export type { StatisticsObservable };
