// domain
import { SetRestrictions } from "../../domain/SetRestrictions";
import { SetStats } from "../../domain/Stats";
import { TargetStat } from "../../domain/TargetStat";


export const ADD_TARGET_STAT = 'ADD_TARGET_STAT' as const;
export const CHANGE_CHARACTER_EDIT_MODE = 'CHANGE_CHARACTER_EDIT_MODE' as const;
export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER' as const;
export const CHANGE_SET_RESTRICTIONS = 'CHANGE_SET_RESTRICTIONS' as const;
export const CHANGE_TARGET_STATS = 'CHANGE_TARGET_STATS' as const;
export const REMOVE_SET_BONUS = 'REMOVE_SET_BONUS' as const;
export const REMOVE_TARGET_STAT = 'REMOVE_TARGET_STAT' as const;
export const SELECT_SET_BONUS = 'SELECT_SET_BONUS' as const;
export const TOGGLE_CHARACTER_EDIT_SORT_VIEW = 'TOGGLE_CHARACTER_EDIT_SORT_VIEW' as const;
export const TOGGLE_HIDE_SELECTED_CHARACTERS = 'TOGGLE_HIDE_SELECTED_CHARACTERS' as const;


/**
 * Add a target stat to the character edit form
 *
 * @param targetStat {TargetStat}
 * @returns {{type: string, targetStat: TargetStat}}
 */
export function addTargetStat(targetStat: TargetStat) {
  return {
    type: ADD_TARGET_STAT,
    targetStat: targetStat
  } as const;
}

/**
 * Switch between basic and advanced edit mode
 * @param mode
 * @returns {{type: string, mode: *}}
 */
export function changeCharacterEditMode(mode: 'basic' | 'advanced') {
  return {
    type: CHANGE_CHARACTER_EDIT_MODE,
    mode: mode
  } as const;
}

/**
 * Update the filter that is used to highlight available characters
 * @param newFilter string
 * @returns {{type: string, filter: *}}
 */
export function changeCharacterFilter(newFilter: string) {
  return {
    type: CHANGE_CHARACTER_FILTER,
    filter: newFilter
  } as const;
}

/**
 * Fill the set restrictions to display on the character edit form
 * @param setRestrictions {SetRestrictions}
 * @returns {{setRestrictions: SetRestrictions, type: 'CHANGE_SET_RESTRICTIONS'}}
 */
export function changeSetRestrictions(setRestrictions: SetRestrictions) {
  return {
    type: CHANGE_SET_RESTRICTIONS,
    setRestrictions: setRestrictions
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
    type: CHANGE_TARGET_STATS,
    targetStats: targetStats
  } as const;
}

/**
 * Remove a set bonus from the currently selected sets
 *
 * @param setBonus
 * @returns {{setBonus: *, type: string}}
 */
export function removeSetBonus(set: SetStats.GIMOStatNames) {
  return {
    type: REMOVE_SET_BONUS,
    setBonus: set
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
    type: REMOVE_TARGET_STAT,
    index: index
  } as const;
}

/**
 * Add a set bonus to the currently selected sets
 *
 * @param setBonus
 * @returns {{setBonus: *, type: string}}
 */
export function selectSetBonus(set: SetStats.GIMOStatNames) {
  return {
    type: SELECT_SET_BONUS,
    setBonus: set
  } as const;
}

export function toggleCharacterEditSortView() {
  return {
    type: TOGGLE_CHARACTER_EDIT_SORT_VIEW
  } as const;
}

export function toggleHideSelectedCharacters() {
  return {
    type: TOGGLE_HIDE_SELECTED_CHARACTERS
  } as const;
}
