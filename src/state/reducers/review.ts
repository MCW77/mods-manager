import * as ReviewActions from "state/actions/review";
import { IAppState } from "state/storage";

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
