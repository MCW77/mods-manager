// utils
import groupByKey from "../utils/groupByKey";

// domain
import {
	characterSettings,
	type CharacterNames,
} from "../constants/characterSettings";
import type * as DTOs from "../modules/profilesManagement/dtos";

import { createOptimizationPlan, type OptimizationPlan } from "./OptimizationPlan";

export interface Character {
	id: CharacterNames;
	playerValues: DTOs.GIMO.PlayerValuesDTO;
	targets: OptimizationPlan[];
}

export type CharactersById = Record<CharacterNames, Character>;

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

export const withPlayerValues = (
	char: Character,
	playerValues: DTOs.GIMO.PlayerValuesDTO,
): Character => {
	return {
		...char,
		playerValues,
	};
};

export const withTargets = (
	char: Character,
	targets: OptimizationPlan[],
): Character => {
	return {
		...char,
		targets,
	};
};

export const  withTargetsOverrides = (
	char: Character,
	targets: OptimizationPlan[]
) => {
  const oldTargetsObject = groupByKey(char.targets, target => target.id);
  const newTargetsObject = groupByKey(targets, target => target.id);

  return {
		...char,
    targets: Object.values(Object.assign({}, oldTargetsObject, newTargetsObject)),
	};
}

export const withDeletedTarget = (
	char: Character,
	targetName: string,
): Character => {
	const newTargets = char.targets.slice();
  const targetIndex = newTargets.findIndex(target => target.id === targetName);
  if (-1 !== targetIndex) {
    newTargets.splice(targetIndex, 1);
  }

	return withTargets(
		char,
		newTargets,
	);
};

export const targets = (char: Character) => {
	const defaultTargets = groupByKey(
		characterSettings[char.id]?.targets ?? [],
		(target) => target.id,
	);
	const playerTargets = groupByKey(
		char.targets,
		(target) => target.id,
	);

	return Object.values(Object.assign({}, defaultTargets, playerTargets));
};

export const defaultTarget = (char: Character) => {
	return targets(char)[0] ?? createOptimizationPlan("unnamed");
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
