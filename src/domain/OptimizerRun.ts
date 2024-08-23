// domain
import type { GIMOFlatMod } from "./types/ModTypes";
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/state/optimizationSettings";

import type { CharactersById } from "./Character";
import type { SelectedCharacters } from "./SelectedCharacters";
import type { LockedStatusByCharacterId } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";

export interface OptimizerRun {
	allycode: string;
	characters: CharactersById;
	lockedStatus: LockedStatusByCharacterId;
	mods: GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	globalSettings: ProfileOptimizationSettings;
}

export const createOptimizerRun = (
	allycode: string,
	characters: CharactersById,
	lockedStatus: LockedStatusByCharacterId,
	mods: GIMOFlatMod[],
	selectedCharacters: SelectedCharacters,
	globalSettings: ProfileOptimizationSettings,
): OptimizerRun => {
	return {
		allycode: allycode,
		characters,
		lockedStatus,
		mods,
		selectedCharacters,
		globalSettings,
	};
};
