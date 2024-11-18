import type { CharacterNames } from "#/constants/characterSettings";

export interface OptimizationStatus {
	character: CharacterNames | "";
	characterCount: number;
	characterIndex: number;
	message: string;
	progress: number;
	sets: string[];
	setsCount: number;
	setsIndex: number;
	targetStat: string;
	targetStatCount: number;
	targetStatIndex: number;
}
