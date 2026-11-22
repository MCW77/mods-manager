// utils
import cleanAllycode from "#/utils/cleanAllycode";
import { objectEntries } from "#/utils/objectEntries";

// state
import { beginBatch, endBatch, Observable, when } from "@legendapp/state";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const characters$ = stateLoader$.characters$;
const compilations$ = stateLoader$.compilations$;
const currencies$ = stateLoader$.currencies$;
const datacrons$ = stateLoader$.datacrons$;
const defaultCompilation$ = stateLoader$.defaultCompilation$;
const hotutils$ = stateLoader$.hotutils$;
const materials$ = stateLoader$.materials$;
const mods$ = stateLoader$.mods$;
const profilesManagement$ = stateLoader$.profilesManagement$;
const roster$ = stateLoader$.roster$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// domain
import { Compilation } from "#/modules/compilations/domain/Compilation";
import type { FetchedFullGIMOProfile } from "#/modules/hotUtils/domain/FetchedFullGIMOProfile";
import type { FetchedGIMOProfile } from "#/modules/hotUtils/domain/FetchedGIMOProfile";
import type { ModById } from "#/modules/mods/domain/Mods";

import * as Character from "#/domain/Character";
import { cloneMod, type Mod } from "#/domain/Mod";
import { characterSettings } from "../../constants/characterSettings";
import { OptimizationPlan } from "../../domain/OptimizationPlan";

