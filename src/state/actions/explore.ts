import { FilterSettings } from "domain/modules/FilterSettings";

export const CHANGE_MODS_FILTER = 'CHANGE_MODS_FILTER';

/**
 * Update the filter for the explore view
 * @param newFilter
 * @returns {{type: 'CHANGE_MODS_FILTER', filter: *}}
 */
export function changeModsFilter(newFilter: FilterSettings) {
  return {
    type: CHANGE_MODS_FILTER,
    filter: newFilter
  } as const;
}
