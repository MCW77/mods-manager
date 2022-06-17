// domain
import {
  ModsViewOptions,
} from "../../domain/modules/ModsViewOptions";


export const CHANGE_MODS_VIEW_OPTIONS = 'CHANGE_MODS_VIEW_OPTIONS';

/**
 * Update the view options for the explore view
 * @param newOptions
 * @returns {{type: 'CHANGE_MODS_VIEW_OPTIONS', options: *}}
 */
export function changeModsViewOptions(newOptions: ModsViewOptions) {
  return {
    type: CHANGE_MODS_VIEW_OPTIONS,
    options: newOptions
  } as const;
}
