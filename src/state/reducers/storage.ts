// state
import type { IAppState } from "../storage";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// actions
import type { actions } from "../actions/storage";

export namespace reducers {
	export function setProfile(
		state: IAppState,
		action: ReturnType<typeof actions.setProfile>,
	): IAppState {
		if (action.profile)
			profilesManagement$.profiles.activeAllycode.set(action.profile.allycode);
		return Object.assign({}, state, {
			profile: action.profile,
		});
	}
}
