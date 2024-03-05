// react
import React from "react";
import { ThunkResult } from "#/state/reducers/modsOptimizer";

// utils
import { mapValues } from "lodash-es";
import groupByKey from "#/utils/groupByKey";
import nothing from "#/utils/nothing";

// state
import getDatabase, { IUserData } from "#/state/storage/Database";

// actions
import { actions } from '#/state/actions/storage';

// modules
import { App } from '#/state/modules/app';
import { Data } from '#/state/modules/data';

// domain
import { BaseCharactersById, BaseCharacter } from '#/domain/BaseCharacter';
import { CharacterTemplate, CharacterTemplates, CharacterTemplatesByName } from "#/domain/CharacterTemplates";
import { Mod } from '#/domain/Mod';
import { OptimizerRun } from "#/domain/OptimizerRun";
import { PlayerNamesByAllycode } from "#/domain/PlayerNamesByAllycode";
import { PlayerProfile } from '#/domain/PlayerProfile';
import { SelectedCharactersByTemplateName } from "#/domain/SelectedCharacters";

export namespace thunks {
  /**
   * Handle setting up everything once the database is ready to use.
   * @param state {Object} The current state of the application, used to populate the database
   * @returns {Function}
   */
  export function databaseReady(allyCode: string): ThunkResult<void> {
    return function (dispatch, getState): void {
      // Load the data from the database and store it in the state
      dispatch(loadFromDb(allyCode));
    };
  }

  /**
   * Remove a mod from a player's profile
   * @param mod {Mod}
   * @returns {Function}
   */
  export function deleteMod(mod: Mod) {
    return App.thunks.updateProfile(
      profile => {
        const oldMods = profile.mods;

        return profile.withMods(oldMods.filter(oldMod => oldMod !== mod));
      },
      function (dispatch, getState) {
        const profile = getState().profile;
        const db = getDatabase();

        db.deleteLastRun(
          profile.allyCode,
          nothing,
          error => dispatch(App.actions.showFlash(
            'Storage Error',
            'Error updating your saved results: ' +
            error!.message +
            ' The optimizer may not recalculate correctly until you fetch data again'
          ))
        );
      }
    );
  }

  /**
   * Remove a set of mods from a player's profile
   * @param mods {Array<Mod>}
   * @returns {Function}
   */
  export function deleteMods(mods: Mod[]) {
    return App.thunks.updateProfile(
      profile => {
        const oldMods = profile.mods;

        return profile.withMods(oldMods.filter(oldMod => !mods.includes(oldMod)));
      },
      function (dispatch, getState) {
        const profile = getState().profile;
        const db = getDatabase();

        db.deleteLastRun(
          profile.allyCode,
          nothing,
          error => dispatch(App.actions.showFlash(
            'Storage Error',
            'Error updating your saved results: ' +
            error?.message +
            ' The optimizer may not recalculate correctly until you fetch data again'
          ))
        );
      }
    )
  }

