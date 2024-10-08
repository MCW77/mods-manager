// react
import type * as Redux from "redux";
import type { ThunkAction, ThunkDispatch as TD } from "redux-thunk";

// state
import { type IAppState, defaultAppState } from "../storage";

// #region modules
import { App } from "../modules/app";
import type { Optimize } from "../modules/optimize";
import { Storage } from "../modules/storage";
// #endregion

export type ThunkResult<R> = ThunkAction<R, IAppState, null, AppActions>;
export type AppThunk = ThunkAction<void, IAppState, null, AppActions>;
export type ThunkDispatch = TD<IAppState, null, AppActions>;
export type ThunkDispatchNoParam = TD<IAppState, void, AppActions>;

// #region AppActions
type AppActions =
	| ReturnType<typeof App.actions.resetState>
	| ReturnType<typeof Optimize.actions.startModOptimization>
	| ReturnType<typeof Storage.actions.setProfile>;
// #endregion

type RootReducer = Redux.Reducer<IAppState, AppActions>;

const modsOptimizer: RootReducer = (
	state: IAppState | undefined,
	action: AppActions,
): IAppState => {
	if (!state) {
		return structuredClone(defaultAppState);
	}

	switch (action.type) {
		case App.actionNames.RESET_STATE: {
			const result = App.reducers.resetState();
			window.location.reload();
			return result;
		}

		case Storage.actionNames.SET_PROFILE:
			return Storage.reducers.setProfile(state, action);

		default:
			return state;
	}
};

export default modsOptimizer;
