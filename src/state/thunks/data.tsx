// react
import React from "react";
import { ThunkDispatch, ThunkResult } from "../reducers/modsOptimizer";

// utils
import cleanAllyCode from "../../utils/cleanAllyCode";
import groupByKey from "../../utils/groupByKey";
import nothing from "../../utils/nothing";
import { mapValues } from "lodash-es";
import { Dictionary } from "lodash";

// state
import getDatabase, { Database } from "../storage/Database";

// actions
import {
  hideFlash,
  hideModal,
  setIsBusy,
  showError,
  showFlash,
  showModal,
} from "../actions/app";
import {
  changeOptimizerView,
} from "../actions/review";
import {
  addPlayerProfile,
  setBaseCharacters,
  setHotUtilsSubscription,
  setProfile,
} from "../actions/storage";

// thunks
import {
  updateProfile,
} from '../thunks/app';

// domain
import { characterSettings, CharacterNames } from "../../constants/characterSettings";
import { HUModsMoveProfile, HUProfileCreationData } from "../../containers/Review/Review";
import { HUFlatMod } from '../../domain/types/ModTypes';
import * as DTOs from "../../modules/profilesManagement/dtos";
import * as Mappers from "../../modules/profilesManagement/mappers";
import { PlayerValuesByCharacter } from "../../modules/profilesManagement/domain/PlayerValues";

import { BaseCharactersById, mapAPI2BaseCharactersById } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";
import { CharacterListGenerationParameters } from "../../domain/CharacterListGenerationParameters";
import { Mod } from "../../domain/Mod";
import { OptimizationPlan } from "../../domain/OptimizationPlan";
import { OptimizerSettings } from "../../domain/OptimizerSettings";
import { PlayerProfile } from "../../domain/PlayerProfile";
import { UseCaseModes } from "../../domain/UseCaseModes";


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


function applyCharacterList(overwrite: boolean, characterList: CharacterNames[]) {
  return updateProfile(profile => {
    const startingList = overwrite ? [] : profile!.selectedCharacters;
    const startingCharacterIDs = startingList.map(selectedCharacter => selectedCharacter.id)
    const charactersToApply = characterList.filter(characterID => !startingCharacterIDs.includes(characterID))

    const newSelectedCharacters = startingList.concat(
      charactersToApply.map(characterID => {
        const character = profile.characters[characterID]

        return character ?
          { id: characterID, target: character.defaultTarget() } :
          null
      }).filter(x => null !== x) as {
        id: CharacterNames,
        target: OptimizationPlan  
      }[]
    )

    return profile.withSelectedCharacters(newSelectedCharacters)
  })
}

export function checkVersion(): ThunkResult<Promise<string>> {
  return function (dispatch: ThunkDispatch) {
    return fetchVersion()
      .then(version => {
        dispatch(processVersion(version));
        return version;
      }).catch(error => {
        dispatch(hideFlash());
        dispatch(showError(error.message));
        return '';
      });
  }
}

export function fetchCharacterList(
  mode: UseCaseModes,
  overwrite: boolean,
  allyCode: string,
  parameters: CharacterListGenerationParameters,
): ThunkResult<void> {
  return function (dispatch) {
    dispatch(setIsBusy(true))

    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/characterlist',
      {
        allyCode: allyCode,
        mode: mode,
        parameters: parameters,
      }
    )
      .then((characterList: CharacterNames[]) => dispatch(applyCharacterList(overwrite, characterList)))
      .catch(error => {
        dispatch(showError(error.message))
      })
      .finally(() => dispatch(setIsBusy(false)))
  }
}

/**
 * Fetch base character data from the swgoh.gg API
 * @returns {Promise<BaseCharactersById>}
 */
 function fetchCharacters(): Promise<BaseCharactersById> {
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .then((response) => {
     
      return mapAPI2BaseCharactersById(response.units)
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
    'https://api.mods-optimizer.swgoh.grandivory.com/versionapi',
    { method: 'POST', body: null, mode: 'cors' }
  )
    .then(response => response.text())
    .catch(error => {
      console.error(error);
      throw new Error(
        'Error fetching the current version. Please check to make sure that you are on the latest version'
      );
    });
}

function post(url = '', data = {}, extras = {}) {
  return fetch(url, Object.assign({
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    mode: "cors",
  }, extras) as RequestInit)
    .then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(errorText => Promise.reject(new Error(errorText)));
        }
      }
    );
}

