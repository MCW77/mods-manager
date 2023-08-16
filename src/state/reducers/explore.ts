// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/explore";

export namespace reducers {
	export function changeModsViewOptions(
		state: IAppState,
		action: ReturnType<typeof actions.changeModsViewOptions>,
	): IAppState {
		return Object.assign({}, state, {
			modsViewOptions: action.options,
		});
	}
}

export namespace selectors {
	export const selectModsViewOptions = (state: IAppState) =>
		state.modsViewOptions;
}