  export function exportCharacterTemplate(name: string, callback: (template: CharacterTemplate) => void): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.getCharacterTemplate(name,
        callback,
        error => dispatch(App.actions.showError('Error fetching data from the database: ' + error!.message))
      );
    }
  }

  export function exportCharacterTemplates(callback: (templates: CharacterTemplates) => void): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.getCharacterTemplates(
        callback,
        error => dispatch(App.actions.showError('Error fetching data from the database: ' + error?.message))
      );
    }
  }

  /**
   * Export all of the data in the database
   * @param callback {function(Object)}
   * @returns {Function}
   */
  export function exportDatabase(callback: (ud: IUserData) => void):ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.export(
        callback,
        error => dispatch(App.actions.showError('Error fetching data from the database: ' + error?.message))
      );
    };
  }

  /**
   * Load game settings from the database and store them in the state
   * @returns {Function}
   */
  function loadBaseCharacters(): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();

      try {
        db.getBaseCharacters(
          baseCharacters => {
            const baseCharsObject: BaseCharactersById = groupByKey(baseCharacters, baseChar => baseChar.baseID) as BaseCharactersById;
            dispatch(actions.setBaseCharacters(baseCharsObject));
          },
          error =>
            dispatch(App.actions.showFlash(
              'Storage Error',
              'Error reading basic character settings: ' +
              error!.message +
              ' The settings will be restored when you next fetch data.'
            ))
        );
      } catch (e) {
        dispatch(App.actions.showError(
          [
            <p key={1}>
              Unable to load database: {(e as Error).message} Please fix the problem and try again, or ask for help in the
              discord server below.
            </p>,
            <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
              only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
              using one of the supported browsers before asking for help.</p>
          ]
        ));
      }
    }
  }

  export function loadCharacterTemplates(): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();

      try {
        db.getCharacterTemplates(
          (characterTemplates: CharacterTemplates) => {
            const templatesObject: SelectedCharactersByTemplateName = mapValues(
              groupByKey(characterTemplates, template => template.name) as CharacterTemplatesByName,
              ({ selectedCharacters }: CharacterTemplate) => selectedCharacters
            );

            let characterTemplatesKVPs = Object.entries(characterTemplates);
            characterTemplatesKVPs = characterTemplatesKVPs.map(([key, value]) => { return [value.name, value]});
            const characterTemplatesByName = Object.fromEntries(Object.entries(characterTemplates).map(([key, value]) => {return [value.name, value]}));

            dispatch(actions.setCharacterTemplates(characterTemplatesByName));
          },
          error => dispatch(App.actions.showFlash(
            'Storage Error',
            'Error loading character templates: ' + error?.message + '.'
          ))
        );
      } catch (e) {
        dispatch(App.actions.showError(
          [
            <p key={1}>
              Unable to load database: {(e as Error).message} Please fix the problem and try again, or ask for help in the
              discord server below.
            </p>,
            <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
              only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
              using one of the supported browsers before asking for help.</p>
          ]
        ));
      }
    }
  }

  /**
   * Read Game settings and player profiles from the database and load them into the app state
   * @param allyCode
   * @returns {Function}
   */
  export function loadFromDb(allyCode: string): ThunkResult<void> {
    return function (dispatch) {
      dispatch(loadBaseCharacters());
      dispatch(loadProfiles(allyCode));
      dispatch(loadCharacterTemplates());
    };
  }

  /**
   * Load a single player profile from the database and set it in the state
   * @param allyCode {string}
   * @returns {*}
   */
  export function loadProfile(allyCode: string): ThunkResult<Promise<void>> {
    return async function (dispatch) {
      try {
        const db = getDatabase();
        const profile: PlayerProfile = await db.getProfile(allyCode);
        const cleanedSelectedCharacters = profile.selectedCharacters.filter(
          ({ id }) => Object.keys(profile.characters).includes(id)
        );
        const cleanedProfile = profile.withSelectedCharacters(cleanedSelectedCharacters);

        dispatch(actions.setProfile(cleanedProfile));
        dispatch(Data.thunks.fetchHotUtilsStatus(allyCode));
      }
      catch (error) {
        dispatch(App.actions.showError('Error loading your profile from the database: ' + (error as DOMException).message))
      }
    };
  }

  /**
   * Load profiles from the database and store them in the state. Only keep the full profile for the current active
   * ally code. All others only keep the ally code and name
   * @param allyCode
   * @returns {Function}
   */
  export function loadProfiles(allyCode: string | null): ThunkResult<void> {
    return function (dispatch, getState) {
      const db = getDatabase();

      try {
        db.getProfiles(
          (profiles: PlayerProfile[]) => {
            // Clean up profiles to make sure that every selected character actually exists in the profile
            const cleanedProfiles = profiles.map(profile => {
              const cleanedSelectedCharacters =
                profile.selectedCharacters.filter(({ id }) => Object.keys(profile.characters).includes(id));
              return profile.withSelectedCharacters(cleanedSelectedCharacters);
            });

            // Set the active profile
            const profile = allyCode ?
              cleanedProfiles.find(profile => profile.allyCode === allyCode)
            :
              cleanedProfiles.find((profile, index) => index === 0);

            dispatch(actions.setProfile(profile ?? PlayerProfile.Default));
            if (profile !== undefined) {
              dispatch(Data.thunks.fetchHotUtilsStatus(profile.allyCode));
            } else if (Object.keys(getState().playerProfiles).length !== 0) {
                dispatch(App.actions.resetState());
            }
            // Set up the playerProfiles object used to switch between available profiles
            const playerProfiles: PlayerNamesByAllycode = {} as PlayerNamesByAllycode;
            cleanedProfiles.forEach(profile => playerProfiles[profile.allyCode] = profile.playerName);
            dispatch(actions.setPlayerProfiles(playerProfiles));
          },
          error =>
            dispatch(App.actions.showFlash(
              'Storage Error',
              'Error retrieving profiles: ' + error?.message
            ))
        );
      } catch (e) {
        dispatch(App.actions.showError(
          [
            <p key={1}>
              Unable to load database: {(e as Error).message} Please fix the problem and try again, or ask for help in the
              discord server below.
            </p>,
            <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
              only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
              using one of the supported browsers before asking for help.</p>
          ]
        ));
      }
    };
  }

  /**
   * Add new BaseCharacter objects to the database, or update existing ones
   * @param baseCharacters {Array<BaseCharacter>}
   */
  export function saveBaseCharacters(baseCharacters: BaseCharacter[]): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.saveBaseCharacters(
        baseCharacters,
        () => dispatch(loadBaseCharacters()),
        error => dispatch(App.actions.showFlash(
          'Storage Error',
          'Error saving basic character settings: ' +
          error?.message +
          ' The settings will be restored when you next fetch data.'
        ))
      );
    };
  }

  /**
   * Add new Optimizer Runs to the database, or update existing ones.
   * @param lastRuns {Array<OptimizerRun>}
   * @returns {Function}
   */
  export function saveLastRuns(lastRuns: OptimizerRun[]): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.saveLastRuns(
        lastRuns,
        error => dispatch(App.actions.showError(
          'Error saving previous runs: ' + error?.message +
          ' The optimizer may not recalculate all toons properly until you fetch data again.'
        ))
      );
    };
  }

  /**
   * Add new Profiles to the database, or update existing ones.
   * @param profiles {Array<PlayerProfile>}
   * @param allyCode {string}
   * @returns {Function}
   */
  export function saveProfiles(profiles: PlayerProfile[], allyCode: string): ThunkResult<void> {
    return function (dispatch) {
      const db = getDatabase();
      db.saveProfiles(
        profiles,
        () => dispatch(loadProfiles(allyCode)),
        error => dispatch(App.actions.showError(
          'Error saving player profiles: ' + error?.message
        ))
      );
    };
  }
};
