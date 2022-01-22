import React from 'react';
import { ThunkDispatch, ThunkResult } from "../reducers/modsOptimizer";

import { saveTemplates } from "./characterEdit"
import {
  loadProfile,
  loadProfiles,
  saveBaseCharacters,
  saveLastRuns,
  saveProfiles,
  setProfile,
} from "./storage";

import { IAppState } from "../storage";
import { PlayerProfile, IFlatPlayerProfile } from "../../domain/PlayerProfile";
import type * as UITypes from "../../components/types";

import getDatabase, { IUserData } from "../storage/Database";
import groupByKey from "../../utils/groupByKey";
import { Mod } from "../../domain/Mod";
import * as C3POMods from "../../modules/profilesManagement/dtos/c3po";
import * as C3POMappers from "../../modules/profilesManagement/mappers/c3po";

export const CHANGE_SECTION = 'CHANGE_SECTION' as const;
export const SHOW_MODAL = 'SHOW_MODAL' as const;
export const HIDE_MODAL = 'HIDE_MODAL' as const;
export const SHOW_ERROR = 'SHOW_ERROR' as const;
export const HIDE_ERROR = 'HIDE_ERROR' as const;
export const SHOW_FLASH = 'SHOW_FLASH' as const;
export const HIDE_FLASH = 'HIDE_FLASH' as const;
export const RESET_STATE = 'RESET_STATE' as const;
export const IMPORT_C3POPROFILE = 'IMPORT_C3POPROFILE' as const;
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS' as const;
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR' as const;
export const DELETE_PROFILE = 'DELETE_PROFILE' as const;
export const SET_STATE = 'SET_STATE' as const;
export const SET_IS_BUSY = 'SET_IS_BUSY' as const;

export function changeSection(newSection: UITypes.Sections) {
  return {
    type: CHANGE_SECTION,
    section: newSection
  } as const;
}

export function showModal(
  modalClass: string,
  modalContent: UITypes.DOMContent,
  cancelable = true
) {
  return {
    type: SHOW_MODAL,
    class: modalClass,
    content: modalContent,
    cancelable: cancelable
  } as const;
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  } as const;
}

export function showError(errorContent: UITypes.DOMContent) {
  return {
    type: SHOW_ERROR,
    content: errorContent
  } as const;
}

export function hideError() {
  return {
    type: HIDE_ERROR
  } as const;
}

export function showFlash(heading: string, flashContent: UITypes.DOMContent) {
  return {
    type: SHOW_FLASH,
    heading: heading,
    content: flashContent
  } as const;
}

export function hideFlash() {
  return {
    type: HIDE_FLASH
  } as const;
}


export function reset(): ThunkResult<void> {
  return function (dispatch) {
    const db = getDatabase();
    db.delete(
      () => dispatch(resetState()),
      error => dispatch(showError(
        'Error deleting the database: ' + error?.message + '. Try clearing it manually and refreshing.'
      ))
    );
  };
}

export function resetState() {
  return {
    type: RESET_STATE
  } as const;
}

export function importC3POProfile(profileJSON: string): ThunkResult<void> {
  return function (dispatch) {
    try {
      const mods: C3POMods.C3POModDTO[] = JSON.parse(profileJSON);
      dispatch(replaceModsForCurrentProfile(mods));
    } catch (e) {
      throw new Error(
        `Unable to process the file. Error message: ${(e as Error).message}`       
      );
    }
  }
}

export function replaceModsForCurrentProfile(mods: C3POMods.C3POModDTO[]): ThunkResult<Promise<void>> {

  return async function (dispatch, getState) {
    const state = getState();
    const db = getDatabase();
    let profile = await db.getProfile(state.allyCode);
    mods = mods.filter(mod => mod.equippedUnit === 'none');
    const mapper = new C3POMappers.ModMapper();
    const newMods: Mod[] = mods.map(
      mod => mapper.fromC3PO(mod)
    ).concat(profile.mods.filter(
      mod => mod.characterID !== 'null'
    ));

    profile = profile.withMods(newMods);
    const totalMods = mods.length;

    db.saveProfile(
      profile,
      () => {
        dispatch(loadProfile(state.allyCode));
        dispatch(showFlash(
          'Success!',
          <p>
            Successfully imported <span className={'gold'}>{totalMods}</span> mods for player <span className={'gold'}>{state.profile.playerName}</span>
          </p>,
        ));
      },
      error => dispatch(showError(
        'Error saving player profiles: ' + error?.message
      ))
    );
  }
}

