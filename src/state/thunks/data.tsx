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
import type { HUModsMoveProfile, HUProfileCreationData } from "#/containers/Review/Review";
import type { HUFlatMod } from '#/domain/types/ModTypes';
import type * as DTOs from "#/modules/profilesManagement/dtos";
import * as Mappers from "#/modules/profilesManagement/mappers";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";

import { type BaseCharactersById, mapAPI2BaseCharactersById } from "#/domain/BaseCharacter";
import * as Character from "#/domain/Character";
import { Mod } from "#/domain/Mod";
import { createOptimizerSettings } from "#/domain/OptimizerSettings";
import { PlayerProfile } from "#/domain/PlayerProfile";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

// components
import { Button } from "#ui/button";

interface FetchedProfile {
  name: string,
  mods: Mod[],
  playerValues: PlayerValuesByCharacter,
  updated: boolean,
  sessionId?: string,
}

interface FetchedPlayerData {
  baseCharacters: BaseCharactersById;
  profile: FetchedProfile;
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

  function fetchVersion() {
    return fetch(
      "https://api.mods-optimizer.swgoh.grandivory.com/versionapi",
      { method: "POST", body: null, mode: "cors" }
    )
      .then(response => response.text())
      .catch(error => {
        console.error(error);
        throw new Error(
          "Error fetching the current version. Please check to make sure that you are on the latest version"
        );
      });
  }

