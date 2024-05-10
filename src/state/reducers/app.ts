// state
import { AppState, type IAppState } from "../storage";

// actions
import type { actions } from "../actions/app";

export namespace reducers {
	export function resetState() {
		return Object.assign({}, AppState.Default);
	}

	export function setState(
		action: ReturnType<typeof actions.setState>,
	): IAppState {
		return Object.assign({}, action.state);
	}

	export function toggleSidebar(state: IAppState): IAppState {
		return Object.assign({}, state, {
			showSidebar: !state.showSidebar,
		});
	}
}

export namespace selectors {
	export const selectShowSidebar = (state: IAppState) => state.showSidebar;
}
