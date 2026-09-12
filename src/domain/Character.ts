// utils
import groupByKey from "../utils/groupByKey";

// domain
import type { CharacterNames } from "../constants/CharacterNames";

import type { CharacterSettingsIndexer } from "./CharacterSettings";
import {
	createOptimizationPlan,
	type OptimizationPlan,
} from "./OptimizationPlan";
import type { PlayerValues } from "./PlayerValues";

export interface Character {
	id: CharacterNames;
	omis: string[];
	playerValues: PlayerValues;
	targets: OptimizationPlan[];
	zetas: string[];
}

export type CharacterById = Record<CharacterNames, Character>;

export const createCharacter = (
	id: CharacterNames,
	playerValues: PlayerValues,
	targets: OptimizationPlan[],
	omis: string[],
	zetas: string[],
): Character => {
	return {
		id,
		omis,
		playerValues,
		targets,
		zetas,
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
	const targets: OptimizationPlan[] = [...Object.values(defaultTargets)];
	for (const playerTarget of Object.values(playerTargets)) {
		if (playerTarget.id !== "Default") {
			targets.push(playerTarget);
		}
	}
	return targets;

	//	return Object.values(Object.assign({}, defaultTargets, playerTargets));
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