  function post(url = "", data = {}, extras = {}) {
    return fetch(url, Object.assign({
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors",
    }, extras) as RequestInit)
      .then(
        response => {
          if (response.ok) {
            return response.json();
          }
          return response.text().then(errorText => Promise.reject(new Error(errorText)));
        }
      );
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
   * @param allyCode {string}
   * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
   * @param useHotUtils {boolean} Whether to use mod data from HotUtils in place of swgoh.help
   * @param sessionId {string} A session ID to use with HotUtils, which pulls unequipped mods but
   *                           will log the player out of the game
   * @param useSession {boolean} Whether to use the given sessionId, if one exists. This can be set to false to update the
   *                             profile with the session ID but not actually use it
   * @returns {function(*=): Promise<T | never | never>}
   */
  export function refreshPlayerData(
    allyCode: string,
    keepOldMods: boolean,
    sessionId: string | null,
    useSession = true
  ): ThunkResult<Promise<void>> {
    const cleanedAllyCode = cleanAllyCode(allyCode);
    const data: FetchedPlayerData = {
      baseCharacters: {} as BaseCharactersById,
      profile: {} as FetchedProfile
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
        const huProfile = await fetchProfile(cleanedAllyCode, useSession ? sessionId : null);
        huProfile.sessionId = sessionId ?? '';
        data.profile = huProfile;
        const playerValues = huProfile.playerValues;

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
    allyCode: string,
    fetchData: FetchedPlayerData,
    db: Database,
    keepOldMods: boolean
  ): ThunkResult<Promise<void>> {
    return async (dispatch) => {
      try {
        const dbProfile = await db.getProfile(allyCode);

        const baseProfile = dbProfile !== PlayerProfile.Default ?
          dbProfile.withPlayerName(fetchData.profile.name)
        :
          new PlayerProfile(allyCode, fetchData.profile.name);
        baseProfile.allyCode = allyCode;
        optimizationSettings$.addProfile(allyCode);
        incrementalOptimization$.addProfile(allyCode);

        const sessionId = fetchData.profile.sessionId  ?? baseProfile.hotUtilsSessionId;
        const oldProfile = baseProfile.withHotUtilsSessionId(sessionId);

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
        dispatch(Storage.actions.setProfile(newProfile));
        beginBatch();
        profilesManagement$.addProfile(newProfile);
        profilesManagement$.profiles.activeAllycode.set(newProfile.allyCode);
        endBatch()
        dispatch(thunks.fetchHotUtilsStatus(newProfile.allyCode));

      }
      catch(error)
      {
        const errorMessage = error instanceof DOMException ? error.message : "";
        dialog$.showError(`Error fetching your profile: ${errorMessage} Please try again`);
      }

      return;
    }
  }


  //***********************/
  // HotUtils Integration */
  //***********************/

  function cancelModMove(taskId: number, sessionId: string):ThunkResult<void> {
    return (dispatch) => post(
        "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
        {
          action: "cancelmove",
          sessionId: sessionId,
          payload: {
            taskId: taskId
          }
        }
      )
        .then(response => {
          if (response.errorMessage) {
            dialog$.hide();
            dialog$.showError(response.errorMessage);
          } else {
            switch (response.responseCode) {
              case 0:
                dialog$.hide();
                dialog$.showError(response.responseMessage);
                break;
              default:
                modMoveActive = false;
                dialog$.show(modCancelModal());
              // Any other functionality around cancellation will happen on the next response from `pollForModMoveStatus`
            }
          }
        })
        .catch(error => {
          dialog$.showError(error.message);
        })
  }

  export function createHotUtilsProfile(profile: HUProfileCreationData, sessionId: string):ThunkResult<void> {
    return (dispatch) => {
      isBusy$.set(true);
      return post(
        "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
        {
          action: "createprofile",
          sessionId: sessionId,
          payload: profile
        }
      )
      .then(response => {
        if (response.errorMessage) {
          dialog$.hide();
          dialog$.showError(response.errorMessage);
        } else {
          switch (response.responseCode) {
            case 0:
              dialog$.showError(response.responseMessage);
              break;
            case 1:
              dialog$.hide();
              dialog$.showFlash(
                "Profile created successfully",
                "Please login to HotUtils to manage your new profile",
                "",
                undefined,
                "success",
              );
              break;
            default:
              dialog$.hide();
              dialog$.showError("Unknown response from HotUtils");
              break;
          }
        }
      })
      .catch(error => {
        dialog$.hide();
        dialog$.showError(error.message);
      })
      .finally(() => {
        isBusy$.set(false);
      })
    }
  }

  export function fetchHotUtilsStatus(allyCode: string):ThunkResult<void> {
    const cleanedAllyCode = cleanAllyCode(allyCode);

    return (dispatch) => post(
        "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
        {
          action: "checksubscription",
          payload: {
            allyCode: cleanedAllyCode
          }
        }
      )
        // access codes: 0 = no subscription, 1 = subscription, but no connection, 2 = active subscription
        .then(response => dispatch(Storage.actions.setHotUtilsSubscription(!!response.access)))
        .catch(error => {
          dialog$.showError(error.message);
        })
  }

  /**
   * Fetch a player profile from the API
   * @param allyCode {string} The ally code to request
   * @returns {Promise<T | never>}
   */
  function fetchProfile(allyCode: string, sessionId: string | null) {
    interface IHUProfile {
      allycode: number,
      name: string,
      guild: string,
      mods: HUFlatMod[],
      characters: any,
      updated?: boolean,
    }

    return post(
      "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2/",
      {
        action: "getprofile",
        sessionId: sessionId,
        payload: {
          allyCode: allyCode,
        }
      }
    ).then(response => {
      if (response.errorMessage) {
        throw new Error(response.errorMessage);
      }

      const playerProfile: IHUProfile = response.mods.profiles[0];

      // Convert mods to the serialized format recognized by the optimizer
      const profileMods = playerProfile.mods.map(Mod.fromHotUtils);

      // Convert each character to a PlayerValues object
      const profileValues: PlayerValuesByCharacter = playerProfile.characters.reduce((characters: PlayerValuesByCharacter, character: DTOs.HU.HUPlayerValuesDTO) => {
        characters[character.baseId] = Mappers.HU.HUPlayerValuesMapper.fromHU(character);
        return characters;
      }, {} as PlayerValuesByCharacter);

      return {
        name: playerProfile.name,
        mods: profileMods,
        playerValues: profileValues,
        updated: playerProfile.updated ?? false
      } as FetchedProfile;
    })
  }

  let modMoveActive = false;

  function modCancelModal() {
    return <div>
      <h3>Moving Your Mods...</h3>
      <div className={'h-4 w-64 text-center p-0 my-2 mx-auto'}>
        <p><strong className={'text-red-6'}>Cancelling...</strong></p>
      </div>
      <div className={'actions'}>
        <Button
          type={"button"}
          variant={"destructive"}
          disabled={true}
        >
          Cancel
        </Button>
      </div>
    </div>;
  }

  function modProgressModal(taskId: number, sessionId: string, progress: number, dispatch: ThunkDispatch) {
    return <div>
      <h3>Moving Your Mods...</h3>
      <div className={'progress'}>
        <span className={'progress-bar'} id={"progress-bar"} style={{ width: `${progress}%` }} />
      </div>
      <div className={'actions'}>
        <Button
          type={"button"}
          variant={"destructive"}
          onClick={() => dispatch(cancelModMove(taskId, sessionId))}
        >
          Cancel
        </Button>
      </div>
    </div>;
  }

  export function moveModsWithHotUtils(profile: HUModsMoveProfile, sessionId: string):ThunkResult<void> {
    return (dispatch) => {
      isBusy$.set(true);
      return post(
        "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
        {
          action: "movemods",
          sessionId: sessionId,
          payload: profile
        }
      )
        .then(response => {
          isBusy$.set(false);
          if (response.errorMessage) {
            dialog$.hide();
            dialog$.showError(response.errorMessage);
          } else {
            switch (response.responseCode) {
              case 0:
                dialog$.hide();
                dialog$.showError(response.responseMessage);
                break;
              default:
                if (response.taskId === 0) {
                  dialog$.hide();
                  dialog$.showFlash(
                    "No Action Taken",
                    "There were no mods to move!",
                    "",
                    undefined,
                    "info",
                  )
                } else {
                  modMoveActive = true;
                  // Show the progress modal 'mod-move-progress'
                  dialog$.show(modProgressModal(response.taskId, sessionId, 0, dispatch));
                  // Start polling for udpates
                  return pollForModMoveStatus(response.taskId, sessionId, dispatch);
                }
                break;
            }
          }
        })
        .catch(error => {
          dialog$.hide();
          dialog$.showError(error.message);
        })
        .finally(() => {
          isBusy$.set(false);
        })
    }
  }

  function pollForModMoveStatus(taskId: number, sessionId: string, dispatch: ThunkDispatch) {
    return new Promise((resolve, reject) => {
      post(
        "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
        {
          action: "checkmovestatus",
          sessionId: sessionId,
          payload: {
            taskId: taskId
          }
        }
      ).then(response => {
        if (response.errorMessage) {
          reject(new Error(response.errorMessage))
        } else {
          switch (response.responseCode) {
            case 0:
              reject(new Error(response.responseMessage));
              break;
            default:
              if (!response.running) {
                modMoveActive = false;
                const updatedMods = response.mods.profiles[0].mods.map(Mod.fromHotUtils);
                dispatch(App.thunks.updateProfile(profile => profile.withMods(updatedMods)));

                dialog$.hide();
                if (response.progress.index === response.progress.count) {
                  dialog$.showFlash(
                    "Mods successfully moved",
                    "Your mods have been moved. You may log into Galaxy of Heroes to see your characters.",
                    "",
                    undefined,
                    "success",
                  );
                } else {
                  dialog$.showFlash(
                    "Mod move cancelled",
                    `Your mod move has been cancelled. ${response.progress.index} characters have already been updated.`,
                    "",
                    undefined,
                    "info",
                  );
                }
              } else {
                // Update the modal
                if (modMoveActive) {
                  const progress = 100 * response.progress.index / response.progress.count;
                  // 'mod-move-progress'
                  dialog$.show(modProgressModal(taskId, sessionId, progress, dispatch));
                }
                // If the move is still ongoing, then poll again after a few seconds.
                setTimeout(
                  () => resolve(pollForModMoveStatus(taskId, sessionId, dispatch)),
                  2000
                );
              }
              break;
          }
        }
      }).catch(error => reject(error))
    });
  }

  export function setHotUtilsSessionId(allyCode: string, sessionId: string): ThunkResult<Promise<void>> {
    return async (dispatch) => {
      const db = getDatabase();
      try {
        const profile: PlayerProfile = await db.getProfile(allyCode);
        if (!profile) {
          // If there's no profile to put the Session ID into, then do a pull of data and pass in the session ID
          dispatch(refreshPlayerData(allyCode, false, sessionId, false));
        } else {
          const newProfile = profile.withHotUtilsSessionId(sessionId);
          db.saveProfile(
            newProfile,
            () => {
              dispatch(Storage.actions.setProfile(newProfile));
              profilesManagement$.profiles.activeAllycode.set(newProfile.allyCode);
            },
            error => dialog$.showFlash(
              "Storage Error",
              "Error applying HotUtils session ID to your profile. Please try again.",
              "",
              undefined,
              "error",
            )
          )
        }
      }
      catch (error) {
        dialog$.showError((error as DOMException).message);
      }
    };
  }
}
