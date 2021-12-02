import { updateProfile } from "./app";
import groupByKey from "../../utils/groupByKey";
import { CharacterNames } from "constants/characterSettings";
import { Mod } from "domain/Mod";
import { ThunkResult } from "state/reducers/modsOptimizer";


export const CHANGE_OPTIMIZER_VIEW = 'CHANGE_OPTIMIZER_VIEW';
export const CHANGE_MODLIST_FILTER = 'CHANGE_MODLIST_FILTER';

type ViewOptions = 'list' | 'sets';
type SortOptions = 'currentCharacter' | 'assignedCharacter';

type ShowOptions = 'upgrades'| 'change' | 'all';

export interface ModListFilter {
  view: ViewOptions;
  show: ShowOptions;
  sort: SortOptions;
  tag: string;
}

export function changeOptimizerView(newView: string) {
  return {
    type: CHANGE_OPTIMIZER_VIEW,
    view: newView
  } as const;
}

/**
 * Unassign a mod
 * @param modID {string}
 * @returns {Function}
 */
export function unequipMod(modID: string) {
  return updateProfile(profile => {
    const mods = groupByKey(profile.mods, mod => mod.id);
    const oldMod = mods[modID];
    const newMod = oldMod ? oldMod.unequip() : null;

    return newMod ?
      profile.withMods(Object.values(Object.assign({}, mods, {
        [modID]: newMod
      }))) :
      profile;
  });
}

/**
 * Move a mod from its current character to a different character
 * @param modID {string}
 * @param characterID {string}
 * @returns {Function}
 */
export function reassignMod(modID: string, characterID: CharacterNames) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMod = modsById[modID];
    const currentlyEquippedMod =
      profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterID);

    const newMods = Object.values(Object.assign(
      {},
      modsById,
      oldMod ? { [oldMod.id]: oldMod.equip(characterID) } : {},
      currentlyEquippedMod ? { [currentlyEquippedMod.id]: currentlyEquippedMod.unequip() } : {}
    ));

    return profile.withMods(newMods);
  });
}

/**
 * Remove a set of mods from their assigned character
 * @param modIDS {Array<string>}
 * @returns {Function}
 */
export function unequipMods(modIDs: string[]) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const modsUpdate = groupByKey(modIDs.map(modID => modsById[modID].unequip()), mod => mod.id);

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

/**
 * Reassign a set of mods to a new character
 * @param modIDs {Array<string>}
 * @param characterID {string}
 * @returns {Function}
 */
export function reassignMods(modIDs: string[], characterID: CharacterNames) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMods = modIDs.map(modID => modsById[modID]);
    const currentlyEquippedMods =
      (oldMods.map(oldMod => profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterID))!
        .filter(mod => mod)) as Mod[];

    const modsUpdate = groupByKey(
      currentlyEquippedMods.map(mod => mod.unequip()).concat(oldMods.map(mod => mod.equip(characterID))),
      mod => mod.id
    );

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

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

/**
 * Replace parts of the mod list filter, leaving the rest as-is
 * @param newFilter {Object}
 * @returns {Function}
 */
export function updateModListFilter(newFilter: Partial<ModListFilter>): ThunkResult<void> {
  return function (dispatch, getState) {
    const state = getState();

    dispatch(changeModListFilter(
      Object.assign({}, state.modListFilter, newFilter)
    ));
  }
}