function processVersion(version: string): ThunkResult<void> {
  return function (dispatch, getState) {
    const state = getState();

    if (state.version !== version) {
      dispatch(showFlash(
        'Version out-of-date!',
        [
          <p key={1}>
            The mods optimizer has been updated to version <strong>{version}</strong>.
            You're currently running version <strong>{state.version}</strong>
          </p>,
          <p key={2}>Please clear your cache and refresh to get the latest version.</p>
        ]
      ));
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
  useSession: boolean = true
): ThunkResult<Promise<void>> {
  const cleanedAllyCode = cleanAllyCode(allyCode);
  let data: FetchedPlayerData = {
    baseCharacters: {} as BaseCharactersById,
    profile: {} as FetchedProfile
  };

  const messages: string[] = [];

  return async function (dispatch) {
    await dispatch(setIsBusy(true));

    // First, fetch character definitions from swgoh.gg
    try {
      const baseCharacters = await fetchCharacters();
      data.baseCharacters = baseCharacters;
    }
    catch (error) {
      messages.push('Error when fetching character definitions from HotUtils. ' +
        'Some characters may not optimize properly until you fetch again.'
      );
      messages.push('This is an error with an API that the optimizer uses (HotUtils) and NOT ' +
        'an error in the optimizer itself. Feel free to discuss it on the ' +
        'optimizer\'s discord server, but know that there are no changes that ' +
        'can be made to the optimizer to fix this issue.'
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
        await dispatch(setBaseCharacters(data.baseCharacters));
        db.saveBaseCharacters(
          Object.values(data.baseCharacters),
          nothing,
          error => dispatch(showFlash(
            'Storage Error',
            'Error saving base character settings: ' +
            error?.message +
            ' The optimizer may not function properly for all characters'
          ))
        )
      }

      // If we used a HotUtils session, then the mods returned are all the mods a player has.
      // In this case, don't keep old mods around, even if the box is checked.
      await dispatch(updatePlayerData(cleanedAllyCode, data, db, keepOldMods && !(useSession && sessionId)));

      // Show the success and/or error messages
      dispatch(showFetchResult(data, messages, !!sessionId && useSession));
    }
    catch(error) {
      dispatch(showError(
        [
          <p key={1}>{(error as Error).message}</p>,
          <p key={2}>
            This is an error with an API that the optimizer uses, and not a problem with the optimizer itself. Feel
            free to discuss this error on the optimizer discord, but know that there are no changes that can be made
            to the optimizer to fix this issue.
          </p>
        ]
      ));
    }
    finally {
      dispatch(setIsBusy(false));
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
  return function (dispatch) {
    const fetchResults: JSX.Element[] = [];

    if (errorMessages.length) {
      fetchResults.push(
        <div className={'errors'} key={0}>
          {errorMessages.map((message, index) => <p key={index}>{message}</p>)}
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

    dispatch(changeOptimizerView('edit'));
    dispatch(showFlash(
      'Success!',
      <div className={'fetch-results'}>
        {fetchResults}
      </div>
    ));
  }
}

function updatePlayerData(
  allyCode: string,
  fetchData: FetchedPlayerData,
  db: Database,
  keepOldMods: boolean
): ThunkResult<Promise<void>> {
  return async function (dispatch) {
    try {
      let dbProfile = await db.getProfile(allyCode);

      const baseProfile = dbProfile !== PlayerProfile.Default ?
        dbProfile.withPlayerName(fetchData.profile.name)
      :
        new PlayerProfile(allyCode, fetchData.profile.name);
      baseProfile.allyCode = allyCode;      

      const sessionId = fetchData.profile.sessionId  ?? baseProfile.hotUtilsSessionId;
      const oldProfile = baseProfile.withHotUtilsSessionId(sessionId);

      // Collect the new character objects by combining the default characters with the player values
      // and the optimizer settings from the current profile.
      const newCharacters = mapValues<PlayerValuesByCharacter, Character>(fetchData.profile.playerValues, (playerValues: DTOs.GIMO.PlayerValuesDTO, id: string):Character => {
        const Id: CharacterNames = id as CharacterNames;
        if (oldProfile.characters.hasOwnProperty(Id)) {
          return oldProfile.characters[Id]
            .withPlayerValues(playerValues)
            .withOptimizerSettings(oldProfile.characters[Id].optimizerSettings);
        } else {
          return (new Character(
            Id,
            playerValues,
            new OptimizerSettings(
              characterSettings[Id] ? characterSettings[Id].targets[0] : new OptimizationPlan('xyz'),
              [],
              fetchData.baseCharacters[Id] && fetchData.baseCharacters[Id].categories.includes('Crew Member') ? 5 : 1,
              false,
              false
            )
          ))
        }
      });

      const newMods = groupByKey(fetchData.profile.mods, mod => mod.id);

      // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
      let finalMods;

      if (keepOldMods) {
        // If we're keeping the old mods, that means that any mod we don't see must be unequipped
        const oldMods = oldProfile.mods.reduce((mods: Dictionary<Mod>, mod) => {
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
        error => dispatch(showFlash(
          'Storage Error',
          'Error saving your profile: ' + error!.message + ' Your data may be lost on page refresh.'
        ))
      );
      db.deleteLastRun(
        newProfile.allyCode,
        nothing,
        error => dispatch(showFlash(
          'Storage Error',
          'Error updating your data: ' +
          error!.message +
          ' The optimizer may not recalculate correctly until you fetch again'
        ))
      );
      dispatch(addPlayerProfile(newProfile));
      dispatch(setProfile(newProfile));
      dispatch(fetchHotUtilsStatus(newProfile.allyCode));

    } 
    catch(error)
    {
      const errorMessage = error instanceof DOMException ? error.message : '';
      dispatch(showError(`Error fetching your profile: ${errorMessage} Please try again`));
    }

    return;
  }
}


//***********************/
// HotUtils Integration */
//***********************/

function cancelModMove(taskId: number, sessionId: string):ThunkResult<void> {
  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'cancelmove',
        'sessionId': sessionId,
        'payload': {
          'taskId': taskId
        }
      }
    )
      .then(response => {
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(hideModal());
              dispatch(showError(response.responseMessage));
              break;
            default:
              modMoveActive = false;
              dispatch(showModal(
                'cancel-mod-move',
                modCancelModal()
              ))
            // Any other functionality around cancellation will happen on the next response from `pollForModMoveStatus`
          }
        }
      })
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

export function createHotUtilsProfile(profile: HUProfileCreationData, sessionId: string):ThunkResult<void> {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'createprofile',
        'sessionId': sessionId,
        'payload': profile
      }
    )
    .then(response => {
      if (response.errorMessage) {
        dispatch(hideModal());
        dispatch(showError(response.errorMessage));
      } else {
        switch (response.responseCode) {
          case 0:
            dispatch(showError(response.responseMessage));
            break;
          case 1:
            dispatch(hideModal());
            dispatch(showFlash('Profile created successfully', 'Please login to HotUtils to manage your new profile'))
            break;
          default:
            dispatch(hideModal());
            dispatch(showError('Unknown response from HotUtils'));
            break;
        }
      }
    })
    .catch(error => {
      dispatch(hideModal());
      dispatch(showError(error.message));
    })
    .finally(() => {
      dispatch(setIsBusy(false));
    })
  }
function cancelModMove(taskId: number, sessionId: string):ThunkResult<void> {
  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'cancelmove',
        'sessionId': sessionId,
        'payload': {
          'taskId': taskId
        }
      }
    )
      .then(response => {
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(hideModal());
              dispatch(showError(response.responseMessage));
              break;
            default:
              modMoveActive = false;
              dispatch(showModal(
                'cancel-mod-move',
                modCancelModal()
              ))
            // Any other functionality around cancellation will happen on the next response from `pollForModMoveStatus`
          }
        }
      })
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

}

