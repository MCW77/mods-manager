// domain
import type { Mod } from "#/domain/Mod";

interface StatisticsObservable {
	allMods: () => Mod[];
	modsByModset: () => { modset: string; count: number }[];
	speedSecondaryMods: () => Mod[];
	defenseSecondaryMods: () => Mod[];
	defense9OrGreater: () => number;
	defense14OrGreater: () => number;
	offenseSecondaryMods: () => Mod[];
	offense4OrGreater: () => number;
	offense6OrGreater: () => number;
	speed10OrGreater: () => [number, number];
	speed15OrGreater: () => [number, number];
	speed20OrGreater: () => [number, number];
	speed25OrGreater: () => [number, number];
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
