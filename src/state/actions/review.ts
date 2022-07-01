// domain
import { ModListFilter } from "../../domain/ModListFilter";


export const CHANGE_MODLIST_FILTER = 'CHANGE_MODLIST_FILTER' as const;
export const CHANGE_OPTIMIZER_VIEW = 'CHANGE_OPTIMIZER_VIEW' as const;


/**
 * Update the filter for the mod list view
 * @param newFilter {{view: string, sort: string, tag: string}}
 * @returns {{type: string, filter: *}}
 */
export function changeModListFilter(newFilter: ModListFilter) {
  return {
    type: CHANGE_MODLIST_FILTER,
    filter: newFilter
  } as const;
}

export function changeOptimizerView(newView: string) {
  return {
    type: CHANGE_OPTIMIZER_VIEW,
    view: newView
  } as const;
}
