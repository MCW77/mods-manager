// domain
import type { GIMOFlatMod } from "#/domain/types/ModTypes";
import type * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type { ModSuggestion } from "#/domain/PlayerProfile";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

export interface PlayerProfile {
	allycode: string;
	characterById: Character.CharacterById;
	mods: Mod[];
	modAssignments: ModSuggestion[];
	playerName: string;
	selectedCharacters: SelectedCharacters;
}

export interface PersistedPlayerProfile {
	allycode: string;
	characterById: Character.CharacterById;
	mods: GIMOFlatMod[];
	modAssignments: ModSuggestion[];
	playerName: string;
	selectedCharacters: SelectedCharacters;
}
export const createPlayerProfile = (
	allycode: string,
	playerName: string,
): PlayerProfile => {
	return {
		allycode,
		characterById: {} as Character.CharacterById,
		mods: [],
		modAssignments: [],
		playerName,
		selectedCharacters: [],
	};
};
