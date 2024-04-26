import type * as DTOs from "../";

interface PlayerValuesDTO {
	level: number;
	stars: number;
	gearLevel: number;
	gearPieces: string[];
	galacticPower: number;
	baseStats: DTOs.GIMO.CharacterStatsDTO;
	equippedStats: DTOs.GIMO.CharacterStatsDTO;
	relicTier: number;
}

export type { PlayerValuesDTO };
