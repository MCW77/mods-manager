// state
import type { Observable } from "@legendapp/state";

// domain
import type { Compilation } from "./Compilation";

interface CompilationsObservable {
	persistedData: {
		id: "compilationByIdByAllycode";
		compilationByIdByAllycode: Map<string, Map<string, Compilation>>;
	};
	activeCompilationId: string;
	compilationByIdByAllycode: () => Observable<
		Map<string, Map<string, Compilation>>
	>;
	compilationByIdForActiveAllycode: () => Observable<Map<string, Compilation>>;
	activeCompilation: () => Observable<Compilation>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	addCompilation: (id: string, description: string, category: string) => void;
	deleteCompilation: (id: string) => void;
	ensureSelectedCharactersExist: (compilationId: string) => void;
	resetOptimizationConditions: (allycode: string) => void;
	reset: () => void;
}

export type { CompilationsObservable };
