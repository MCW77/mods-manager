// domain
import type { TargetStat } from "../../domain/TargetStat";
import type { TemplatesAddingMode } from "../../domain/TemplatesAddingMode";


export namespace actions {
  /**
   * Add a target stat to the character edit form
   *
   * @param targetStat {TargetStat}
   * @returns {{type: string, targetStat: TargetStat}}
   */
  export function addTargetStat(targetStat: TargetStat) {
    return {
      type: actionNames.ADD_TARGET_STAT,
      targetStat: targetStat
    } as const;
  }

  /**
   * Update the filter that is used to highlight available characters
   * @param newFilter string
   * @returns {{type: string, filter: *}}
   */
  export function changeCharacterFilter(newFilter: string) {
    return {
      type: actionNames.CHANGE_CHARACTER_FILTER,
      filter: newFilter
    } as const;
  }

  /**
   * Fill the target stats to display on the character edit form
   *
   * @param targetStats {Array<TargetStat>}
   * @returns {{type: string, targetStats: Array<TargetStat>}}
   */
  export function changeTargetStats(targetStats: TargetStat[]) {
    return {
      type: actionNames.CHANGE_TARGET_STATS,
      targetStats: targetStats
    } as const;
  }

  /**
   * Remove a target stat from the character edit form
   *
   * @param index {Int}
   * @returns {{type: string, index: number}}
   */
  export function removeTargetStat(index: number) {
    return {
      type: actionNames.REMOVE_TARGET_STAT,
      index: index
    } as const;
  }

  export function setTemplatesAddingMode(mode: TemplatesAddingMode) {
    return {
      type: actionNames.SET_TEMPLATES_ADDING_MODE,
      mode
    } as const;
  }

  export function toggleCharacterEditSortView() {
    return {
      type: actionNames.TOGGLE_CHARACTER_EDIT_SORT_VIEW
    } as const;
  }

  export function toggleHideSelectedCharacters() {
    return {
      type: actionNames.TOGGLE_HIDE_SELECTED_CHARACTERS
    } as const;
  }
}

export namespace actionNames {
  export const ADD_TARGET_STAT = 'ADD_TARGET_STAT' as const;
  export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER' as const;
  export const CHANGE_TARGET_STATS = 'CHANGE_TARGET_STATS' as const;
  export const REMOVE_TARGET_STAT = 'REMOVE_TARGET_STAT' as const;
  export const SET_TEMPLATES_ADDING_MODE = 'SET_TEMPLATES_ADDING_MODE' as const;
  export const TOGGLE_CHARACTER_EDIT_SORT_VIEW = 'TOGGLE_CHARACTER_EDIT_SORT_VIEW' as const;
  export const TOGGLE_HIDE_SELECTED_CHARACTERS = 'TOGGLE_HIDE_SELECTED_CHARACTERS' as const;
}
