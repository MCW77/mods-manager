// domain
import type { OptimizationStatus } from "../../domain/OptimizationStatus";

export namespace actions {
	export function startModOptimization() {
		return {
			type: actionNames.OPTIMIZE_MODS,
		} as const;
	}

	export function updateProgress(progress: OptimizationStatus) {
		return {
			type: actionNames.UPDATE_PROGRESS,
			progress: progress,
		} as const;
	}
}

export namespace actionNames {
	export const OPTIMIZE_MODS = "OPTIMIZE_MODS" as const;
	export const UPDATE_PROGRESS = "UPDATE_PROGRESS" as const;
}
