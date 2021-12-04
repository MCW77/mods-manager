/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import { pick } from "../utils/mapObject";
import { mapValues } from "lodash-es";
import { Character } from "../domain/Character";
import { PlayerProfile, IFlatPlayerProfile } from "../domain/PlayerProfile";
/*
import groupByKey from "../utils/groupByKey";
import Mod from "../domain/Mod";
import cleanAllyCode from "../utils/cleanAllyCode";
*/
import formatAllyCode from "../utils/formatAllyCode";
import { CharacterTemplatesByName } from "../domain/CharacterTemplates";
import { FilterSettings, defaultSettings } from "../domain/modules/FilterSettings";

import { ElementType } from "utils/typeHelper";
import * as UITypes from "components/types";
import { Characters } from "domain/Character";
import { BaseCharactersById } from "domain/BaseCharacter";
import { TargetStats } from "domain/TargetStat";
import { CharacterEditMode } from "containers/CharacterEditForm/CharacterEditForm";
import { SetStats } from "domain/Stats";
import { ModListFilter } from "./actions/review";

export type SetRestrictions = {
  [key in SetStats.GIMOStatNames]: number
}

export interface IncrementalOptimizationProgress {
  character: Character | null;
  progress: number;
  step: string;
}

interface ModalProps {
  class: string,
  content: string,
  cancelable: boolean
}

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
  keepOldMods: boolean,
  modal: ModalProps | null,
  modListFilter: ModListFilter,
  modsFilter: FilterSettings,
//  modOptions: ModOptions,

  optimizerView: 'edit' | 'review',
  playerProfiles: {
    [key: string]: string
  }, // A simple map from ally codes to player names for all available profiles
  previousVersion: string,
  profile: PlayerProfile, // All the data about the current character
  section: 'optimize',
  showSidebar: boolean,
  version: string,
  profiles?: PlayerProfile[],
  characters?: Characters,
  setRestrictions: SetRestrictions,
  targetStats: TargetStats,
  progress: IncrementalOptimizationProgress,
}

export class AppState {
  static readonly keysToSave = [
    'allyCode',
    'characterFilter',
    'characterEditMode',
    'characterEditSortView',
    'hideSelectedCharacters',
    'keepOldMods',
    'modsFilter',
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
    keepOldMods: true,
    modal: null,
    modsFilter: defaultSettings,
//    modOptions: defaultOptions,
    modListFilter: {
      view: 'sets',
      show: 'all',
      sort: 'assignedCharacter',
      tag: ''
    },
    optimizerView: 'edit',
    playerProfiles: {}, // A simple map from ally codes to player names for all available profiles
    previousVersion: String(import.meta.env.VITE_VERSION) || 'local',
    profile: PlayerProfile.Default, // All the data about the current character
    progress: {
      character: null,
      progress: 0,
      step: '1',
    },
    section: 'optimize',
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
    keepOldMods: state.keepOldMods,
    modsFilter: Object.assign({}, AppState.Default.modsFilter, state.modsFilter),
    modListFilter: state.modListFilter || AppState.Default.modListFilter,
    optimizerView: state.optimizerView || AppState.Default.optimizerView,
    previousVersion: state.version,
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
