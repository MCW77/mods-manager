// domain
import type { Mod } from "#/domain/Mod";

interface StatisticsObservable {
	allMods: () => Mod[];
	speedSecondaryMods: () => Mod[];
	defenseSecondaryMods: () => Mod[];
	defenseGreaterThan9: () => number;
	defenseGreaterThan14: () => number;
	offenseSecondaryMods: () => Mod[];
	offenseGreaterThan4: () => number;
	offenseGreaterThan6: () => number;
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
