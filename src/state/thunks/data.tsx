// react
import type { ThunkDispatch, ThunkResult } from "../reducers/modsOptimizer";

// utils
import cleanAllyCode from "#/utils/cleanAllyCode";
import groupByKey from "#/utils/groupByKey";
import nothing from "#/utils/nothing";
import { mapValues } from "lodash-es";

// state
import getDatabase, { type Database } from "#/state/storage/Database";

import { beginBatch, endBatch } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { App } from '#/state/modules/app';
import { Storage } from '#/state/modules/storage';

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import type { FetchedGIMOProfile } from "#/modules/hotUtils/domain/FetchedGIMOProfile";
import type * as DTOs from "#/modules/profilesManagement/dtos";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";

import { type BaseCharactersById, mapAPI2BaseCharactersById } from "#/domain/BaseCharacter";
import * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import { createOptimizerSettings } from "#/domain/OptimizerSettings";
import { PlayerProfile } from "#/domain/PlayerProfile";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

interface FetchedPlayerData {
  baseCharacters: BaseCharactersById;
  profile: FetchedGIMOProfile;
}


export namespace thunks {
  export function applyRanking(ranking: CharacterNames[]): ThunkResult<void> {
    return App.thunks.updateProfile(profile => {
      const rankedSelectedCharacters: SelectedCharacters = [];
      for (const characterID of ranking) {
        const currentSelectedCharacter = profile.selectedCharacters.find(selectedCharacter => selectedCharacter.id === characterID);
        if (currentSelectedCharacter) {
          rankedSelectedCharacters.push(currentSelectedCharacter);
        }
      }
      return profile.withSelectedCharacters(rankedSelectedCharacters);
    });
  }

  export function checkVersion(): ThunkResult<Promise<string>> {
    return (dispatch: ThunkDispatch) => fetchVersion()
        .then(version => {
          dispatch(processVersion(version));
          return version;
        }).catch(error => {
          dialog$.showError(error.message);
          return '';
        })
  }

  /**
   * Fetch base character data from the swgoh.gg API
   * @returns {Promise<BaseCharactersById>}
   */
  function fetchCharacters(): Promise<BaseCharactersById> {
    return fetch("https://api.mods-optimizer.swgoh.grandivory.com/characters/")
      .then(response => response.json())
      .then((response) => {
        return mapAPI2BaseCharactersById(response.units);
      }).catch();
  }

  /*
  function fetchCharacterStats(characters = null) {
    if (null !== characters) {
      return fetch('https://api.mods-optimizer.swgoh.grandivory.com/stat-calc-data')
        .catch(() => {
          throw new Error('The game data used to calculate character stats is currently being rebuilt. ' +
            'Please wait 60 seconds and try again')
        })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            response.text().then(text => { throw new Error(text) })
          }
        })
        .then(statCalculatorData => {
          const eng_us = require('../../constants/statCalculatorEng_us.json');
          swgohStatCalc.setGameData(statCalculatorData);

          const characterData = Object.keys(characters).map(charID => ({
            'defId': charID,
            'rarity': characters[charID].stars,
            'level': characters[charID].level,
            'gear': characters[charID].gearLevel,
            'equipped': characters[charID].gearPieces.map(id => ({ 'equipmentId': id })),
            'relic': {
              'currentTier': characters[charID].relicTier
            }
          }));

          swgohStatCalc.calcRosterStats(characterData, { withoutModCalc: true, language: eng_us });

          return characterData;
        })
    } else {
      return Promise.resolve(null);
    }
  }
  */

