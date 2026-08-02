// state
import type { Observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { Compilation } from "#/modules/compilations/domain/Compilation";

interface DefaultCompilationObservable {
	persistedData: {
		id: "defaultCompilation";
		defaultCompilation: Compilation;
	};
	data: () => Observable<Compilation>;
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
	reset: () => void;
	ensurePilot6DotRequirements: () => void;
}

export type { DefaultCompilationObservable };
