import type * as Character from "./Character";

interface OptimizationStatus {
	character: Character.Character | null;
	progress: number;
	step: string;
}

export type { OptimizationStatus };
