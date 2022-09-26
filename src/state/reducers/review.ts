// state
import { IAppState } from "../storage";

// actions
import * as ReviewActions from "../actions/review";

export function changeOptimizerView(state: IAppState, action: ReturnType<typeof ReviewActions.changeOptimizerView>): IAppState {
  return Object.assign({}, state, {
    optimizerView: action.view
  });
}

export function changeModListFilter(state: IAppState, action: ReturnType<typeof ReviewActions.changeModListFilter>): IAppState {
  return Object.assign({}, state, {
    modListFilter: action.filter
  });
}

export const selectModListFilter = (state: IAppState) => state.modListFilter;
export const selectOptimizerView = (state: IAppState) => state.optimizerView;
