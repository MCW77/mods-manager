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

  export function addPlayerProfile(state: IAppState, action: ReturnType<typeof actions.addPlayerProfile>): IAppState {
    return Object.assign({}, state, {
      playerProfiles: Object.assign({}, selectors.selectPlayerProfiles(state), {
        [action.profile.allyCode]: action.profile.playerName
      })
    });
  }

  export function setPlayerProfiles(state: IAppState, action: ReturnType<typeof actions.setPlayerProfiles>): IAppState {
    return Object.assign({}, state, { playerProfiles: action.profiles });
  }

  export function setCharacterTemplates(state: IAppState, action: ReturnType<typeof actions.setCharacterTemplates>): IAppState {
    return Object.assign({}, state, { characterTemplates: action.templates }) as IAppState;
  }

  export function setHotUtilsSubscription(state: IAppState, action: ReturnType<typeof actions.setHotUtilsSubscription>): IAppState {
    return Object.assign({}, state, { hotUtilsSubscription: action.subscription });
  }
};

export namespace selectors {
  export const selectAllycode = (state: IAppState) => state.allyCode;
  export const selectActiveProfile = (state: IAppState) => state.profile;
  export const selectGlobalOptimizationSettings = createSelector(
    [selectActiveProfile],
    (profile) => profile.globalSettings
  );
  export const selectHotUtilsSubscription = (state: IAppState) => state.hotUtilsSubscription;
  export const selectIsIncrementalOptimization = createSelector(
    [selectActiveProfile],
    (profile) => profile.incrementalOptimizeIndex !== null
  );
  export const selectPlayerProfiles = (state: IAppState) => state.playerProfiles;
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
