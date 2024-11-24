// domain
import type { CharacterFilterPredicate } from "./CharacterFilterById";
import type { CharacterFilterSetup } from "./CharacterFilterSetup";

interface CharactersManagementObservable {
	filterSetup: CharacterFilterSetup;
	activeCustomFilter: () => CharacterFilterPredicate;
	addTextFilter: () => void;
}

export type { CharactersManagementObservable };
