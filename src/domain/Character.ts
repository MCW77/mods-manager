// utils
import groupByKey from "../utils/groupByKey";

// domain
import {
	characterSettings,
	type CharacterNames,
} from "../constants/characterSettings";
import type * as DTOs from "../modules/profilesManagement/dtos";

import { createOptimizationPlan } from "./OptimizationPlan";
import * as OptimizerSettings from "./OptimizerSettings";

export interface Character {
	baseID: CharacterNames;
	playerValues: DTOs.GIMO.PlayerValuesDTO;
	optimizerSettings: OptimizerSettings.OptimizerSettings;
}

export type CharactersById = Record<CharacterNames, Character>;

export const createCharacter = (
	baseID: CharacterNames,
	playerValues: DTOs.GIMO.PlayerValuesDTO,
	optimizerSettings: OptimizerSettings.OptimizerSettings,
): Character => {
	return {
		baseID,
		playerValues,
		optimizerSettings,
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

export const withOptimizerSettings = (
	char: Character,
	optimizerSettings: OptimizerSettings.OptimizerSettings,
): Character => {
	return {
		...char,
		optimizerSettings,
	};
};

export const withResetTarget = (
	char: Character,
	targetName: string,
): Character => {
	let target = characterSettings[char.baseID]?.targets.find(
		(target) => target.name === targetName,
	);
	if (target === null || target === undefined)
		target = createOptimizationPlan(targetName);

	return withOptimizerSettings(
		char,
		OptimizerSettings.withTarget(char.optimizerSettings, target),
	);
};

export const withResetTargets = (char: Character): Character => {
	return withOptimizerSettings(
		char,
		OptimizerSettings.withTargetOverrides(
			char.optimizerSettings,
			characterSettings[char.baseID]?.targets ?? [],
		),
	);
};

export const withDeletedTarget = (
	char: Character,
	targetName: string,
): Character => {
	return withOptimizerSettings(
		char,
		OptimizerSettings.withDeletedTarget(char.optimizerSettings, targetName),
	);
};

export const targets = (char: Character) => {
	const defaultTargets = groupByKey(
		characterSettings[char.baseID]?.targets ?? [],
		(target) => target.name,
	);
	const playerTargets = groupByKey(
		char.optimizerSettings.targets,
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
