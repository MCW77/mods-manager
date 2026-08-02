import type { FlatCharacterModdings } from "#/modules/compilations/domain/CharacterModdings";
import type { OptimizationConditions } from "#/modules/compilations/domain/OptimizationConditions";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

const getDefaultCompilation = () => {
	return structuredClone({
		id: "defaultCompilation",
		defaultCompilation: {
			category: "",
			description: "",
			flatCharacterModdings: [] as FlatCharacterModdings,
			id: "DefaultCompilation",
			isReoptimizationNeeded: true,
			lastOptimized: null as Date | null,
			optimizationConditions: null as OptimizationConditions,
			reoptimizationIndex: 0,
			selectedCharacters: [] as SelectedCharacters,
		},
	} as const);
};

export { getDefaultCompilation };
