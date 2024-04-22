// react
import type { ThunkDispatch, ThunkResult } from "#/state/reducers/modsOptimizer";

// utils
import groupByKey from "#/utils/groupByKey";

// state
import type { IAppState } from "#/state/storage";
import getDatabase, { type IUserData } from "#/state/storage/Database";

import { dialog$ } from '#/modules/dialog/state/dialog';
import { incrementalOptimization$ } from '#/modules/incrementalOptimization/state/incrementalOptimization';
import { optimizationSettings$ } from '#/modules/optimizationSettings/state/optimizationSettings';
import { profilesManagement$ } from '#/modules/profilesManagement/state/profilesManagement';

// modules
import { actions } from '#/state/actions/app';
import { CharacterEdit } from '#/state/modules/characterEdit';
import { Storage } from '#/state/modules/storage';

// domain
import type * as C3POMods from "#/modules/profilesManagement/dtos/c3po";
import * as C3POMappers from "#/modules/profilesManagement/mappers/c3po";
import type { Mod } from "#/domain/Mod";
import type { PlayerProfile, IFlatPlayerProfile } from "#/domain/PlayerProfile";

export namespace thunks {
  export function deleteProfile(allyCode: string): ThunkResult<void> {
    return (dispatch) => {
      const db = getDatabase();
      optimizationSettings$.deleteProfile(allyCode);
      incrementalOptimization$.deleteProfile(allyCode);
      db.deleteProfile(
        allyCode,
        () => dispatch(Storage.thunks.loadProfiles(null)),
        error => dialog$.showFlash(
          "Storage Error",
          `Error deleting your profile: ${error?.message}`,
          "",
          undefined,
          "error",
        )
      );
    };
  }

  export function importC3POProfile(profileJSON: string): ThunkResult<void> {
    return (dispatch) => {
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

    return async (dispatch, getState) => {
      const state = getState();
      const db = getDatabase();
      let profile = await db.getProfile(profilesManagement$.profiles.activeAllycode.get());
      mods = mods.filter(mod => mod.equippedUnit === "none");
      const mapper = new C3POMappers.ModMapper();
      const newMods: Mod[] = mods.map(
        mod => mapper.fromC3PO(mod)
      ).concat(profile.mods.filter(
        mod => mod.characterID !== "null"
      ));

      profile = profile.withMods(newMods);
      const totalMods = mods.length;

      db.saveProfile(
        profile,
        () => {
          dispatch(Storage.thunks.loadProfile(profilesManagement$.profiles.activeAllycode.get()));
          dialog$.showFlash(
            <p>
              Successfully imported <span className={'gold'}>{totalMods}</span> mods for player <span className={'gold'}>{state.profile.playerName}</span>
            </p>,
            "",
            "",
            undefined,
            "success",
          );
        },
        error => dialog$.showError(`Error saving player profiles: ${error?.message}`)
      );
    }
  }

  export function reset(): ThunkResult<void> {
    return (dispatch) => {
      const db = getDatabase();
      db.delete(
        () => dispatch(actions.resetState()),
        error => dialog$.showError(
          `Error deleting the database: ${error?.message}. Try clearing it manually and refreshing.`
        )
      );
    };
  }

  export function restoreProgress(progressData: string): ThunkResult<void> {
    return (dispatch) => {
      try {
        const stateObj: IUserData = JSON.parse(progressData);

        if (stateObj.version > "1.4" && stateObj.version !== "develop") {

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
          if (stateObj.allyCode !== "") {
            dispatch(Storage.thunks.loadProfile(stateObj.allyCode));
          }

        }
      } catch (e) {
        throw new Error(
          `Unable to process progress file. Is this a template file? If so, use the "load" button below. Error message: ${(e as Error).message}`
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
    return (dispatch, getState: () => IAppState) => {
      const state = getState();
      const db = getDatabase();
      const newProfile = updateFunc(state.profile);

      db.saveProfile(
        newProfile,
        () => {},
        error => dialog$.showFlash(
          "Storage Error",
          `Error saving your progress: ${error?.message} Your progress may be lost on page refresh.`,
          "",
          undefined,
          "error",
        )
      );
      dispatch(Storage.actions.setProfile(newProfile));
      profilesManagement$.profiles.activeAllycode.set(newProfile.allyCode);
      auxiliaryChanges(dispatch, getState, newProfile);
    };
  }
};
