// domain
import type { Mod } from "./Mod";

export interface ModScore {
	name: string;
	displayName: string;
	description: string;
	isFlatOrPercentage: "IsPercentage" | "IsFlat";
	scoringAlgorithm: (mod: Mod) => number;
}

export function createModScore(
	name: string,
	displayName: string,
	description: string,
	isFlatOrPercentage: "IsPercentage" | "IsFlat",
	scoringAlgorithm: (mod: Mod) => number,
): ModScore {
	return {
		name,
		displayName,
		description,
		isFlatOrPercentage,
		scoringAlgorithm,
	};
}