export function restoreProgress(progressData: string): ThunkResult<void> {
  return function (dispatch) {
    try {
      const stateObj: IUserData = JSON.parse(progressData);

      if (stateObj.version > '1.4' && stateObj.version !== 'develop') {

        // Get all of the current profiles from the database - if any have HotUtils session IDs, we'll keep those,
        // overwriting anything stored in the file
        const db = getDatabase();
        db.getProfiles(
          profiles => {
            const profileByAllyCode = groupByKey(profiles, profile => profile.allyCode);

            const updatedProfiles: IFlatPlayerProfile[] = stateObj.profiles.map(profile => {
              const oldProfile = profileByAllyCode[profile.allyCode];

              return {
                ...profile,
                hotUtilsSessionId: oldProfile ? oldProfile.hotUtilsSessionId : null
              }
            });

            dispatch(saveProfiles(updatedProfiles, stateObj.allyCode));

          },
          error =>
            // On error, just save the profiles directly from the file
            dispatch(saveProfiles(stateObj.profiles, stateObj.allyCode))
        );

        dispatch(saveBaseCharacters(stateObj.gameSettings));
        dispatch(saveLastRuns(stateObj.lastRuns));
        if (stateObj.characterTemplates) {
          dispatch(saveTemplates(stateObj.characterTemplates))
        }
        if (stateObj.allyCode !== '') {
          dispatch(loadProfile(stateObj.allyCode));
        }
        
      }
    } catch (e) {
      throw new Error(
        'Unable to process progress file. Is this a template file? If so, use the "load" button below. Error message: ' +
        (e as Error).message
      );
    }
  }
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  } as const;
}

export function deleteProfile(allyCode: string): ThunkResult<void> {
  return function (dispatch) {
    const db = getDatabase();
    db.deleteProfile(
      allyCode,
      () => dispatch(loadProfiles(null)),
      error => dispatch(showFlash(
        'Storage Error',
        'Error deleting your profile: ' + error?.message
      ))
    );
  };
}

export function setState(state: IAppState) {
  return {
    type: SET_STATE,
    state: state
  } as const;
}

export function setIsBusy(isBusy: boolean) {
  return {
    type: SET_IS_BUSY,
    isBusy: isBusy
  } as const;
}

function noop (a: any, b: any, c: any) {
}

type UpdateFunc = (a: PlayerProfile) => PlayerProfile;
type AuxiliaryChangesFunc = (dispatch: ThunkDispatch, getState: () => IAppState, c: PlayerProfile) => void;
/**
 * Update the currently-selected character profile by calling an update function on the existing profile. Optionally
 * update the base state with other auxiliary changes as well.
 * @param updateFunc {function(PlayerProfile): PlayerProfile}
 * @param auxiliaryChanges {function(dispatch, getState, newProfile)} Any additional changes that need to be made in
 * addition to the profile
 * @returns {Function}
 */
export function updateProfile(
  updateFunc: UpdateFunc,
  auxiliaryChanges: AuxiliaryChangesFunc = noop
): ThunkResult<void> {
  return function (dispatch, getState: () => IAppState) {
    const state = getState();
    const db = getDatabase();
    const newProfile = updateFunc(state.profile!); //ToDo: Check if profile is never null

    db.saveProfile(
      newProfile,
      () => {},
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving your progress: ' + error?.message + ' Your progress may be lost on page refresh.'
      ))
    );
    dispatch(setProfile(newProfile));
    auxiliaryChanges(dispatch, getState, newProfile);
  };
}
