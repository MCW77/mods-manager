import type { CharacterStatsDTO } from "./CharacterStatsDTO";

interface PlayerValuesDTO {
	level: number;
	stars: number;
	gearLevel: number;
	gearPieces: string[];
	galacticPower: number;
	equippedStats: CharacterStatsDTO;
	relicTier: number;
}

export type { PlayerValuesDTO };
