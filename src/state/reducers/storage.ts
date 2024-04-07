// react
import { createSelector } from "@reduxjs/toolkit";

// state
import { IAppState } from "../storage";

// actions
import { actions } from "../actions/storage";

export namespace reducers {

  export function setBaseCharacters(state: IAppState, action: ReturnType<typeof actions.setBaseCharacters>): IAppState {
    return Object.assign({}, state, { baseCharacters: action.baseCharacters });
  }

  export function setProfile(state: IAppState, action: ReturnType<typeof actions.setProfile>): IAppState {
    return Object.assign({}, state, {
      allyCode: action.profile ? action.profile.allyCode : '',
      profile: action.profile
    });
  }

  export function setCharacterTemplates(state: IAppState, action: ReturnType<typeof actions.setCharacterTemplates>): IAppState {
    return Object.assign({}, state, { templates: { userTemplatesByName: action.templates, templatesAddingMode: state.templates.templatesAddingMode} }) as IAppState;
  }

  export function setHotUtilsSubscription(state: IAppState, action: ReturnType<typeof actions.setHotUtilsSubscription>): IAppState {
    return Object.assign({}, state, { hotUtilsSubscription: action.subscription });
  }
};

export namespace selectors {
  export const selectActiveProfile = (state: IAppState) => state.profile;
  export const selectHotUtilsSubscription = (state: IAppState) => state.hotUtilsSubscription;
  export const selectCharactersInActiveProfile = createSelector(
    [selectActiveProfile],
    (activeProfile) => activeProfile.characters
  );
  export const selectModAssignmentsInActiveProfile = createSelector(
    [selectActiveProfile],
    (activeProfile) => activeProfile.modAssignments
  );
  export const selectModsInActiveProfile = createSelector(
    [selectActiveProfile],
    (activeProfile) => activeProfile.mods
  );
};
