// domain
import type { GIMOFlatMod } from "./types/ModTypes";
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/state/optimizationSettings";

import type { Characters } from "./Character";
import type { SelectedCharacters } from "./SelectedCharacters";

export interface OptimizerRun {
	allyCode: string;
	characters: Characters;
	mods: GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	globalSettings: ProfileOptimizationSettings;
}

export const createOptimizerRun = (
	allyCode: string,
	characters: Characters,
	mods: GIMOFlatMod[],
	selectedCharacters: SelectedCharacters,
	globalSettings: ProfileOptimizationSettings,
): OptimizerRun => {
	return {
		allyCode,
		characters,
		mods,
		selectedCharacters,
		globalSettings,
	};
};
