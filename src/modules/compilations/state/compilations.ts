// state
debugger;
import {
	beginBatch,
	endBatch,
	type Observable,
	observable,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { templates$ } = await import("#/modules/templates/state/templates");

// domain
import { getDefaultCompilation, type Compilation } from "../domain/Compilation";
import {
	type CharacterNames,
	characterSettings,
} from "#/constants/characterSettings";
import {
	fromShortOptimizationPlan,
	type OptimizationPlan,
} from "#/domain/OptimizationPlan";

const getinitialCompilations = () => {
	const result = new Map<string, Map<string, Compilation>>();
	return result;
};

const isCompilation = (
	compilation$: Observable<Compilation> | Observable<Compilation | undefined>,
): compilation$ is Observable<Compilation> => {
	return compilation$.peek() !== undefined;
};

const compilations$ = observable({
	activeCompilationId: "DefaultCompilation",
	defaultCompilation: getDefaultCompilation(),
	compilationByIdByAllycode: getinitialCompilations(),
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
			hasSelectionChanged: false,
			id,
			lastOptimized: null,
			optimizationConditions: null,
			selectedCharacters: [],
		});
	},
	deleteCompilation: (id: string) => {
		if (!compilations$.compilationByIdForActiveAllycode.peek().has(id)) return;
		if (id === "DefaultCompilation") return;
		compilations$.compilationByIdForActiveAllycode.delete(id);
	},
	selectCharacter: (
		characterID: CharacterNames,
		target: OptimizationPlan,
		prevIndex: number | null = null,
	) => {
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
		const selectedCharacter = { id: characterID, target: target };
		if (null === prevIndex) {
			compilations$.defaultCompilation.selectedCharacters.unshift(
				selectedCharacter,
			);
		} else {
			compilations$.defaultCompilation.selectedCharacters.splice(
				prevIndex + 1,
				0,
				selectedCharacter,
			);
		}
	},
	unselectCharacter: (characterIndex: number) => {
		if (
			characterIndex >=
			compilations$.defaultCompilation.selectedCharacters.length
		)
			return;
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
		compilations$.defaultCompilation.selectedCharacters.splice(
			characterIndex,
			1,
		);
	},
	unselectAllCharacters: () => {
		compilations$.defaultCompilation.selectedCharacters.set([]);
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
	},
	moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => {
		if (fromIndex === toIndex) return;
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
		const selectedCharacters =
			compilations$.defaultCompilation.selectedCharacters.peek();
		const [selectedCharacter] =
			compilations$.defaultCompilation.selectedCharacters.splice(fromIndex, 1);
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
			compilations$.defaultCompilation.hasSelectionChanged.set(true);
			profilesManagement$.activeProfile.characterById[
				characterId
			].targets.splice(targetIndex, 1);
			const selectedCharacter =
				compilations$.defaultCompilation.selectedCharacters.find(
					(selectedCharacter) => selectedCharacter.peek().id === characterId,
				);
			selectedCharacter?.target.set(characterSettings[characterId].targets[0]);
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
			.find((selectedCharacter) => selectedCharacter.peek().id === characterId)
			?.target.set(newTarget);
	},
	changeTarget: (index: number, target: OptimizationPlan) => {
		if (index >= compilations$.defaultCompilation.selectedCharacters.length)
			return;
		compilations$.defaultCompilation.selectedCharacters[index].target.set(
			target,
		);
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
	},
	appendTemplate: (templateName: string) => {
		const template = templates$.allTemplates
			.get()
			.find(({ id }) => id === templateName);
		if (template === undefined) return [];

		const splitSelectedCharacters = Object.groupBy(
			template.selectedCharacters,
			(selectedCharacter) =>
				Object.keys(
					profilesManagement$.activeProfile.characterById.peek(),
				).includes(selectedCharacter.id)
					? "existing"
					: "missing",
		);

		if (splitSelectedCharacters.existing === undefined) return [];
		compilations$.defaultCompilation.hasSelectionChanged.set(true);

		for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
			const target = structuredClone(selectedCharacterInTemplate.target);
			const selectedCharacter =
				compilations$.defaultCompilation.selectedCharacters.find(
					(selectedCharacter) =>
						selectedCharacter.peek().id === selectedCharacterInTemplate.id,
				);
			if (selectedCharacter === undefined) {
				compilations$.selectCharacter(
					selectedCharacterInTemplate.id,
					target,
					compilations$.defaultCompilation.selectedCharacters.length - 1,
				);
			} else {
				selectedCharacter.target.set(selectedCharacterInTemplate.target);
			}
			const character =
				profilesManagement$.activeProfile.characterById[
					selectedCharacterInTemplate.id
				];
			if (character === undefined) continue;
			const characterTarget = character.targets.find(
				(t) => t.peek().id === selectedCharacterInTemplate.target.id,
			);
			if (characterTarget === undefined) {
				const builtinTarget = characterSettings[
					selectedCharacterInTemplate.id
				].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
				if (builtinTarget !== undefined) continue;
				character.targets.push(target);
			} else {
				characterTarget.set(target);
			}
		}
		if (splitSelectedCharacters.missing?.length) {
			return splitSelectedCharacters.missing;
		}
		return [];
	},
	replaceWithTemplate: (templateName: string) => {
		const template = templates$.allTemplates
			.get()
			.find(({ id }) => id === templateName);
		if (template === undefined) return [];

		const splitSelectedCharacters = Object.groupBy(
			template.selectedCharacters,
			(selectedCharacter) =>
				Object.keys(
					profilesManagement$.activeProfile.characterById.peek(),
				).includes(selectedCharacter.id)
					? "existing"
					: "missing",
		);
		compilations$.defaultCompilation.selectedCharacters.set(
			splitSelectedCharacters.existing?.slice() ?? [],
		);
		compilations$.defaultCompilation.hasSelectionChanged.set(true);

		if (splitSelectedCharacters.existing === undefined) return [];
		for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
			const target = structuredClone(selectedCharacterInTemplate.target);
			const character =
				profilesManagement$.activeProfile.characterById[
					selectedCharacterInTemplate.id
				];
			if (character === undefined) continue;
			const characterTarget = character.targets.find(
				(t) => t.peek().id === selectedCharacterInTemplate.target.id,
			);
			if (characterTarget === undefined) {
				const builtinTarget = characterSettings[
					selectedCharacterInTemplate.id
				].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
				if (builtinTarget !== undefined) continue;
				character.targets.push(target);
			} else {
				characterTarget.set(target);
			}
		}
		if (splitSelectedCharacters.missing?.length) {
			return splitSelectedCharacters.missing;
		}
		return [];
	},
	applyTemplateTargets: (templateName: string) => {
		const template = templates$.allTemplates
			.get()
			.find(({ id }) => id === templateName);
		if (template === undefined) return [];

		const splitSelectedCharacters = Object.groupBy(
			template.selectedCharacters,
			(templateSelectedCharacter) =>
				compilations$.defaultCompilation.selectedCharacters
					.peek()
					.some(
						(selectedCharacter) =>
							selectedCharacter.id === templateSelectedCharacter.id,
					)
					? "existing"
					: "missing",
		);

		if (splitSelectedCharacters.existing === undefined) return [];
		for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
			const target = structuredClone(selectedCharacterInTemplate.target);
			const selectedCharacter =
				compilations$.defaultCompilation.selectedCharacters.find(
					(selectedCharacter) =>
						selectedCharacter.peek().id === selectedCharacterInTemplate.id,
				);
			if (selectedCharacter === undefined) continue;
			selectedCharacter.target.set(selectedCharacterInTemplate.target);
			compilations$.defaultCompilation.hasSelectionChanged.set(true);
		}

		if (splitSelectedCharacters.missing?.length) {
			return splitSelectedCharacters.missing;
		}
		return [];
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
		compilations$.defaultCompilation.hasSelectionChanged.set(true);
	},
	ensureSelectedCharactersExist: (compilationId: string) => {
		const profile$ = profilesManagement$.activeProfile;
		const compilation$ =
			compilations$.compilationByIdByAllycode[profile$.allycode.peek()][
				compilationId
			];
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
		const compilationById$ = compilations$.compilationByIdByAllycode[allycode];
		for (const compilation of compilationById$.values()) {
			compilationById$[compilation.id].optimizationConditions.set(null);
		}
	},
});

const syncStatus$ = syncObservable(
	compilations$.compilationByIdByAllycode,
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
	compilations$.defaultCompilation,
	persistOptions({
		persist: {
			name: "DefaultCompilation",
			indexedDB: {
				itemID: "DefaultCompilation",
			},
		},
		initial: getDefaultCompilation(),
	}),
);
await when(syncStatus2$.isPersistLoaded);

export { compilations$ };
