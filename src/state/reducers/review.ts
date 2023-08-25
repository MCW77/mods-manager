// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/review";

export namespace reducers {
	export function changeOptimizerView(
		state: IAppState,
		action: ReturnType<typeof actions.changeOptimizerView>,
	): IAppState {
		return Object.assign({}, state, {
			optimizerView: action.view,
		});
	}

	export function changeModListFilter(
		state: IAppState,
		action: ReturnType<typeof actions.changeModListFilter>,
	): IAppState {
		return Object.assign({}, state, {
			modListFilter: action.filter,
		});
	}
}

export namespace selectors {
	export const selectModListFilter = (state: IAppState) => state.modListFilter;
	export const selectOptimizerView = (state: IAppState) => state.optimizerView;
}
