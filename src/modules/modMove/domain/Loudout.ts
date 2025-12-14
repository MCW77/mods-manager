// domain
import type { CharacterNames } from "#/constants/CharacterNames";

interface CharacterDefinition {
	id: CharacterNames;
	modIds: string[];
	target: string;
}
export type CharacterDefinitions = CharacterDefinition[];

export interface Loadout {
	units: CharacterDefinitions;
}
