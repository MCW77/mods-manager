// domain
import type { ModListFilter } from "../../domain/ModListFilter";

export namespace actions {
	/**
	 * Update the filter for the mod list view
	 * @param newFilter {{view: string, sort: string, tag: string}}
	 * @returns {{type: string, filter: *}}
	 */
	export function changeModListFilter(newFilter: ModListFilter) {
		return {
			type: actionNames.CHANGE_MODLIST_FILTER,
			filter: newFilter,
		} as const;
	}

}

export namespace actionNames {
	export const CHANGE_MODLIST_FILTER = "CHANGE_MODLIST_FILTER" as const;
}
