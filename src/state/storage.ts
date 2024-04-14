// utils
import { mapValues } from "lodash-es";
import { pick } from "../utils/mapObject";
import { ElementType } from "../utils/typeHelper";

// domain
import { BaseCharactersById } from "../domain/BaseCharacter";
import { CharacterEditMode } from "../domain/CharacterEditMode";
import { HelpSections } from "../domain/HelpSections";
import { ModListFilter } from "../domain/ModListFilter";
import { ModsViewOptions, defaultOptions } from "../domain/modules/ModsViewOptions";
import { OptimizationStatus } from "../domain/OptimizationStatus";
import { PlayerProfile } from "../domain/PlayerProfile";
import { SetRestrictions } from "../domain/SetRestrictions";
import { SettingsSections } from "../domain/SettingsSections";
import { TargetStats } from "../domain/TargetStat";
import { Templates } from "../domain/Templates";

// components
import * as UITypes from "../components/types";


export interface IAppState {
  baseCharacters: BaseCharactersById,
  characterEditMode: CharacterEditMode,
  characterEditSortView: boolean,
  characterFilter: string,
  help: {
    section: HelpSections;
    topic: number,
  },
  hideSelectedCharacters: boolean,
  hotUtilsSubscription: boolean,
  modListFilter: ModListFilter,
  modsViewOptions: ModsViewOptions,
  previousSection: UITypes.Sections,
  profile: PlayerProfile, // All the data about the current character
  progress: OptimizationStatus,
  section: UITypes.Sections,
  setRestrictions: SetRestrictions,
  settings: {
    section: SettingsSections;
    topic: number,
  },
  showSidebar: boolean,
  targetStats: TargetStats,
  templates: Templates,
  theme: 'light' | 'dark',
  version: string,
}

export class AppState {
  static readonly keysToSave = [
    'characterEditMode',
    'characterEditSortView',
    'characterFilter',
    'hideSelectedCharacters',
    'modListFilter',
    'modsViewOptions',
    'section',
    'showSidebar',
    'templates',
    'theme',
    'version',
  ] as const;

  static readonly Default: IAppState = {
    baseCharacters: {} as BaseCharactersById,
    characterEditMode: 'basic',
    characterEditSortView: false,
    characterFilter: '',
    help: {
      section: 'general',
      topic: 1,
    },
    hideSelectedCharacters: true,
    hotUtilsSubscription: false,
    modListFilter: {
      view: 'sets',
      show: 'all',
      sort: 'assignedCharacter',
      tag: 'All',
    },
    modsViewOptions: defaultOptions,
    previousSection: 'help',
    profile: PlayerProfile.Default, // All the data about the current character
    progress: {
      character: null,
      progress: 0,
      step: '1',
    },
    section: 'help',
    settings: {
      section: 'general',
      topic: 1,
    },
    setRestrictions: {} as SetRestrictions,
    showSidebar: true,
    targetStats: [] as TargetStats,
    templates: {
      templatesAddingMode: 'replace',
      userTemplatesByName: {}
    },
    theme: 'dark',
    version: String(import.meta.env.VITE_VERSION) || 'local',
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
    if (null === state || "undefined" === typeof state) {
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

  return Object.assign(
    {},
    AppState.Default,
    {
      characterEditMode: state.characterEditMode || AppState.Default.characterEditMode,
      characterEditSortView: state.characterEditSortView || AppState.Default.characterEditSortView,
      characterFilter: state.characterFilter || AppState.Default.characterFilter,
      hideSelectedCharacters: state.hideSelectedCharacters || AppState.Default.hideSelectedCharacters,
      modsViewOptions: Object.assign({}, AppState.Default.modsViewOptions, state.modsViewOptions),
      modListFilter: state.modListFilter || AppState.Default.modListFilter,
      section: state.section,
      showSidebar: 'undefined' !== typeof state.showSidebar ? state.showSidebar : AppState.Default.showSidebar,
      templates: state.templates,
      theme: state.theme || AppState.Default.theme,
      version: version,
    },
  );
}