function isValidCompilation(
  compilation$: Observable<Compilation> | Observable<Compilation | undefined>,
): compilation$ is Observable<Compilation> {
  return compilation$.peek() !== undefined;
}
function updateTargetInCompilation(
  compilation$: Observable<Compilation>,
  characterId: string,
  newTarget: OptimizationPlan,
) {
  const selectedCharacter$ = compilation$.selectedCharacters.find(
    (sc) => sc.id.peek() === characterId,
  );
  if (selectedCharacter$ !== undefined) {
    selectedCharacter$.target.set(newTarget);
  }
}
function updateTarget(characterId: string, newTarget: OptimizationPlan) {
  updateTargetInCompilation(defaultCompilation$.data, characterId, newTarget);
  for (const [id] of compilations$.compilationByIdForActiveAllycode.peek()) {
    const compilation$ = compilations$.compilationByIdForActiveAllycode[id];
    if (isValidCompilation(compilation$)) {
      updateTargetInCompilation(compilation$, characterId, newTarget);
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
export async function refreshPlayerData(
  allycode: string,
  keepOldMods: boolean,
  sessionId: string | null,
  useSession = true,
): Promise<void> {
  const cleanedAllycode = cleanAllycode(allycode);
  let profile: FetchedGIMOProfile;
  let fullProfile: FetchedFullGIMOProfile;
  const messages: string[] = [];
  isBusy$.set(true);
  hotutils$.checkSubscriptionStatus();

  // First, fetch character definitions
  try {
    await when(characters$.fetchBaseCharacters());
    const baseCharacterById = characters$.baseCharacterById.peek();
    for (const [characterId, baseCharacter] of Object.entries(baseCharacterById)) {
      if (baseCharacter !== undefined && baseCharacter.target !== null) {
        const settingsOfCharacter = characterSettings[characterId];
        if (settingsOfCharacter !== undefined) {
          let huMetaTarget = settingsOfCharacter.targets.find(
            (target) => target.id === baseCharacter.target?.id,
          );
          if (huMetaTarget === undefined) {
            settingsOfCharacter.targets.push(baseCharacter.target);
          } else {
            huMetaTarget = baseCharacter.target;
            updateTarget(characterId, huMetaTarget);
          }
        }
      }
    }
  } catch (_error) {
    if (_error instanceof Error) {
      const causes = [];
      let currentError: Error | undefined = _error;
      while (Object.hasOwn(currentError, "cause") && currentError.cause instanceof Error) {
        causes.push(currentError.message);
        currentError = currentError.cause as Error;
      }
      causes.push(currentError.cause?.toString() ?? "Unknown error");
      dialog$.showError({
        error: _error.message,
        reason: (
          <>
            <p>
              This is an error with the HotUtils API that the optimizer uses and NOT an error in the
              optimizer itself.
            </p>
            <details>
              <summary>Errors:</summary>
              <ul>
                {causes.map((cause, index) => {
                  const key = `error-cause-${index}`;
                  return <li key={key}>{cause}</li>;
                })}
              </ul>
            </details>
            <details>
              <summary>Stacktrace: </summary>
              {_error.stack}
            </details>
          </>
        ),
        solution:
          "You can check out the HotUtils discord server to see if this is a known issue or if they are undergoing maintenance.",
      });
      return;
    }
  }

  // Then, fetch the player's data from HotUtils
  try {
    [profile, fullProfile] = await Promise.all([
      hotutils$.fetchProfile(cleanedAllycode),
      hotutils$.fetchFullProfile(cleanedAllycode),
    ]);

    // Process all of the data that's been collected

    // If we used a HotUtils session, then the mods returned are all the mods a player has.
    // In this case, don't keep old mods around, even if the box is checked.
    updatePlayerData(
      cleanedAllycode,
      profile,
      fullProfile,
      keepOldMods && !(useSession && sessionId),
    );
    // Show the success and/or error messages
    showFetchResult(profile, messages, !!sessionId && useSession);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Player not found") {
        dialog$.showError({
          error: "Sorry we couldn't fetch your data from hotutils",
          reason: `Player with allycode ${cleanedAllycode} not found`,
          solution: "Please check the allycode you entered and try again.",
        });
        return;
      }
      dialog$.showError({
        error: [
          <p key={1}>Sorry we couldn't fetch your data from hotutils</p>,
          <p key={2}>{(error as Error).message}</p>,
        ],
        reason:
          "Internally used hotutils api didn't respond. Maybe your internet connection has a problem or the hotutils server is down.",
        solution: (
          <>
            Please check internet connectivity. If no such problem, you can check out the{" "}
            <a
              className={"underline text-blue-600 hover:text-blue-800 visited:text-purple-600"}
              href="https://discord.com/channels/470702742298689544/591758965335916565"
              target={"_blank"}
              rel="noreferrer"
            >
              hotutils discord
            </a>
            . Maybe hotutils is undergoing maintenance or has a known problem. If so retry after
            maintenance is done or the bug has been fixed."
          </>
        ),
      });
    }
  } finally {
    isBusy$.set(false);
  }
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
): void {
  const fetchResults: React.JSX.Element[] = [];

  if (errorMessages.length) {
    fetchResults.push(
      <div className={"text-[#ff4500] border-b-1 border-solid border-b-white"} key={0}>
        {errorMessages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>,
    );
  }

  fetchResults.push(
    <p key={100}>
      Successfully pulled data for{" "}
      <span className={"text-mod-gold"}>{Object.keys(profile.playerValues).length}</span> characters
      and <span className={"text-mod-gold"}>{profile.mods.length}</span> mods.
    </p>,
  );

  if (!usedSession) {
    fetchResults.push(<hr key={130} />);
    fetchResults.push(
      <h3 key={140}>
        <strong>
          Remember: The optimizer can only pull data for mods that you currently have equipped,
          unless you're pulling data using a HotUtils session!
        </strong>
      </h3>,
    );
    fetchResults.push(
      <p key={150}>
        If it looks like you're missing mods, try equipping them on your characters and fetching
        data again.
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
}

function updatePlayerData(
  newAllycode: string,
  profile: FetchedGIMOProfile,
  fullProfile: FetchedFullGIMOProfile,
  keepOldMods: boolean,
): void {
  try {
    profilesManagement$.addProfile(newAllycode, profile.name);
    beginBatch();

    // Collect the new character objects by combining the default characters with the player values
    // and the optimizer settings from the current profile.
    for (const [characterId, playerValues] of objectEntries(profile.playerValues)) {
      const characterById$ = roster$.characterByIdByAllycode[newAllycode].characterById;
      let omis: string[] = [];
      let zetas: string[] = [];
      if (fullProfile?.units?.units) {
        const fullUnit = fullProfile.units.units.find((unit) => unit.baseId === characterId);
        if (fullUnit) {
          omis = fullUnit.omis === null ? [] : fullUnit.omis;
          zetas = fullUnit.zetas === null ? [] : fullUnit.zetas;
        }
      }
      if (Object.hasOwn(characterById$.peek(), characterId)) {
        characterById$[characterId].playerValues.set(playerValues);
        if (fullProfile?.units?.units) {
          characterById$[characterId].omis.set(omis);
          characterById$[characterId].zetas.set(zetas);
        }
      } else {
        characterById$[characterId].set(
          Character.createCharacter(characterId, playerValues, [], omis, zetas),
        );
      }
    }

    profilesManagement$.profiles.lastUpdatedByAllycode[newAllycode].set({
      id: newAllycode,
      lastUpdated: profilesManagement$.now.peek(),
    });

    // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
    const modById$ = mods$.modByIdByAllycode[newAllycode].modById;

    if (keepOldMods) {
      // If we're keeping the old mods, that means that any mod we don't see must be unequipped

      const newModById: ModById = new Map<string, Mod>();
      for (const modId of modById$.keys()) {
        const mod = modById$[modId].peek() as Mod | undefined;
        if (mod !== undefined) {
          const newMod = cloneMod(mod);
          newMod.characterID = "null";
          newModById.set(modId, newMod);
        }
      }
      modById$.set(newModById);
    } else {
      /*
			profilesManagement$.profiles.profileByAllycode[
				newAllycode
			].modById.clear();
*/
      modById$.set(new Map<string, Mod>());
    }
    //			for (const mod of profile.mods) profilesManagement$.profiles.profilesByAllycode[newAllycode].modById[mod.id].set(mod);
    const newModById: ModById = new Map<string, Mod>();
    for (const mod of profile.mods) {
      newModById.set(mod.id, mod);
    }
    modById$.set(newModById);

    if (fullProfile.mods) {
      for (const mod of fullProfile.mods.mods) {
        const profileMod = modById$[mod.id].peek() as Mod | undefined;
        if (profileMod) profileMod.speedRemainder = mod.speedRemainder;
      }
    }

    datacrons$.updateActiveDatacrons(
      fullProfile?.datacrons?.map((datacron) => ({ ...datacron, name: "" })) ?? [],
    );

    if (fullProfile.material) {
      for (const material of fullProfile.material.material) {
        materials$.materialByIdForActiveAllycode.set(material.id, material);
      }
    }

    if (fullProfile.summary?.currency) {
      for (const currency of fullProfile.summary.currency) {
        currencies$.currencyByIdForActiveAllycode.set(currency.id, currency);
      }
    }
    compilations$.resetOptimizationConditions(newAllycode);
    profilesManagement$.profiles.activeAllycode.set(newAllycode);
    endBatch();
  } catch (error) {
    const errorMessage = error instanceof DOMException ? error.message : "";
    dialog$.showError({
      error: `Error fetching your profile: ${errorMessage} Please try again`,
    });
  }
}
