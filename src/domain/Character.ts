// utils
import groupByKey from "../utils/groupByKey";

// domain
import type { CharacterNames } from "../constants/CharacterNames";

import type * as DTOs from "../modules/profilesManagement/dtos/index";

import type { CharacterSettingsIndexer } from "./CharacterSettings";
import {
	createOptimizationPlan,
	type OptimizationPlan,
} from "./OptimizationPlan";

export interface Character {
	id: CharacterNames;
	playerValues: DTOs.GIMO.PlayerValuesDTO;
	targets: OptimizationPlan[];
}

export type CharacterById = Record<CharacterNames, Character>;

export const createCharacter = (
	id: CharacterNames,
	playerValues: DTOs.GIMO.PlayerValuesDTO,
	targets: OptimizationPlan[],
): Character => {
	return {
		id,
		playerValues,
		targets,
	};
};

export const targets = (
	characterSettings: CharacterSettingsIndexer,
	char: Character,
) => {
	const defaultTargets = groupByKey(
		characterSettings[char.id]?.targets ?? [],
		(target) => target.id,
	);
	const playerTargets = groupByKey(char.targets, (target) => target.id);

	return Object.values(Object.assign({}, defaultTargets, playerTargets));
};

export const defaultTarget = (
	characterSettings: CharacterSettingsIndexer,
	char: Character,
) => {
	return (
		targets(characterSettings, char)[0] ?? createOptimizationPlan("unnamed")
	);
};

export const compareGP = (thisChar: Character, thatChar: Character) => {
	if (
		thatChar.playerValues.galacticPower === thisChar.playerValues.galacticPower
	) {
		return thisChar.id.localeCompare(thatChar.id);
	}
	return (
		thatChar.playerValues.galacticPower - thisChar.playerValues.galacticPower
	);
};
