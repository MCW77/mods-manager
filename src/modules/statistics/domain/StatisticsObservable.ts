// domain
import type { RequirementsCountByCombination } from "#/domain/Combination";
import type { Mod } from "#/domain/Mod";

interface StatisticsObservable {
	allMods: () => Mod[];
	modsByModset: () => { modset: string; count: number }[];
	modsBySlot: () => {
		speed: number;
		square: number;
		arrow: number;
		diamond: number;
		triangle: number;
		circle: number;
		cross: number;
	}[];
	speedSecondaryMods: () => Mod[];
	defenseSecondaryMods: () => Mod[];
	defense9OrGreater: () => number;
	defense14OrGreater: () => number;
	offenseSecondaryMods: () => Mod[];
	offense4OrGreater: () => number;
	offense6OrGreater: () => number;
	speed10OrGreater: () => [number, number];
	speed15OrGreater: () => [number, number];
	speed15OrGreaterAllMods: () => number;
	speed20OrGreater: () => [number, number];
	speed20OrGreaterAllMods: () => number;
	speed25OrGreater: () => [number, number];
	speed25OrGreaterAllMods: () => number;
	averageSpeed: () => number;
	modQualityDSR: () => number;
	modQualityHU: () => number;
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
	squadGP: () => number;
	modsToFarm: () => RequirementsCountByCombination;
	modsToFarmOfModset: (modset: string) => RequirementsCountByCombination;
	modsOfSlotAndModset: (slotAndModset: string) => Mod[];
	missingModsOfSlot(slot: string): {
		available5Dot: number;
		available6Dot: number;
		missing5Dot: number;
		missing6Dot: number;
		required5Dot: number;
		required6Dot: number;
	};
}

export type { StatisticsObservable };
