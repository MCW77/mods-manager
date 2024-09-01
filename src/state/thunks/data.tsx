// react
import type { ThunkResult } from "../reducers/modsOptimizer";

// utils
import cleanAllycode from "#/utils/cleanAllycode";
import groupByKey from "#/utils/groupByKey";
import nothing from "#/utils/nothing";
import { mapValues } from "lodash-es";

// state
import getDatabase, { type Database } from "#/state/storage/Database";

import { beginBatch, endBatch } from "@legendapp/state";

import { characters$ } from "#/modules/characters/state/characters";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { Storage } from "#/state/modules/storage";

// domain
import type { CharacterNames } from "#/constants/characterSettings";
import type { FetchedGIMOProfile } from "#/modules/hotUtils/domain/FetchedGIMOProfile";
import type * as DTOs from "#/modules/profilesManagement/dtos";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";
import { createPlayerProfile, type PlayerProfile as LegendPlayerProfile } from "#/modules/profilesManagement/domain/PlayerProfile";

import * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import { PlayerProfile } from "#/domain/PlayerProfile";
import { objectEntries } from "#/utils/objectEntries";

export namespace thunks {
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
		useSession = true,
	): ThunkResult<Promise<void>> {
		const cleanedAllycode = cleanAllycode(allycode);
		let profile: FetchedGIMOProfile ;

		const messages: string[] = [];

		return async (dispatch) => {
			isBusy$.set(true);

			// First, fetch character definitions from swgoh.gg
			try {
				const baseCharacters = await characters$.baseCharactersById();
			} catch (error) {
				messages.push(
					"Error when fetching character definitions from HotUtils. Some characters may not optimize properly until you fetch again.",
				);
				messages.push(`This is an error with an API that the optimizer uses (HotUtils) and NOT
          an error in the optimizer itself. Feel free to discuss it on the
          optimizer\'s discord server, but know that there are no changes that
          can be made to the optimizer to fix this issue.`);
				return;
			}

			// Then, fetch the player's data from HotUtils
			const oldAllycode = profilesManagement$.profiles.activeAllycode.get();
			profilesManagement$.profiles.activeAllycode.set(cleanedAllycode);

			try {
				profile = await hotutils$.fetchProfile(cleanedAllycode);

				// Process all of the data that's been collected

				// If we used a HotUtils session, then the mods returned are all the mods a player has.
				// In this case, don't keep old mods around, even if the box is checked.
				await dispatch(
					updatePlayerData(
						cleanedAllycode,
						oldAllycode,
						profile,
						keepOldMods && !(useSession && sessionId),
					),
				);

				// Show the success and/or error messages
				dispatch(showFetchResult(profile, messages, !!sessionId && useSession));
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Player not found") {
						dialog$.showError(
							"Sorry we couldn't fetch your data from hotutils",
							`Player with allycode ${cleanedAllycode} not found`,
							"Please check the allycode you entered and try again.",
						);
						return;
					}
					dialog$.showError(
						[
							<p key={1}>Sorry we couldn't fetch your data from hotutils</p>,
							<p key={2}>{(error as Error).message}</p>,
						],
						"Internally used hotutils api didn't respond. Maybe your internet connection has a problem or the hotutils server is down.",
						<>
							Please check internet connectivity. If no such problem, you can
							check out the{" "}
							<a
								className={
									"underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
								}
								href="https://discord.com/channels/470702742298689544/591758965335916565"
								target={"_blank"}
								rel="noreferrer"
							>
								hotutils discord
							</a>
							. Maybe hotutils is undergoing maintenance or has a known problem.
							If so retry after maintenance is done or the bug has been fixed."
						</>,
					);
				}
			} finally {
				isBusy$.set(false);
			}

			return;
		};
	}

	/**
	 * Show messages related to the results of the fetch operation
	 *
	 * @param {Object} profile The results of the various API calls to gather player and game data
	 * @param {Array<string>} errorMessages Any errors that should be shown with the results
	 * @param {boolean} usedHotUtils Whether HotUtils' API was used to get up-to-date mods
	 * @param {boolean} usedSession Whether a HotUtils session was used to pull unequipped mods
	 */
	function showFetchResult(
		profile: FetchedGIMOProfile,
		errorMessages: string[],
		usedSession: boolean,
	): ThunkResult<void> {
		return (dispatch) => {
			const fetchResults: JSX.Element[] = [];

			if (errorMessages.length) {
				fetchResults.push(
					<div
						className={"text-[#ff4500] border-b-1 border-solid border-b-white"}
						key={0}
					>
						{errorMessages.map((message, index) => (
							<p key={message}>{message}</p>
						))}
					</div>,
				);
			}

			fetchResults.push(
				<p key={100}>
					Successfully pulled data for{" "}
					<span className={"gold"}>
						{Object.keys(profile.playerValues).length}
					</span>{" "}
					characters and{" "}
					<span className={"gold"}>{profile.mods.length}</span> mods.
				</p>,
			);

			if (!usedSession) {
				fetchResults.push(<hr key={130} />);
				fetchResults.push(
					<h3 key={140}>
						<strong>
							Remember: The optimizer can only pull data for mods that you
							currently have equipped, unless you're pulling data using a
							HotUtils session!
						</strong>
					</h3>,
				);
				fetchResults.push(
					<p key={150}>
						If it looks like you're missing mods, try equipping them on your
						characters and fetching data again.
					</p>,
				);
			}

			optimizerView$.view.set("basic");
			dialog$.showFlash(
				<div className={"fetch-results"}>{fetchResults}</div>,
				"",
				"",
				undefined,
				"success",
			);
		};
	}

	function updatePlayerData(
		newAllycode: string,
		oldAllycode: string,
		profile: FetchedGIMOProfile,
		keepOldMods: boolean,
	): ThunkResult<Promise<void>> {
		return async (dispatch) => {
			try {
				const db = getDatabase();
				const dbProfile = await db.getProfile(newAllycode);
				const oldProfile = dbProfile !== PlayerProfile.Default ? dbProfile : new PlayerProfile(newAllycode);
				oldProfile.allycode = newAllycode;

				if (!profilesManagement$.hasProfileWithAllycode(newAllycode)) {
						const legendProfile = createPlayerProfile(
							newAllycode,
							profile.name,
						);
						profilesManagement$.addProfile(legendProfile);
				}
				optimizationSettings$.addProfile(newAllycode);
				incrementalOptimization$.addProfile(newAllycode);


				// Collect the new character objects by combining the default characters with the player values
				// and the optimizer settings from the current profile.
				beginBatch()
				for (const [id, playerValues] of objectEntries(profile.playerValues)) {
					if (lockedStatus$.ofActivePlayerByCharacterId[id].peek() === undefined)
						lockedStatus$.ofActivePlayerByCharacterId[id].set(false);

					const charactersById$ = profilesManagement$.activeProfile.charactersById;
					if (Object.hasOwn(charactersById$.peek(), id)) {
						charactersById$[id].playerValues.set(playerValues);
					} else {
						charactersById$[id].set(Character.createCharacter(
							id,
							playerValues,
							[],
						));
					}
				}
				profilesManagement$.profiles.lastUpdatedByAllycode[newAllycode].set({ id: newAllycode, lastUpdated: Date.now() });
				endBatch();

				const newMods = groupByKey(profile.mods, (mod) => mod.id);

				// If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
				let finalMods: Mod[];

				if (keepOldMods) {
					// If we're keeping the old mods, that means that any mod we don't see must be unequipped
					const oldMods = oldProfile.mods.reduce(
						(mods: Record<string, Mod>, mod) => {
							mods[mod.id] = mod.unequip();
							return mods;
						},
						{},
					);

					finalMods = Object.values(Object.assign({}, oldMods, newMods));
				} else {
					finalMods = Object.values(newMods);
				}

				const newProfile = oldProfile.withMods(finalMods);

				db.saveProfile(
					newProfile,
					() => {},
					(error) =>
						dialog$.showFlash(
							"Storage Error",
							`Error saving your profile: ${error?.message} Your data may be lost on page refresh.`,
							"",
							undefined,
							"error",
						),
				);
				db.deleteLastRun(newProfile.allycode, nothing, (error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error updating your data: ${error?.message} The optimizer may not recalculate correctly until you fetch again`,
						"",
						undefined,
						"error",
					),
				);
				dispatch(Storage.actions.setProfile(newProfile));
				hotutils$.checkSubscriptionStatus();
			} catch (error) {
				const errorMessage = error instanceof DOMException ? error.message : "";
				profilesManagement$.profiles.activeAllycode.set(oldAllycode);
				dialog$.showError(
					`Error fetching your profile: ${errorMessage} Please try again`,
				);
			}

			return;
		};
	}
}
