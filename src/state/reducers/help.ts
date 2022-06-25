// state
import { IAppState } from "../storage";

// actions
import * as HelpActions from "../actions/help";


export function setHelpPosition(state: IAppState, action: ReturnType<typeof HelpActions.setHelpPosition>): IAppState {
  return Object.assign({}, state, {
    help: {
      section: action.section,
      topic: action.topic,
    },
    previousSection: state.section,
    section: 'help',
  });
}

export const selectHelpPosition = (state: IAppState) => state.help;