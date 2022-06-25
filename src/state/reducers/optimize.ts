// react
import { AnyAction } from "redux";

// state
import { IAppState } from "../storage";


export function optimizeMods(state: IAppState): IAppState {
  return Object.assign({}, state, {
    isBusy: true,
  });
}

export function updateProgress(state: IAppState, action: AnyAction): IAppState {
  return Object.assign({}, state, {
    progress: action.progress,
  });
}

export function cancelOptimizeMods(state: IAppState): IAppState {
  return Object.assign({}, state, {
    isBusy: false,
    flashMessage: null,
    modal: null,
  });
}


export const selectProgress = (state: IAppState) => state.progress;