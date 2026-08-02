// state
import {
	type Observable,
	observable,
	type ObservableObject,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { defaultCompilation$ } from "#/modules/defaultCompilation/state/defaultCompilation";
import { roster$ } from "#/modules/roster/state/roster";

// domain
import type { Compilation } from "../domain/Compilation";
import type { CompilationsObservable } from "../domain/CompilationsObservable";

const getinitialCompilations = () => {
	const compilations = new Map<string, Map<string, Compilation>>();
	return {
		id: "compilationByIdByAllycode",
		compilationByIdByAllycode: compilations,
	} as const;
};

const isCompilation = (
	compilation$: Observable<Compilation> | Observable<Compilation | undefined>,
): compilation$ is Observable<Compilation> => {
	return compilation$.peek() !== undefined;
};

const compilations$: ObservableObject<CompilationsObservable> =
	observable<CompilationsObservable>({
		activeCompilationId: "DefaultCompilation",
		persistedData: getinitialCompilations(),
		compilationByIdByAllycode: () =>
			compilations$.persistedData.compilationByIdByAllycode,
		compilationByIdForActiveAllycode: () => {
			const allycode = profilesManagement$.activeAllycode.get();
			return compilations$.compilationByIdByAllycode.get(allycode);
		},
		activeCompilation: () => {
			const compilation$ =
				compilations$.compilationByIdForActiveAllycode[
					compilations$.activeCompilationId.get()
				];
			if (isCompilation(compilation$)) return compilation$;
			return defaultCompilation$.data;
		},
		addProfile: (allycode: string) => {
			if (!compilations$.compilationByIdByAllycode.has(allycode)) {
				compilations$.compilationByIdByAllycode.set(
					allycode,
					new Map<string, Compilation>(),
				);
			}
		},
		deleteProfile: (allycode: string) => {
			if (!compilations$.compilationByIdByAllycode.has(allycode)) return;
			compilations$.compilationByIdByAllycode.delete(allycode);
		},
		addCompilation: (id: string, description: string, category: string) => {
			if (compilations$.compilationByIdForActiveAllycode.peek().has(id)) return;
			compilations$.compilationByIdForActiveAllycode.set(id, {
				category,
				description,
				flatCharacterModdings: [],
				id,
				isReoptimizationNeeded: true,
				lastOptimized: null,
				optimizationConditions: null,
				reoptimizationIndex: -1,
				selectedCharacters: [],
			});
		},
		deleteCompilation: (id: string) => {
			if (!compilations$.compilationByIdForActiveAllycode.peek().has(id))
				return;
			if (id === "DefaultCompilation") return;
			compilations$.compilationByIdForActiveAllycode.delete(id);
		},
		ensureSelectedCharactersExist: (compilationId: string) => {
			const compilation$ =
				compilationId === "DefaultCompilation"
					? defaultCompilation$.data
					: compilations$.compilationByIdForActiveAllycode[compilationId];

			const compilation = compilation$.peek();
			if (compilation === undefined) return;
			for (const [
				index,
				selectedCharacter,
			] of compilation.selectedCharacters.entries()) {
				if (
					roster$.activeCharacterById[selectedCharacter.id].peek() === undefined
				) {
					compilation$.selectedCharacters.splice(index, 1);
				}
			}
		},
		resetOptimizationConditions: (allycode: string) => {
			defaultCompilation$.data.optimizationConditions.set(null);
			const compilationById$ =
				compilations$.compilationByIdByAllycode[allycode];
			if (compilationById$.peek() === undefined) return;
			for (const compilation of compilationById$.values()) {
				compilationById$[compilation.id].optimizationConditions.set(null);
			}
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	compilations$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		compilations$.compilationByIdByAllycode.clear();
		return;
	}
	compilations$.deleteProfile(value);
});

profilesManagement$.profiles.activeAllycode.onChange(() => {
	compilations$.ensureSelectedCharactersExist(
		compilations$.activeCompilationId.get(),
	);
});

const syncStatus$ = syncObservable(
	compilations$.persistedData,
	persistOptions({
		persist: {
			name: "Compilations",
			indexedDB: {
				itemID: "compilationByIdByAllycode",
			},
		},
		initial: getinitialCompilations(),
	}),
);

export { compilations$, syncStatus$ };
