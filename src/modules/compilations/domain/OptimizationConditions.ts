// domain
import type { CharacterById } from "#/domain/Character";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

import type { LockedStatusByCharacterId } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/domain/ProfileOptimizationSettings";

type OptimizationConditions = {
	characterById: CharacterById;
	lockedStatus: LockedStatusByCharacterId;
	modCount: number;
	selectedCharacters: SelectedCharacters;
	globalSettings: ProfileOptimizationSettings;
} | null;

const createOptimizationConditions = (
	characterById: CharacterById,
	lockedStatus: LockedStatusByCharacterId,
	modCount: number,
	selectedCharacters: SelectedCharacters,
	globalSettings: ProfileOptimizationSettings,
): OptimizationConditions => {
	return {
		characterById,
		lockedStatus,
		modCount,
		selectedCharacters,
		globalSettings,
	};
};

export { type OptimizationConditions, createOptimizationConditions };
