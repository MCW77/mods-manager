// domain
import type { GIMOFlatMod } from "./types/ModTypes";
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/state/optimizationSettings";

import type { CharactersById } from "./Character";
import type { SelectedCharacters } from "./SelectedCharacters";
import type { LockedStatusByCharacterId } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";

export interface OptimizerRun {
	allyCode: string;
	characters: CharactersById;
	lockedStatus: LockedStatusByCharacterId;
	mods: GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	globalSettings: ProfileOptimizationSettings;
}

export const createOptimizerRun = (
	allyCode: string,
	characters: CharactersById,
	lockedStatus: LockedStatusByCharacterId,
	mods: GIMOFlatMod[],
	selectedCharacters: SelectedCharacters,
	globalSettings: ProfileOptimizationSettings,
): OptimizerRun => {
	return {
		allyCode,
		characters,
		lockedStatus,
		mods,
		selectedCharacters,
		globalSettings,
	};
};
