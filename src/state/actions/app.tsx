// state
import { IAppState } from "../storage";

// components
import type * as UITypes from "../../components/types";


export const CHANGE_SECTION = 'CHANGE_SECTION' as const;
export const DELETE_PROFILE = 'DELETE_PROFILE' as const;
export const HIDE_ERROR = 'HIDE_ERROR' as const;
export const HIDE_FLASH = 'HIDE_FLASH' as const;
export const HIDE_MODAL = 'HIDE_MODAL' as const;
export const IMPORT_C3POPROFILE = 'IMPORT_C3POPROFILE' as const;
export const RESET_STATE = 'RESET_STATE' as const;
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS' as const;
export const SET_IS_BUSY = 'SET_IS_BUSY' as const;
export const SET_STATE = 'SET_STATE' as const;
export const SHOW_ERROR = 'SHOW_ERROR' as const;
export const SHOW_FLASH = 'SHOW_FLASH' as const;
export const SHOW_MODAL = 'SHOW_MODAL' as const;
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR' as const;

export function changeSection(newSection: UITypes.Sections) {
  return {
    type: CHANGE_SECTION,
    section: newSection
  } as const;
}

export function hideError() {
  return {
    type: HIDE_ERROR
  } as const;
}

export function hideFlash() {
  return {
    type: HIDE_FLASH
  } as const;
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  } as const;
}

export function resetState() {
  return {
    type: RESET_STATE
  } as const;
}

export function setIsBusy(isBusy: boolean) {
  return {
    type: SET_IS_BUSY,
    isBusy: isBusy
  } as const;
}

export function setState(state: IAppState) {
  return {
    type: SET_STATE,
    state: state
  } as const;
}

export function showError(errorContent: UITypes.DOMContent) {
  return {
    type: SHOW_ERROR,
    content: errorContent
  } as const;
}

export function showFlash(heading: string, flashContent: UITypes.DOMContent) {
  return {
    type: SHOW_FLASH,
    heading: heading,
    content: flashContent
  } as const;
}

export function showModal(
  modalClass: string,
  modalContent: UITypes.DOMContent,
  cancelable = true
) {
  return {
    type: SHOW_MODAL,
    class: modalClass,
    content: modalContent,
    cancelable: cancelable
  } as const;
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  } as const;
}
