// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/settings";

export namespace reducers {
	export function setSettingsPosition(
		state: IAppState,
		action: ReturnType<typeof actions.setSettingsPosition>,
	): IAppState {
		return Object.assign({}, state, {
			settings: {
				section: action.section,
				topic: action.topic,
			},
			previousSection: state.section,
			section: "settings",
		});
	}
}

export namespace selectors {
	export const selectSettingsPosition = (state: IAppState) => state.settings;
}
