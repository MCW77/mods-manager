// actions
import * as App from '../actions/app';

// reducers
import * as Red from '../reducers/app';


export const ActionNames = {
  [App.CHANGE_SECTION]: App.CHANGE_SECTION,
  [App.DELETE_PROFILE]: App.DELETE_PROFILE,
  [App.HIDE_ERROR]: App.HIDE_ERROR,
  [App.HIDE_FLASH]: App.HIDE_FLASH,
  [App.HIDE_MODAL]: App.HIDE_MODAL,
  [App.IMPORT_C3POPROFILE]: App.IMPORT_C3POPROFILE,
  [App.RESET_STATE]: App.RESET_STATE,
  [App.RESTORE_PROGRESS]: App.RESTORE_PROGRESS,
  [App.SET_IS_BUSY]: App.SET_IS_BUSY,
  [App.SET_STATE]: App.SET_STATE,
  [App.SHOW_ERROR]: App.SHOW_ERROR,
  [App.SHOW_FLASH]: App.SHOW_FLASH,
  [App.SHOW_MODAL]: App.SHOW_MODAL,
  [App.TOGGLE_SIDEBAR]: App.TOGGLE_SIDEBAR
};

export const Actions = {
  [App.CHANGE_SECTION]: App.changeSection,
  [App.HIDE_ERROR]: App.hideError,
  [App.HIDE_FLASH]: App.hideFlash,
  [App.HIDE_MODAL]: App.hideModal,
  [App.RESET_STATE]: App.resetState,
  [App.SET_IS_BUSY]: App.setIsBusy,
  [App.SET_STATE]: App.setState,
  [App.SHOW_ERROR]: App.showError,
  [App.SHOW_FLASH]: App.showFlash,
  [App.SHOW_MODAL]: App.showModal,
  [App.TOGGLE_SIDEBAR]: App.toggleSidebar
};

export const Reducers = {
  [App.CHANGE_SECTION]: Red.changeSection,
  [App.HIDE_ERROR]: Red.hideError,
  [App.HIDE_FLASH]: Red.hideFlash,
  [App.HIDE_MODAL]: Red.hideModal,
  [App.RESET_STATE]: Red.resetState,
  [App.SET_IS_BUSY]: Red.setIsBusy,
  [App.SET_STATE]: Red.setState,
  [App.SHOW_ERROR]: Red.showError,
  [App.SHOW_FLASH]: Red.showFlash,
  [App.SHOW_MODAL]: Red.showModal,
  [App.TOGGLE_SIDEBAR]: Red.toggleSidebar
};
