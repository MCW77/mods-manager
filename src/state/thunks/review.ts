// utils
import groupByKey from "../../utils/groupByKey";

// modules
import { App } from '../modules/app';

// domain
import type { CharacterNames } from "../../constants/characterSettings";

import type { Mod } from "../../domain/Mod";

export namespace thunks {

  /**
   * Move a mod from its current character to a different character
   * @param modID {string}
   * @param characterID {string}
   * @returns {Function}
   */
  export function reassignMod(modID: string, characterID: CharacterNames) {
    return App.thunks.updateProfile(profile => {
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
   * Reassign a set of mods to a new character
   * @param modIDs {Array<string>}
   * @param characterID {string}
   * @returns {Function}
   */
  export function reassignMods(modIDs: string[], characterID: CharacterNames) {
    return App.thunks.updateProfile(profile => {
      const modsById = groupByKey(profile.mods, mod => mod.id);
      const oldMods = modIDs.map(modID => modsById[modID]);
      const currentlyEquippedMods =
        (oldMods.map(oldMod => profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterID))
          .filter(mod => mod)) as Mod[];

      const modsUpdate = groupByKey(
        currentlyEquippedMods.map(mod => mod.unequip()).concat(oldMods.map(mod => mod.equip(characterID))),
        mod => mod.id
      );

      return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
    });
  }

  /**
   * Unassign a mod
   * @param modID {string}
   * @returns {Function}
   */
  export function unequipMod(modID: string) {
    return App.thunks.updateProfile(profile => {
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
   * Remove a set of mods from their assigned character
   * @param modIDS {Array<string>}
   * @returns {Function}
   */
  export function unequipMods(modIDs: string[]) {
    return App.thunks.updateProfile(profile => {
      const modsById = groupByKey(profile.mods, mod => mod.id);
      const modsUpdate = groupByKey(modIDs.map(modID => modsById[modID].unequip()), mod => mod.id);

      return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
    });
  }
};