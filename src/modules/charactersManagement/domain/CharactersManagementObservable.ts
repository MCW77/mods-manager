// state
import type { Observable } from "@legendapp/state";

// domain
import type { Character } from "#/domain/Character.js";
import type { CharacterSummaryStat } from "#/domain/CharacterSummaryStat.js";
import type { OptimizationPlan } from "#/domain/OptimizationPlan.js";
import type { Stat } from "#/domain/Stat.js";
import type { CharacterFilterPredicate } from "./CharacterFilterById.js";
import type { CharacterFilterSetup } from "./CharacterFilterSetup.js";

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
	) => CharacterSummaryStat[];
	getOptimizationValue: (
		character: Character,
		target: OptimizationPlan,
		stat: Stat,
	) => number;
}

export type { CharactersManagementObservable };
