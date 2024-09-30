// domain
import type { GIMOFlatMod } from "./types/ModTypes";
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/state/optimizationSettings";

import type { CharacterById } from "./Character";
import type { SelectedCharacters } from "./SelectedCharacters";
import type { LockedStatusByCharacterId } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";

export interface OptimizerRun {
	allycode: string;
	characterById: CharacterById;
	lockedStatus: LockedStatusByCharacterId;
	mods: GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	globalSettings: ProfileOptimizationSettings;
}

export const createOptimizerRun = (
	allycode: string,
	characterById: CharacterById,
	lockedStatus: LockedStatusByCharacterId,
	mods: GIMOFlatMod[],
	selectedCharacters: SelectedCharacters,
	globalSettings: ProfileOptimizationSettings,
): OptimizerRun => {
	return {
		allycode,
		characterById,
		lockedStatus,
		mods,
		selectedCharacters,
		globalSettings,
	};
};
