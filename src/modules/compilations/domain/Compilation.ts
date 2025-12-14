import type { FlatCharacterModdings } from "./CharacterModdings";
import type { OptimizationConditions } from "./OptimizationConditions";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

export interface Compilation {
	category: string;
	description: string;
	flatCharacterModdings: FlatCharacterModdings;
	id: string;
	isReoptimizationNeeded: boolean;
	lastOptimized: Date | null;
	optimizationConditions: OptimizationConditions;
	reoptimizationIndex: number;
	selectedCharacters: SelectedCharacters;
}

export const getDefaultCompilation = () => {
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
