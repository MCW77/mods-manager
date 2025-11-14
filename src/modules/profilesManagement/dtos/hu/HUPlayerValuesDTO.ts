import type { CharacterNames } from "#/constants/CharacterNames.js";

import type { HUCharacterStatsDTO } from "./HUCharacterStatsDTO.js";

interface HUPlayerValuesDTO {
	baseId: CharacterNames;
	equipment: string[];
	gearLevel: number;
	id: string;
	level: number;
	power: number;
	rarity: number;
	relicTier: number;
	stats: {
		base: HUCharacterStatsDTO;
		gear?: HUCharacterStatsDTO;
	};
}

export type { HUPlayerValuesDTO };
