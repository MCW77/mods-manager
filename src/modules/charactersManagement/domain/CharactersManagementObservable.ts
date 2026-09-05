// state
import type { Observable } from "@legendapp/state";

// domain
import type { Character } from "#/domain/Character";
import type { NonCalculatedCharacterSummaryStat } from "#/domain/CharacterSummaryStat";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { Stat } from "#/domain/Stat";
import type { CharacterFilterPredicate } from "./CharacterFilterById";
import type { CharacterFilterSetup } from "./CharacterFilterSetup";

interface CharactersManagementObservable {
	persistedData: {
		filterSetup: CharacterFilterSetup;
		id: "filterSetup";
	};
	filterSetup: () => Observable<CharacterFilterSetup>;
	activeCustomFilter: () => CharacterFilterPredicate;
	addTextFilter: () => void;
	getFlatValuesForCharacter: (
		character: Character,
		stat: Stat,
	) => NonCalculatedCharacterSummaryStat[];
	getOptimizationValue: (
		character: Character,
		target: OptimizationPlan,
		stat: NonCalculatedCharacterSummaryStat,
	) => number;
}

export type { CharactersManagementObservable };
