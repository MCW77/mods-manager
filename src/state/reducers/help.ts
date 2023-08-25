// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/help";

export namespace reducers {
	export function setHelpPosition(
		state: IAppState,
		action: ReturnType<typeof actions.setHelpPosition>,
	): IAppState {
		return Object.assign({}, state, {
			help: {
				section: action.section,
				topic: action.topic,
			},
			previousSection: state.section,
			section: "help",
		});
	}
}

export namespace selectors {
	export const selectHelpPosition = (state: IAppState) => state.help;
}
