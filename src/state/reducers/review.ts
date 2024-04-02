// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/review";

export namespace reducers {
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
}
