// state
import { IAppState } from "../storage";

// actions
import * as ExploreActions from "../actions/explore";


export function changeModsViewOptions(state: IAppState, action: ReturnType<typeof ExploreActions.changeModsViewOptions>): IAppState {
  return Object.assign({}, state, {
    modsViewOptions: action.options
  });
}

export const selectModsViewOptions = (state: IAppState) => state.modsViewOptions;