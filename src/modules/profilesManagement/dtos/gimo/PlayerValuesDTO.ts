import type { CharacterStatsDTO } from "./CharacterStatsDTO.js";

interface PlayerValuesDTO {
	level: number;
	stars: number;
	gearLevel: number;
	gearPieces: string[];
	galacticPower: number;
	baseStats: CharacterStatsDTO;
	equippedStats: CharacterStatsDTO;
	relicTier: number;
}

export type { PlayerValuesDTO };
