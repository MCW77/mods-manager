import type { FlatCharacterModdings } from "./CharacterModdings";
import type { OptimizationConditions } from "./OptimizationConditions";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

export interface Compilation {
	category: string;
	description: string;
	flatCharacterModdings: FlatCharacterModdings;
	hasSelectionChanged: boolean;
	id: string;
	lastOptimized: Date | null;
	optimizationConditions: OptimizationConditions;
	selectedCharacters: SelectedCharacters;
}

export const getDefaultCompilation = (): Compilation => {
	return {
		category: "",
		description: "Default compilation used until saved under own name",
		flatCharacterModdings: [],
		hasSelectionChanged: false,
		id: "DefaultCompilation",
		lastOptimized: null,
		optimizationConditions: null,
		selectedCharacters: [],
	};
}