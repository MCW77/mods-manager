// utils
import { mapValues } from "lodash-es";
import formatAllyCode from "../utils/formatAllyCode";
import { pick } from "../utils/mapObject";
import { ElementType } from "../utils/typeHelper";

/*
import groupByKey from "../utils/groupByKey";
import Mod from "../domain/Mod";
import cleanAllyCode from "../utils/cleanAllyCode";
*/

// domain
import { BaseCharactersById } from "../domain/BaseCharacter";
import { Character, Characters } from "../domain/Character";
import { CharacterEditMode } from "../domain/CharacterEditMode";
import { CharacterTemplatesByName } from "../domain/CharacterTemplates";
import { ModalProps } from "../domain/ModalProps";
import { ModListFilter } from "../domain/ModListFilter";
import { ModsViewOptions, defaultOptions } from "../domain/modules/ModsViewOptions";
import { OptimizationStatus } from "../domain/OptimizationStatus";
import { PlayerNamesByAllycode } from "../domain/PlayerNamesByAllycode";
import { PlayerProfile, IFlatPlayerProfile } from "../domain/PlayerProfile";
import { SetRestrictions } from "../domain/SetRestrictions";
import { TargetStats } from "../domain/TargetStat";

// components
import * as UITypes from "../components/types";


export interface IAppState {
  allyCode: string,
  characterFilter: string,
  characterEditMode: CharacterEditMode,
  characterEditSortView: boolean,
  characterTemplates: CharacterTemplatesByName,
  error: UITypes.DOMContent | null,
  flashMessage: {
    heading: UITypes.DOMContent,
    content: UITypes.DOMContent
  } | null,
  baseCharacters: BaseCharactersById,
  hideSelectedCharacters: boolean,
  hotUtilsSubscription: boolean,
  isBusy: boolean,
  modal: ModalProps,
  modListFilter: ModListFilter,
  modsViewOptions: ModsViewOptions,
//  modOptions: ModOptions,
  optimizerView: 'edit' | 'review',
  playerProfiles: PlayerNamesByAllycode,
  profile: PlayerProfile, // All the data about the current character
  section: UITypes.Sections,
  previousSection: UITypes.Sections,
  help: {
    section: string;
    topic: number,
  },
  settings: {
    section: string;
    topic: number,
  },
  showSidebar: boolean,
  version: string,
  profiles?: PlayerProfile[],
  characters?: Characters,
  setRestrictions: SetRestrictions,
  targetStats: TargetStats,
  progress: OptimizationStatus,
}

export class AppState {
  static readonly keysToSave = [
    'allyCode',
    'characterFilter',
    'characterEditMode',
    'characterEditSortView',
    'hideSelectedCharacters',
    'modsViewOptions',
    'modListFilter',
    'optimizerView',
    'section',
    'showSidebar',
    'version'
  ] as const;

  static readonly Default: IAppState = {
    allyCode: '',
    characterFilter: '',
    characterEditMode: 'basic',
    characterEditSortView: false,
    characterTemplates: {} as CharacterTemplatesByName,
    error: null,
    flashMessage: null,
    baseCharacters: {} as BaseCharactersById,
    hideSelectedCharacters: true,
    hotUtilsSubscription: false,
    isBusy: false,
    modal: null,
    modsViewOptions: defaultOptions,
//    modOptions: defaultOptions,
    modListFilter: {
      view: 'sets',
      show: 'all',
      sort: 'assignedCharacter',
      tag: ''
    },
    optimizerView: 'edit',
    playerProfiles: {}, // A simple map from ally codes to player names for all available profiles
    profile: PlayerProfile.Default, // All the data about the current character
    progress: {
      character: null,
      progress: 0,
      step: '1',
    },
    section: 'help',
    previousSection: 'help',
    help: {
      section: 'general',
      topic: 1,
    },
    settings: {
      section: 'general',
      topic: 1,
    },
    showSidebar: true,
    version: String(import.meta.env.VITE_VERSION) || 'local',
    setRestrictions: {} as SetRestrictions,
    targetStats: [] as TargetStats
  };

  /**
 * Save the state of the application to localStorage, then return it so it can be chained
 * @param state {IAppState}
 * @returns {IAppState}
 */
  static save(state: IAppState) {
    const reducedState: Pick<IAppState, ElementType<typeof AppState.keysToSave>> =
      pick(state, ...AppState.keysToSave);
    const storedState = AppState.serialize(reducedState);
    window.localStorage.setItem('optimizer.state', JSON.stringify(storedState));
    return state;
  }

/**
 * Restore the application from localStorage
 * @returns {IAppState}
 */
  static restore(): IAppState {
    let state: string | null = null;

    try {
      state = window.localStorage.getItem('optimizer.state');
    } catch {
      return AppState.Default;
    }
    return state ?      
      deserializeState(JSON.parse(state))
    :
      AppState.Default;
  }

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state {object}
 */
 static serialize(state: any): any {
    if (null === state || undefined === typeof state) {
      return null;
    } else if ('function' === typeof state.serialize) {
      return state.serialize();
    } else if (state instanceof Array) {
      return state.map(item => AppState.serialize(item));
    } else if (state instanceof Object) {
      return mapValues(
        state,
        (stateValue: any) => AppState.serialize(stateValue)
      );
    } else {
      return state;
    }
  }
}

/**
 * Convert the state from a serialized representation to the in-memory representation used by the app
 * @param state {IAppState}
 */
export function deserializeState(state: IAppState): IAppState {
  const version: string = String(import.meta.env.VITE_VERSION) || 'local';

  return Object.assign({}, AppState.Default, {
    allyCode: state.allyCode,
    characterEditMode: state.characterEditMode || AppState.Default.characterEditMode,
    characterEditSortView: state.characterEditSortView || AppState.Default.characterEditSortView,
    characterFilter: state.characterFilter || AppState.Default.characterFilter,
    hideSelectedCharacters: state.hideSelectedCharacters || AppState.Default.hideSelectedCharacters,
    modsViewOptions: Object.assign({}, AppState.Default.modsViewOptions, state.modsViewOptions),
    modListFilter: state.modListFilter || AppState.Default.modListFilter,
    optimizerView: state.optimizerView || AppState.Default.optimizerView,
    section: state.section,
    showSidebar: 'undefined' !== typeof state.showSidebar ? state.showSidebar : AppState.Default.showSidebar,
    version: version
  },
    state.profiles ?
      {
        profiles: mapValues(state.profiles, (profile: IFlatPlayerProfile, allyCode: string) => {
          profile.allyCode = allyCode;
          profile.playerName = formatAllyCode(allyCode);
          return PlayerProfile.deserialize(profile);
        })
      }
    :
      null,
    state.characters ?
      {
        characters: mapValues(state.characters, (character: Character) => Character.deserialize(character))
      }
    :
      null
  );
}