export function fetchHotUtilsStatus(allyCode: string):ThunkResult<void> {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'checksubscription',
        'payload': {
          'allyCode': cleanedAllyCode
        }
      }
    )
      // access codes: 0 = no subscription, 1 = subscription, but no connection, 2 = active subscription    
      .then(response => dispatch(setHotUtilsSubscription(!!response.access)))
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
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
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2/',
    {
      'action': 'getprofile',
      'sessionId': sessionId,      
      'payload': {
        'allyCode': allyCode,
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

var modMoveActive = false;

function modCancelModal() {
  return <div>
    <h3>Moving Your Mods...</h3>
    <div className={'canceling'}>
      <p><strong className={'red-text'}>Cancelling...</strong></p>
    </div>
    <div className={'actions'}>
      <button type={'button'} className={'red'} disabled={true}>Cancel</button>
    </div>
  </div>;
}

function modProgressModal(taskId: number, sessionId: string, progress: number, dispatch: ThunkDispatch) {
  return <div>
    <h3>Moving Your Mods...</h3>
    <div className={'progress'}>
      <span className={'progress-bar'} id={'progress-bar'} style={{ width: `${progress}%` }} />
    </div>
    <div className={'actions'}>
      <button type={'button'} className={'red'} onClick={() => dispatch(cancelModMove(taskId, sessionId))}>Cancel</button>
    </div>
  </div>;
}

export function moveModsWithHotUtils(profile: HUModsMoveProfile, sessionId: string):ThunkResult<void> {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'movemods',
        'sessionId': sessionId,
        'payload': profile
      }
    )
      .then(response => {
        dispatch(setIsBusy(false));
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(hideModal());
              dispatch(showError(response.responseMessage));
              break;
            default:
              if (response.taskId === 0) {
                dispatch(hideModal());
                dispatch(showFlash(
                  "No Action Taken",
                  "There were no mods to move!"
                ))
              } else {
                modMoveActive = true;
                // Show the progress modal
                dispatch(showModal(
                  'mod-move-progress',
                  modProgressModal(response.taskId, sessionId, 0, dispatch)
                ));
                // Start polling for udpates
                return pollForModMoveStatus(response.taskId, sessionId, dispatch);
              }
              break;
          }
        }
      })
      .catch(error => {
        dispatch(hideModal());
        dispatch(showError(error.message));
      })
      .finally(() => {
        dispatch(setIsBusy(false));
      })
  }
}

