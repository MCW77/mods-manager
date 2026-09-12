import type { CharacterNames } from "#/constants/CharacterNames";
import type { CharacterStats } from "./CharacterStats";

interface PlayerValues {
	level: number;
	stars: number;
	gearLevel: number;
	gearPieces: string[];
	galacticPower: number;
	equippedStats: CharacterStats;
	relicTier: number;
}

type PlayerValuesByCharacter = Record<CharacterNames, PlayerValues>;

export type { PlayerValues, PlayerValuesByCharacter };
