import type { CharacterNames } from "#/constants/CharacterNames";

import type { HUCharacterStats } from "./HUCharacterStats";

interface HUPlayerValues {
	baseId: CharacterNames;
	equipment: string[];
	gearLevel: number;
	id: string;
	level: number;
	power: number;
	rarity: number;
	relicTier: number;
	stats: {
		base: HUCharacterStats;
		gear?: HUCharacterStats;
	};
}

export type { HUPlayerValues };
