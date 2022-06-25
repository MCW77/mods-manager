// react
import { createSelector } from "@reduxjs/toolkit";

// state
import {AppState, IAppState} from "../storage";

// actions
import * as Actions from "../actions/app";


export function changeSection(state: IAppState, action: ReturnType<typeof Actions.changeSection>): IAppState {
  return Object.assign({}, state, {
    section: action.section,
    previousSection: state.section,
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

export function setIsBusy(state: IAppState, action: ReturnType<typeof AppActions.setIsBusy>): IAppState {
  return Object.assign({}, state, {
    isBusy: action.isBusy
  });
}

export function setState(state: IAppState, action: ReturnType<typeof AppActions.setState>): IAppState {
  return Object.assign({}, action.state);
}

export function toggleSidebar(state: IAppState, action: ReturnType<typeof Actions.toggleSidebar>): IAppState {
  return Object.assign({}, state, {
    showSidebar: !state.showSidebar
  });
}


export const selectErrorMessage = (state: IAppState) => state.error;
export const selectFlashMessage = (state: IAppState) => state.flashMessage;
export const selectIsBusy = (state: IAppState) => state.isBusy;
export const selectModalMessage = (state: IAppState) => state.modal;
export const selectIsModalCancelable = createSelector(
  [selectModalMessage],
  (modal) => {
    if (modal === null) return false;
    return modal.cancelable;
  }
);
export const selectIsModalVisible = createSelector(
  [selectModalMessage],
  (modal) => modal !== null
);
export const selectModalClasses = createSelector(
  [selectModalMessage],
  (modal) => {
    if (modal === null) return '';
    return modal.class;
  }
);
export const selectModalContent = createSelector(
  [selectModalMessage],
  (modal) => {
    if (modal === null) return '';
    return modal.content;
  }
);
export const selectPreviousSection = (state: IAppState) => state.previousSection;
export const selectSection = (state: IAppState) => state.section;
export const selectShowSidebar = (state: IAppState) => state.showSidebar;
export const selectVersion = (state: IAppState) => state.version;