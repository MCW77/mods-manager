import type * as Character from "#/domain/Character";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";
import type { ModSuggestion } from "#/domain/PlayerProfile";

export interface PlayerProfile {
	allycode: string;
	playerName: string;
	charactersById: Character.CharactersById;
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
		charactersById: {} as Character.CharactersById,
		selectedCharacters: [],
		modAssignments: [],
	};
};
