import type * as Character from "#/domain/Character";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";
import type { ModSuggestion } from "#/domain/PlayerProfile";

export interface PlayerProfile {
	allycode: string;
	playerName: string;
	characterById: Character.CharacterById;
	selectedCharacters: SelectedCharacters;
	modAssignments: ModSuggestion[];
}

export const createPlayerProfile = (
	allycode: string,
	playerName: string,
): PlayerProfile => {
	return {
		allycode,
		playerName,
		characterById: {} as Character.CharacterById,
		selectedCharacters: [],
		modAssignments: [],
	};
};
