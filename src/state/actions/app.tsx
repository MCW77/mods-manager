// state
import type { IAppState } from "../storage";

export namespace actions {
	export function resetState() {
		return {
			type: actionNames.RESET_STATE,
		} as const;
	}

	export function setState(state: IAppState) {
		return {
			type: actionNames.SET_STATE,
			state: state,
		} as const;
	}
}

export namespace actionNames {
	export const RESET_STATE = "RESET_STATE" as const;
	export const SET_STATE = "SET_STATE" as const;
}
