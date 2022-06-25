// react
import { createSelector } from "@reduxjs/toolkit";

// state
import { IAppState } from "../storage";

// actions
import * as Actions from "../actions/storage";


export function cleanState(state: IAppState) {
  const newState = Object.assign({}, state);

  delete newState.profiles;
  delete newState.characters;

  return newState;
}

export function setBaseCharacters(state: IAppState, action: ReturnType<typeof Actions.setBaseCharacters>) {
  return Object.assign({}, state, { baseCharacters: action.baseCharacters });
}

export function setProfile(state: IAppState, action: ReturnType<typeof Actions.setProfile>) {
  return Object.assign({}, state, {
    allyCode: action.profile ? action.profile.allyCode : '',
    profile: action.profile
  });
}

export function addPlayerProfile(state: IAppState, action: ReturnType<typeof Actions.addPlayerProfile>) {
  return Object.assign({}, state, {
    playerProfiles: Object.assign({}, state.playerProfiles, {
      [action.profile.allyCode]: action.profile.playerName
    })
  });
}

export function setPlayerProfiles(state: IAppState, action: ReturnType<typeof Actions.setPlayerProfiles>) {
  return Object.assign({}, state, { playerProfiles: action.profiles });
}

export function setCharacterTemplates(state: IAppState, action: ReturnType<typeof Actions.setCharacterTemplates>) {
  return Object.assign({}, state, { characterTemplates: action.templates }) as IAppState;
}

export function setHotUtilsSubscription(state: IAppState, action: ReturnType<typeof Actions.setHotUtilsSubscription>) {
  return Object.assign({}, state, { hotUtilsSubscription: action.subscription });
}


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
