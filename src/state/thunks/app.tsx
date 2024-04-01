// react
import React from 'react';
import { ThunkDispatch, ThunkResult } from "../reducers/modsOptimizer";

// utils
import groupByKey from "../../utils/groupByKey";

// state
import { IAppState } from "../storage";
import getDatabase, { IUserData } from "../storage/Database";
import { incrementalOptimization$ } from '#/modules/incrementalOptimization/state/incrementalOptimization';
import { optimizationSettings$ } from '#/modules/optimizationSettings/state/optimizationSettings';

// modules
import { actions } from '../actions/app';
import { CharacterEdit } from '../modules/characterEdit';
import { Storage } from '../modules/storage';

// domain
import * as C3POMods from "../../modules/profilesManagement/dtos/c3po";
import * as C3POMappers from "../../modules/profilesManagement/mappers/c3po";
import { Mod } from "../../domain/Mod";
import { PlayerProfile, IFlatPlayerProfile } from "../../domain/PlayerProfile";


export namespace thunks {
  export function deleteProfile(allyCode: string): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      optimizationSettings$.deleteProfile(allyCode);
      incrementalOptimization$.deleteProfile(allyCode);
      db.deleteProfile(
        allyCode,
        () => dispatch(Storage.thunks.loadProfiles(null)),
        error => dispatch(actions.showFlash(
          'Storage Error',
          'Error deleting your profile: ' + error?.message
        ))
      );
    };
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
      let profile = await db.getProfile(Storage.selectors.selectAllycode(state));
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
          dispatch(Storage.thunks.loadProfile(Storage.selectors.selectAllycode(state)));
          dispatch(actions.showFlash(
            'Success!',
            <p>
              Successfully imported <span className={'gold'}>{totalMods}</span> mods for player <span className={'gold'}>{state.profile.playerName}</span>
            </p>,
          ));
        },
        error => dispatch(actions.showError(
          'Error saving player profiles: ' + error?.message
        ))
      );
    }
  }

  export function reset(): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.delete(
        () => dispatch(actions.resetState()),
        error => dispatch(actions.showError(
          'Error deleting the database: ' + error?.message + '. Try clearing it manually and refreshing.'
        ))
      );
    };
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

              dispatch(Storage.thunks.saveProfiles(updatedProfiles, stateObj.allyCode));

            },
            error =>
              // On error, just save the profiles directly from the file
              dispatch(Storage.thunks.saveProfiles(stateObj.profiles, stateObj.allyCode))
          );

          dispatch(Storage.thunks.saveBaseCharacters(stateObj.gameSettings));
          dispatch(Storage.thunks.saveLastRuns(stateObj.lastRuns));
          if (stateObj.characterTemplates) {
            dispatch(CharacterEdit.thunks.saveTemplates(stateObj.characterTemplates))
          }
          if (stateObj.allyCode !== '') {
            dispatch(Storage.thunks.loadProfile(stateObj.allyCode));
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

  type UpdateFunc = (a: PlayerProfile) => PlayerProfile;
  type AuxiliaryChangesFunc = (dispatch: ThunkDispatch, getState: () => IAppState, c: PlayerProfile) => void;

  function noop (a: any, b: any, c: any) {
  }

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
        error => dispatch(actions.showFlash(
          'Storage Error',
          'Error saving your progress: ' + error?.message + ' Your progress may be lost on page refresh.'
        ))
      );
      dispatch(Storage.actions.setProfile(newProfile));
      auxiliaryChanges(dispatch, getState, newProfile);
    };
  }
};
