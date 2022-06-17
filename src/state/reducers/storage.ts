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
