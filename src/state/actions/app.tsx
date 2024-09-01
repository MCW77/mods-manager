export namespace actions {
	export function resetState() {
		return {
			type: actionNames.RESET_STATE,
		} as const;
	}
}

export namespace actionNames {
	export const RESET_STATE = "RESET_STATE" as const;
}
