// react
import type { AnyAction } from "redux";

// state
import type { IAppState } from "../storage";

export namespace reducers {
	export function updateProgress(
		state: IAppState,
		action: AnyAction,
	): IAppState {
		return Object.assign({}, state, {
			progress: action.progress,
		});
	}
}

export namespace selectors {
	export const selectProgress = (state: IAppState) => state.progress;
}
