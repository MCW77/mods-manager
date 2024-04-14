// state
import { AppState, IAppState } from "../storage";

// actions
import { actions } from "../actions/app";

export namespace reducers {
	export function changeSection(
		state: IAppState,
		action: ReturnType<typeof actions.changeSection>,
	): IAppState {
		return Object.assign({}, state, {
			section: action.section,
			previousSection: state.section,
		});
	}

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
	export const selectPreviousSection = (state: IAppState) =>
		state.previousSection;
	export const selectSection = (state: IAppState) => state.section;
	export const selectShowSidebar = (state: IAppState) => state.showSidebar;
	export const selectVersion = (state: IAppState) => state.version;
}
