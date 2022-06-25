// state
import { IAppState } from "../storage";

// actions
import * as SettingsActions from "../actions/settings";


export function setSettingsPosition(state: IAppState, action: ReturnType<typeof SettingsActions.setSettingsPosition>): IAppState {
  return Object.assign({}, state, {
    settings: {
      section: action.section,
      topic: action.topic,
    },
    previousSection: state.section,
    section: 'settings',
  });
}

export const selectSettingsPosition = (state: IAppState) => state.settings;