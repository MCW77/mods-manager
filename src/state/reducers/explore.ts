// state
import { IAppState } from "../storage";

// actions
import * as Actions from "../actions/explore";


export function changeModsViewOptions(state: IAppState, action: ReturnType<typeof Actions.changeModsViewOptions>): IAppState {
  return Object.assign({}, state, {
    modsViewOptions: action.options
  });
}

export const selectModsViewOptions = (state: IAppState) => state.modsViewOptions;