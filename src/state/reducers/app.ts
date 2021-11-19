import * as Actions from "state/actions/app";
import {AppState, IAppState} from "../storage";

export function changeSection(state: IAppState, action: ReturnType<typeof Actions.changeSection>): IAppState {
  return Object.assign({}, state, {
    section: action.section
  });
}

export function showModal(state: IAppState, action: ReturnType<typeof Actions.showModal>): IAppState {
  return Object.assign({}, state, {
    modal: {
      class: action.class,
      content: action.content,
      cancelable: action.cancelable
    }
  });
}

export function hideModal(state: IAppState): IAppState {
  return Object.assign({}, state, {
    setRestrictions: {},
    modal: null
  });
}

export function showError(state: IAppState, action: ReturnType<typeof Actions.showError>): IAppState {
  return Object.assign({}, state, {
    error: action.content
  });
}

export function hideError(state: IAppState): IAppState {
  return Object.assign({}, state, {
    error: null
  });
}

export function showFlash(state: IAppState, action: ReturnType<typeof Actions.showFlash>): IAppState {
  return Object.assign({}, state, {
    flashMessage: {
      heading: action.heading,
      content: action.content
    }
  });
}

export function hideFlash(state: IAppState): IAppState {
  return Object.assign({}, state, {
    flashMessage: null
  });
}

export function resetState() {
  return Object.assign({}, AppState.Default);
}

export function toggleSidebar(state: IAppState, action: ReturnType<typeof Actions.toggleSidebar>): IAppState {
  return Object.assign({}, state, {
    showSidebar: !state.showSidebar
  });
}

export function setState(state: IAppState, action: ReturnType<typeof Actions.setState>): IAppState {
  return Object.assign({}, action.state);
}

export function setIsBusy(state: IAppState, action: ReturnType<typeof Actions.setIsBusy>): IAppState {
  return Object.assign({}, state, {
    isBusy: action.isBusy
  });
}
