// react
import { createSelector } from "@reduxjs/toolkit";

// state
import type { IAppState } from "../storage";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// actions
import type { actions } from "../actions/storage";

export namespace reducers {
	export function setBaseCharacters(
		state: IAppState,
		action: ReturnType<typeof actions.setBaseCharacters>,
	): IAppState {
		return Object.assign({}, state, { baseCharacters: action.baseCharacters });
	}

	export function setProfile(
		state: IAppState,
		action: ReturnType<typeof actions.setProfile>,
	): IAppState {
		if (action.profile) profilesManagement$.profiles.activeAllycode.set(action.profile.allyCode);
		return Object.assign({}, state, {
			profile: action.profile,
		});
	}
}

export namespace selectors {
	export const selectActiveProfile = (state: IAppState) => state.profile;
	export const selectCharactersInActiveProfile = createSelector(
		[selectActiveProfile],
		(activeProfile) => activeProfile.characters,
	);
	export const selectModAssignmentsInActiveProfile = createSelector(
		[selectActiveProfile],
		(activeProfile) => activeProfile.modAssignments,
	);
	export const selectModsInActiveProfile = createSelector(
		[selectActiveProfile],
		(activeProfile) => activeProfile.mods,
	);
}
