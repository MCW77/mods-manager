// state
import { IAppState } from "../storage";

// components
import type * as UITypes from "../../components/types";

export namespace actions {
	export function changeSection(newSection: UITypes.Sections) {
		return {
			type: actionNames.CHANGE_SECTION,
			section: newSection,
		} as const;
	}

	export function hideError() {
		return {
			type: actionNames.HIDE_ERROR,
		} as const;
	}

	export function hideFlash() {
		return {
			type: actionNames.HIDE_FLASH,
		} as const;
	}

	export function hideModal() {
		return {
			type: actionNames.HIDE_MODAL,
		} as const;
	}

	export function resetState() {
		return {
			type: actionNames.RESET_STATE,
		} as const;
	}

	export function setState(state: IAppState) {
		return {
			type: actionNames.SET_STATE,
			state: state,
		} as const;
	}

	export function showError(errorContent: UITypes.DOMContent) {
		return {
			type: actionNames.SHOW_ERROR,
			content: errorContent,
		} as const;
	}

	export function showFlash(heading: string, flashContent: UITypes.DOMContent) {
		return {
			type: actionNames.SHOW_FLASH,
			heading: heading,
			content: flashContent,
		} as const;
	}

	export function showModal(
		modalClass: string,
		modalContent: UITypes.DOMContent,
		cancelable = true,
	) {
		return {
			type: actionNames.SHOW_MODAL,
			class: modalClass,
			content: modalContent,
			cancelable: cancelable,
		} as const;
	}

	export function toggleSidebar() {
		return {
			type: actionNames.TOGGLE_SIDEBAR,
		} as const;
	}
}

export namespace actionNames {
	export const CHANGE_SECTION = "CHANGE_SECTION" as const;
	export const HIDE_ERROR = "HIDE_ERROR" as const;
	export const HIDE_FLASH = "HIDE_FLASH" as const;
	export const HIDE_MODAL = "HIDE_MODAL" as const;
	export const RESET_STATE = "RESET_STATE" as const;
	export const SET_STATE = "SET_STATE" as const;
	export const SHOW_ERROR = "SHOW_ERROR" as const;
	export const SHOW_FLASH = "SHOW_FLASH" as const;
	export const SHOW_MODAL = "SHOW_MODAL" as const;
	export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR" as const;
}
