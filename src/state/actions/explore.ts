// domain
import { ModsViewOptions } from "../../domain/modules/ModsViewOptions";

export namespace actions {
	/**
	 * Update the view options for the explore view
	 * @param newOptions
	 * @returns {{type: 'CHANGE_MODS_VIEW_OPTIONS', options: *}}
	 */
	export function changeModsViewOptions(newOptions: ModsViewOptions) {
		return {
			type: actionNames.CHANGE_MODS_VIEW_OPTIONS,
			options: newOptions,
		} as const;
	}
}

export namespace actionNames {
	export const CHANGE_MODS_VIEW_OPTIONS = "CHANGE_MODS_VIEW_OPTIONS" as const;
}
