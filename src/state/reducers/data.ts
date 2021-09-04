import { IAppState } from "state/storage";

export function toggleKeepOldMods(state: IAppState): IAppState {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}