  async function fetchVersion() {
    try {
      const response = await fetch(
        "https://api.mods-optimizer.swgoh.grandivory.com/versionapi",
        { method: "POST", body: null, mode: "cors" }
      );
      return await response.text();
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error fetching the current version. Please check to make sure that you are on the latest version"
      );
    }
  }

  function processVersion(version: string): ThunkResult<void> {
    return (dispatch, getState) => {
      const state = getState();

      if (state.version !== version) {
        dialog$.showFlash(
          `Newer version available:
          Newest version: ${version}
          Your version: ${state.version}`,
          "",
          "Get new version",
          () => window.location.assign(`${location.href}?reload=${Date.now()}`),
          "warning",
        );
      }
    }
  }

  /**
   * Collect all the information needed for the optimizer for a player
   * @param allycode {string}
   * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
   * @param useHotUtils {boolean} Whether to use mod data from HotUtils in place of swgoh.help
   * @param sessionId {string} A session ID to use with HotUtils, which pulls unequipped mods but
   *                           will log the player out of the game
   * @param useSession {boolean} Whether to use the given sessionId, if one exists. This can be set to false to update the
   *                             profile with the session ID but not actually use it
   * @returns {function(*=): Promise<T | never | never>}
   */
  export function refreshPlayerData(
    allycode: string,
    keepOldMods: boolean,
    sessionId: string | null,
    useSession = true
  ): ThunkResult<Promise<void>> {
    const cleanedAllyCode = cleanAllyCode(allycode);
    const data: FetchedPlayerData = {
      baseCharacters: {} as BaseCharactersById,
      profile: {} as FetchedGIMOProfile
    };

    const messages: string[] = [];

    return async (dispatch) => {
      isBusy$.set(true);

      // First, fetch character definitions from swgoh.gg
      try {
        const baseCharacters = await fetchCharacters();
        data.baseCharacters = baseCharacters;
      }
      catch (error) {
        messages.push("Error when fetching character definitions from HotUtils. Some characters may not optimize properly until you fetch again."
        );
        messages.push(`This is an error with an API that the optimizer uses (HotUtils) and NOT
          an error in the optimizer itself. Feel free to discuss it on the
          optimizer\'s discord server, but know that there are no changes that
          can be made to the optimizer to fix this issue.`
        );
        return;
      }

      // Then, fetch the player's data from HotUtils
      try {
        const huProfile = await hotutils$.fetchProfile(cleanedAllyCode);
        data.profile = huProfile;

        // Process all of the data that's been collected
        const db = getDatabase();
        if (data.baseCharacters) {
          await dispatch(Storage.actions.setBaseCharacters(data.baseCharacters));
          db.saveBaseCharacters(
            Object.values(data.baseCharacters),
            nothing,
            error => dialog$.showFlash(
              "Storage Error",
              `Error saving base character settings: ${error?.message} The optimizer may not function properly for all characters until you fetch again`,
              "",
              undefined,
              "error",
            )
          )
        }

        // If we used a HotUtils session, then the mods returned are all the mods a player has.
        // In this case, don't keep old mods around, even if the box is checked.
        await dispatch(updatePlayerData(cleanedAllyCode, data, db, keepOldMods && !(useSession && sessionId)));

        // Show the success and/or error messages
        dispatch(showFetchResult(data, messages, !!sessionId && useSession));
      }
      catch(error) {
        dialog$.showError(
          [
            <p key={1}>Sorry we couldn't fetch your data from hotutils</p>,
            <p key={2}>{(error as Error).message}</p>,
          ],
          "Internally used hotutils api didn't respond. Maybe your internet connection has a problem or the hotutils server is down.",
          <>Please check internet connectivity. If no such problem, you can check out the <a className={"underline text-blue-600 hover:text-blue-800 visited:text-purple-600"} href="https://discord.com/channels/470702742298689544/591758965335916565" target={"_blank"} rel="noreferrer">hotutils discord</a>. Maybe hotutils is undergoing maintenance or has a known problem. If so retry after maintenance is done or the bug has been fixed."</>,
        );
      }
      finally {
        isBusy$.set(false);
      };

      return;
    }
  }

  /**
   * Show messages related to the results of the fetch operation
   *
   * @param {Object} fetchData The results of the various API calls to gather player and game data
   * @param {Array<string>} errorMessages Any errors that should be shown with the results
   * @param {boolean} usedHotUtils Whether HotUtils' API was used to get up-to-date mods
   * @param {boolean} usedSession Whether a HotUtils session was used to pull unequipped mods
   */
  function showFetchResult(fetchData: FetchedPlayerData, errorMessages: string[], usedSession: boolean): ThunkResult<void> {
    return (dispatch) => {
      const fetchResults: JSX.Element[] = [];

      if (errorMessages.length) {
        fetchResults.push(
          <div className={'text-[#ff4500] border-b-1 border-solid border-b-white'} key={0}>
            {errorMessages.map((message, index) => <p key={message}>{message}</p>)}
          </div>
        );
      }

      fetchResults.push(
        <p key={100}>
          Successfully pulled data for <span className={'gold'}>{Object.keys(fetchData.profile.playerValues).length}
          </span> characters and <span className={'gold'}>{fetchData.profile.mods.length}</span> mods.
        </p>
      );

      if (!usedSession) {
        fetchResults.push(<hr key={130} />);
        fetchResults.push(
          <h3 key={140}><strong>
            Remember: The optimizer can only pull data for mods that you currently have equipped, unless you're pulling
            data using a HotUtils session!
          </strong></h3>
        );
        fetchResults.push(
          <p key={150}>
            If it looks like you're missing mods, try equipping them on your characters and fetching data again.
          </p>
        );
      }

      optimizerView$.view.set("basic");
      dialog$.showFlash(
        <div className={'fetch-results'}>
          {fetchResults}
        </div>,
        "",
        "",
        undefined,
        "success",
      );
    }
  }

  function updatePlayerData(
    allycode: string,
    fetchData: FetchedPlayerData,
    db: Database,
    keepOldMods: boolean
  ): ThunkResult<Promise<void>> {
    return async (dispatch) => {
      try {
        const dbProfile = await db.getProfile(allycode);

        const oldProfile = dbProfile !== PlayerProfile.Default ?
          dbProfile.withPlayerName(fetchData.profile.name)
        :
          new PlayerProfile(allycode, fetchData.profile.name);
        oldProfile.allyCode = allycode;
        optimizationSettings$.addProfile(allycode);
        incrementalOptimization$.addProfile(allycode);


        // Collect the new character objects by combining the default characters with the player values
        // and the optimizer settings from the current profile.
        const newCharacters = mapValues<PlayerValuesByCharacter, Character.Character>(fetchData.profile.playerValues, (playerValues: DTOs.GIMO.PlayerValuesDTO, id: string):Character.Character => {
          const Id: CharacterNames = id as CharacterNames;
          if (Object.hasOwn(oldProfile.characters, Id)) {
            return Character.withOptimizerSettings(
              Character.withPlayerValues(oldProfile.characters[Id], playerValues),
              oldProfile.characters[Id].optimizerSettings
            );
          }
            return (Character.createCharacter(
              Id,
              playerValues,
              createOptimizerSettings(
                [],
                fetchData.baseCharacters[Id]?.categories.includes("Crew Member") ? 5 : 1,
                false,
              )
            ))
        });

        const newMods = groupByKey(fetchData.profile.mods, mod => mod.id);

        // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
        let finalMods: Mod[];

        if (keepOldMods) {
          // If we're keeping the old mods, that means that any mod we don't see must be unequipped
          const oldMods = oldProfile.mods.reduce((mods: Record<string, Mod>, mod) => {
            mods[mod.id] = mod.unequip();
            return mods;
          }, {});

          finalMods = Object.values(Object.assign({}, oldMods, newMods));
        } else {
          finalMods = Object.values(newMods);
        }

        const newProfile = oldProfile.withCharacters(newCharacters).withMods(finalMods);
        db.saveProfile(
          newProfile,
          () => {},
          error => dialog$.showFlash(
            "Storage Error",
            `Error saving your profile: ${error?.message} Your data may be lost on page refresh.`,
            "",
            undefined,
            "error",
          )
        );
        db.deleteLastRun(
          newProfile.allyCode,
          nothing,
          error => dialog$.showFlash(
            "Storage Error",
            `Error updating your data: ${error?.message} The optimizer may not recalculate correctly until you fetch again`,
            "",
            undefined,
            "error",
          )
        );
        if (newProfile.allyCode) profilesManagement$.profiles.activeAllycode.set(newProfile.allyCode);
        dispatch(Storage.actions.setProfile(newProfile));
        beginBatch();
        profilesManagement$.addProfile(newProfile);
        profilesManagement$.profiles.activeAllycode.set(newProfile.allyCode);
        endBatch()
        hotutils$.checkSubscriptionStatus();
//        dispatch(thunks.fetchHotUtilsStatus(newProfile.allyCode));

      }
      catch(error)
      {
        const errorMessage = error instanceof DOMException ? error.message : "";
        dialog$.showError(`Error fetching your profile: ${errorMessage} Please try again`);
      }

      return;
    }
  }
}
