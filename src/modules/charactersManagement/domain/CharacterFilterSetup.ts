import type {
	TextFilter,
	CharacterFilterById,
	CustomFilterById,
} from "./CharacterFilterById.js";

export interface CharacterFilterSetup {
	customFilterById: CustomFilterById;
	customFilterId: string;
	filtersById: CharacterFilterById;
	hideSelectedCharacters: boolean;
	permanentFilterById: CustomFilterById;
	quickFilter: TextFilter;
	gearLevelRange: [number, number];
	levelRange: [number, number];
	starsRange: [number, number];
}
