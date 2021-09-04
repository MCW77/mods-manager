import { IAppState } from "state/storage";
import * as Actions from "../actions/explore";

export function changeModsFilter(state: IAppState, action: ReturnType<typeof Actions.changeModsFilter>): IAppState {
  return Object.assign({}, state, {
    modsFilter: action.filter
  });
}
