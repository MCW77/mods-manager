export namespace actions {
	export function startModOptimization() {
		return {
			type: actionNames.OPTIMIZE_MODS,
		} as const;
	}
}

export namespace actionNames {
	export const OPTIMIZE_MODS = "OPTIMIZE_MODS" as const;
}
