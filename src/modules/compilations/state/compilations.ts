// state
import {
	beginBatch,
	endBatch,
	type Observable,
	observable,
	type ObservableObject,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

// domain
import { getDefaultCompilation, type Compilation } from "../domain/Compilation";
import type { CharacterNames } from "#/constants/CharacterNames";
import { characterSettings } from "#/constants/characterSettings";
import {
	fromShortOptimizationPlan,
	type OptimizationPlan,
} from "#/domain/OptimizationPlan";
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
		persistedData1: getinitialCompilations(),
		persistedData2: getDefaultCompilation(),
		defaultCompilation: () => compilations$.persistedData2.defaultCompilation,
		compilationByIdByAllycode: () =>
			compilations$.persistedData1.compilationByIdByAllycode,
		compilationByIdForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			return (
				compilations$.compilationByIdByAllycode.get(allycode) ??
				new Map<string, Compilation>()
			);
		},
		activeCompilation: () => {
			const compilation$ =
				compilations$.compilationByIdForActiveAllycode[
					compilations$.activeCompilationId.get()
				];
			if (isCompilation(compilation$)) return compilation$;
			return compilations$.defaultCompilation;
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
		selectCharacter: (
			characterID: CharacterNames,
			target: OptimizationPlan,
			prevIndex: number | null = null,
		) => {
			const selectedCharacter = { id: characterID, target: target };
			if (
				compilations$.defaultCompilation.selectedCharacters.some(
					(sc) => sc.peek().id === characterID,
				)
			)
				return;
			if (null === prevIndex) {
				compilations$.defaultCompilation.selectedCharacters.unshift(
					selectedCharacter,
				);
				compilations$.defaultCompilation.reoptimizationIndex.set(-1);
			} else {
				compilations$.defaultCompilation.selectedCharacters.splice(
					prevIndex + 1,
					0,
					selectedCharacter,
				);
				compilations$.defaultCompilation.reoptimizationIndex.set(
					Math.min(
						prevIndex,
						compilations$.defaultCompilation.reoptimizationIndex.peek(),
					),
				);
			}
		},
		unselectCharacter: (characterIndex: number) => {
			if (
				characterIndex >=
				compilations$.defaultCompilation.selectedCharacters.length
			)
				return;
			compilations$.defaultCompilation.reoptimizationIndex.set(
				Math.min(
					characterIndex - 1,
					compilations$.defaultCompilation.reoptimizationIndex.peek(),
				),
			);
			compilations$.defaultCompilation.selectedCharacters.splice(
				characterIndex,
				1,
			);
		},
		unselectAllCharacters: () => {
			compilations$.defaultCompilation.selectedCharacters.set([]);
			compilations$.defaultCompilation.reoptimizationIndex.set(-1);
		},
		moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => {
			if (fromIndex === toIndex) return;
			compilations$.defaultCompilation.reoptimizationIndex.set(
				Math.min(
					fromIndex - 1,
					(toIndex ?? fromIndex) - 1,
					compilations$.defaultCompilation.reoptimizationIndex.peek(),
				),
			);
			/*
			const selectedCharacters =
				compilations$.defaultCompilation.selectedCharacters.peek();
*/
			const [selectedCharacter] =
				compilations$.defaultCompilation.selectedCharacters.splice(
					fromIndex,
					1,
				);
			if (null === toIndex) {
				compilations$.defaultCompilation.selectedCharacters.unshift(
					selectedCharacter,
				);
				return;
			}
			if (fromIndex < toIndex) {
				compilations$.defaultCompilation.selectedCharacters.splice(
					toIndex,
					0,
					selectedCharacter,
				);
				return;
			}
			compilations$.defaultCompilation.selectedCharacters.splice(
				toIndex + 1,
				0,
				selectedCharacter,
			);
		},
		deleteTarget: (characterId: CharacterNames, targetName: string) => {
			const targetIndex = profilesManagement$.activeProfile.characterById[
				characterId
			].targets
				.peek()
				.findIndex((target) => target.id === targetName);
			if (targetIndex >= 0) {
				beginBatch();
				compilations$.defaultCompilation.reoptimizationIndex.set(
					Math.min(
						targetIndex - 1,
						compilations$.defaultCompilation.reoptimizationIndex.peek(),
					),
				);
				profilesManagement$.activeProfile.characterById[
					characterId
				].targets.splice(targetIndex, 1);
				const selectedCharacter =
					compilations$.defaultCompilation.selectedCharacters.find(
						(selectedCharacter) => selectedCharacter.peek().id === characterId,
					);
				selectedCharacter?.target.set(
					characterSettings[characterId].targets[0],
				);
				endBatch();
			}
		},
		saveTarget: (characterId: CharacterNames, newTarget: OptimizationPlan) => {
			const character =
				profilesManagement$.activeProfile.characterById[characterId];
			const characterTarget = character.targets.find(
				(t) => t.peek().id === newTarget.id,
			);
			if (characterTarget === undefined) {
				character.targets.push(newTarget);
			} else {
				characterTarget.set(newTarget);
			}
			compilations$.defaultCompilation.selectedCharacters
				.find(
					(selectedCharacter) => selectedCharacter.peek().id === characterId,
				)
				?.target.set(newTarget);
		},
		changeTarget: (index: number, target: OptimizationPlan) => {
			if (index >= compilations$.defaultCompilation.selectedCharacters.length)
				return;
			compilations$.defaultCompilation.selectedCharacters[index].target.set(
				target,
			);
			compilations$.defaultCompilation.reoptimizationIndex.set(
				Math.min(
					index - 1,
					compilations$.defaultCompilation.reoptimizationIndex.peek(),
				),
			);
		},
		applyRanking: (ranking: CharacterNames[]) => {
			const selectedCharacters =
				compilations$.defaultCompilation.selectedCharacters.peek();
			const rankingForSelected = ranking.filter((characterId) =>
				selectedCharacters.some(
					(selectedCharacter) => selectedCharacter.id === characterId,
				),
			);
			const newSelectedCharacters = rankingForSelected.map((characterId) => {
				const selectedCharacter = selectedCharacters.find(
					(selectedCharacter) => selectedCharacter.id === characterId,
				);
				return (
					selectedCharacter ?? {
						id: characterId,
						target: fromShortOptimizationPlan({ id: "none" }),
					}
				);
			});
			compilations$.defaultCompilation.selectedCharacters.set(
				newSelectedCharacters,
			);
			compilations$.defaultCompilation.reoptimizationIndex.set(-1);
		},
		ensureSelectedCharactersExist: (compilationId: string) => {
			const profile$ = profilesManagement$.activeProfile;
			const compilation$ =
				compilationId === "DefaultCompilation"
					? compilations$.defaultCompilation
					: compilations$.compilationByIdForActiveAllycode[compilationId];
			/*
				compilations$.compilationByIdByAllycode[profile$.allycode.peek()][
					compilationId
				];
*/
			const compilation = compilation$.peek();
			if (compilation === undefined) return;
			for (const [
				index,
				selectedCharacter,
			] of compilation.selectedCharacters.entries()) {
				if (profile$.characterById[selectedCharacter.id].peek() === undefined) {
					compilation$.selectedCharacters.splice(index, 1);
				}
			}
		},
		resetOptimizationConditions: (allycode: string) => {
			compilations$.defaultCompilation.optimizationConditions.set(null);
			const compilationById$ =
				compilations$.compilationByIdByAllycode[allycode];
			if (compilationById$.peek() === undefined) return;
			for (const compilation of compilationById$.values()) {
				compilationById$[compilation.id].optimizationConditions.set(null);
			}
		},
		reset: () => {
			syncStatus$.reset();
			syncStatus2$.reset();
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
	compilations$.persistedData1,
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
await when(syncStatus$.isPersistLoaded);

const syncStatus2$ = syncObservable(
	compilations$.persistedData2,
	persistOptions({
		persist: {
			name: "DefaultCompilation",
			indexedDB: {
				itemID: "defaultCompilation",
			},
		},
		initial: getDefaultCompilation(),
	}),
);
await when(syncStatus2$.isPersistLoaded);

export { compilations$ };
