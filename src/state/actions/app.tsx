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

	export function toggleSidebar() {
		return {
			type: actionNames.TOGGLE_SIDEBAR,
		} as const;
	}
}

export namespace actionNames {
	export const CHANGE_SECTION = "CHANGE_SECTION" as const;
	export const RESET_STATE = "RESET_STATE" as const;
	export const SET_STATE = "SET_STATE" as const;
	export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR" as const;
}
