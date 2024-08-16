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
	baseID: CharacterNames;
	playerValues: DTOs.GIMO.PlayerValuesDTO;
	targets: OptimizationPlan[];
}

export type CharactersById = Record<CharacterNames, Character>;

export const createCharacter = (
	baseID: CharacterNames,
	playerValues: DTOs.GIMO.PlayerValuesDTO,
	targets: OptimizationPlan[],
): Character => {
	return {
		baseID,
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
  const oldTargetsObject = groupByKey(char.targets, target => target.name);
  const newTargetsObject = groupByKey(targets, target => target.name);

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
  const targetIndex = newTargets.findIndex(target => target.name === targetName);
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
		characterSettings[char.baseID]?.targets ?? [],
		(target) => target.name,
	);
	const playerTargets = groupByKey(
		char.targets,
		(target) => target.name,
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
		return thisChar.baseID.localeCompare(thatChar.baseID);
	}
	return (
		thatChar.playerValues.galacticPower - thisChar.playerValues.galacticPower
	);
};
