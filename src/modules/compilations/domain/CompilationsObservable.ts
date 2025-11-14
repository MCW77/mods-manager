// state
import type { Observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames.js";
import type { OptimizationPlan } from "#/domain/OptimizationPlan.js";
import type { Compilation } from "./Compilation.js";

interface CompilationsObservable {
	persistedData1: {
		id: "compilationByIdByAllycode";
		compilationByIdByAllycode: Map<string, Map<string, Compilation>>;
	};
	persistedData2: {
		id: "defaultCompilation";
		defaultCompilation: Compilation;
	};
	activeCompilationId: string;
	defaultCompilation: () => Observable<Compilation>;
	compilationByIdByAllycode: () => Observable<
		Map<string, Map<string, Compilation>>
	>;
	compilationByIdForActiveAllycode: () => Observable<Map<string, Compilation>>;
	activeCompilation: () => Observable<Compilation>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	addCompilation: (id: string, description: string, category: string) => void;
	deleteCompilation: (id: string) => void;
	selectCharacter: (
		characterID: CharacterNames,
		target: OptimizationPlan,
		prevIndex: number | null,
	) => void;
	unselectCharacter: (characterIndex: number) => void;
	unselectAllCharacters: () => void;
	moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => void;
	deleteTarget: (characterId: CharacterNames, targetName: string) => void;
	saveTarget: (
		characterId: CharacterNames,
		newTarget: OptimizationPlan,
	) => void;
	changeTarget: (index: number, target: OptimizationPlan) => void;
	applyRanking: (ranking: CharacterNames[]) => void;
	ensureSelectedCharactersExist: (compilationId: string) => void;
	resetOptimizationConditions: (allycode: string) => void;
	reset: () => void;
}

export type { CompilationsObservable };
