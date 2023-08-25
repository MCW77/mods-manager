export namespace actions {
	export function setHelpPosition(section: string, topic: number) {
		return {
			type: actionNames.SET_HELP_POSITION,
			section,
			topic,
		} as const;
	}
}

export namespace actionNames {
	export const SET_HELP_POSITION = "SET_HELP_POSITION" as const;
}
