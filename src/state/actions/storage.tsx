// domain
import { BaseCharactersById } from '../../domain/BaseCharacter';
import { CharacterTemplatesByName } from "../../domain/CharacterTemplates";
import { PlayerNamesByAllycode } from '../../domain/PlayerNamesByAllycode';
import { PlayerProfile } from '../../domain/PlayerProfile';


/*
export function addModsToProfiles(newProfiles) {
  const newProfilesObject = groupByKey(newProfiles, profile => profile.allyCode);

  return function (dispatch, getState) {
    const state = getState();
    const db = getDatabase();
    db.getProfiles(
      profiles => {
        const updatedProfiles = profiles.map(profile => {
          if (!newProfilesObject.hasOwnProperty(profile.allyCode)) {
            return profile;
          }

          const profileModsObject = groupByKey(profile.mods, mod => mod.id);
          const newProfileMods = newProfilesObject[profile.allyCode].mods.map(mod => Mod.fromHotUtils(mod));
          const newProfileModsObject = groupByKey(newProfileMods, mod => mod.id)
          return profile.withMods(Object.values(Object.assign({}, profileModsObject, newProfileModsObject)));
        });

        const totalMods = newProfiles.reduce((sum: number, profile: PlayerProfile) => sum + profile.mods.length, 0);

        db.saveProfiles(
          updatedProfiles,
          () => {
            dispatch(loadProfiles(state.allyCode));
            dispatch(showFlash(
              'Success!',
              <p>
                Successfully imported  data for <span className={'gold'}>{newProfiles.length}</span> profile(s)
                containing <span className={'gold'}>{totalMods}</span> mods.
              </p>,
            ));
          },
          error => dispatch(showError(
            'Error saving player profiles: ' + error?.message
          ))
        );
      },
      error => dispatch(showError(
        'Error reading profiles: ' + error.message
      ))
    );
  }
}
*/
export namespace actions {

  /**
   * Add a profile to the state's list of player profiles
   * @param profile {PlayerProfile}
   */
  export function addPlayerProfile(profile: PlayerProfile) {
    return {
      type: actionNames.ADD_PLAYER_PROFILE,
      profile: profile
    } as const;
  }

  export function setBaseCharacters(baseCharacters: BaseCharactersById) {
    return {
      type: actionNames.SET_BASE_CHARACTERS,
      baseCharacters: baseCharacters
    } as const;
  }

  export function setCharacterTemplates(templates: CharacterTemplatesByName) {
    return {
      type: actionNames.SET_CHARACTER_TEMPLATES,
      templates: templates
    } as const;
  }

  export function setHotUtilsSubscription(hasAccess: boolean) {
    return {
      type: actionNames.SET_HOTUTILS_SUBSCRIPTION,
      subscription: hasAccess
    } as const;
  }

  export function setPlayerProfiles(profiles: PlayerNamesByAllycode) {
    return {
      type: actionNames.SET_PLAYER_PROFILES,
      profiles: profiles
    } as const;
  }

  export function setProfile(profile: PlayerProfile) {
    return {
      type: actionNames.SET_PROFILE,
      profile: profile
    } as const;
  }
};

export namespace actionNames {
  export const ADD_PLAYER_PROFILE = 'ADD_PLAYER_PROFILE' as const;
  export const SET_BASE_CHARACTERS = 'SET_BASE_CHARACTERS' as const;
  export const SET_CHARACTER_TEMPLATES = 'SET_CHARACTER_TEMPLATES' as const;
  export const SET_HOTUTILS_SUBSCRIPTION = 'SET_HOTUTILS_SUBSCRIPTION' as const;
  export const SET_PLAYER_PROFILES = 'SET_PLAYER_PROFILES' as const;
  export const SET_PROFILE = 'SET_PROFILE' as const;
};
