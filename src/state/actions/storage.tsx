// domain
import type { BaseCharactersById } from "#/domain/BaseCharacter";
import type { CharacterTemplatesByName } from "#/domain/CharacterTemplates";
import type { PlayerProfile } from "#/domain/PlayerProfile";


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

  export function setProfile(profile: PlayerProfile) {
    return {
      type: actionNames.SET_PROFILE,
      profile: profile
    } as const;
  }
};

export namespace actionNames {
  export const SET_BASE_CHARACTERS = 'SET_BASE_CHARACTERS' as const;
  export const SET_CHARACTER_TEMPLATES = 'SET_CHARACTER_TEMPLATES' as const;
  export const SET_PROFILE = 'SET_PROFILE' as const;
};