function pollForModMoveStatus(taskId: number, sessionId: string, dispatch: ThunkDispatch) {
  return new Promise((resolve, reject) => {
    post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'checkmovestatus',
        'sessionId': sessionId,        
        'payload': {
          'taskId': taskId
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
              dispatch(updateProfile(profile => profile.withMods(updatedMods)));

              dispatch(hideModal());
              if (response.progress.index === response.progress.count) {
                dispatch(showFlash(
                  'Mods successfully moved',
                  'Your mods have been moved. You may log into Galaxy of Heroes to see your characters.'
                ));
              } else {
                dispatch(showFlash(
                  'Mod move cancelled',
                  'Your mod move has been cancelled. ' + response.progress.index + ' characters have already been updated.'
                ));
              }
            } else {
              // Update the modal
              if (modMoveActive) {
                const progress = 100 * response.progress.index / response.progress.count;
                dispatch(showModal(
                  'mod-move-progress',
                  modProgressModal(taskId, sessionId, progress, dispatch)
                ))
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
  return async function (dispatch) {
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
          () => dispatch(setProfile(newProfile)),
          error => dispatch(showFlash(
            'Storage Error',
            'Error applying HotUtils session ID to your profile. Please try again.'
          ))
        )
      }
    }
    catch (error) {
      dispatch(showError((error as DOMException).message));
    }
  };
}

