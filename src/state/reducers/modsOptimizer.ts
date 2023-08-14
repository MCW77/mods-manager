// react
import * as Redux from "redux";
import { ThunkAction, ThunkDispatch as TD } from "redux-thunk";

// state
import { IAppState, AppState } from "../storage";

// #region modules
import * as App from "../modules/app";
// #endregion

// #region ActionNames
import {
  CHANGE_CHARACTER_EDIT_MODE,
  CHANGE_CHARACTER_FILTER,
  CHANGE_SET_RESTRICTIONS,
  REMOVE_SET_BONUS,
  SELECT_SET_BONUS,
  TOGGLE_HIDE_SELECTED_CHARACTERS,
  ADD_TARGET_STAT,
  REMOVE_TARGET_STAT,
  CHANGE_TARGET_STATS,
  TOGGLE_CHARACTER_EDIT_SORT_VIEW,
} from "../actions/characterEdit";
import { CHANGE_MODS_VIEW_OPTIONS } from "../actions/explore";
import { CANCEL_OPTIMIZE_MODS, OPTIMIZE_MODS, UPDATE_PROGRESS } from "../actions/optimize";
import { CHANGE_MODLIST_FILTER, CHANGE_OPTIMIZER_VIEW } from "../actions/review";
import {
  ADD_PLAYER_PROFILE,
  SET_CHARACTER_TEMPLATES,
  SET_BASE_CHARACTERS,
  SET_PLAYER_PROFILES,
  SET_PROFILE,
  SET_HOTUTILS_SUBSCRIPTION
} from "../actions/storage";
// #endregion

// #region Reducera
import * as AppReducers from "./app";
import * as CharacterEditReducers from "./characterEdit";
import * as ExploreReducers from "./explore";
import * as OptimizeReducers from "./optimize";
import { changeModListFilter, changeOptimizerView, } from "./review";
import * as StorageReducers from "./storage";
// #endregion

// #region Actions
import * as ReviewActions from "../actions/review";
import * as StorageActions from "../actions/storage";
import * as CharacterEditActions from "../actions/characterEdit";
import * as ExploreActions from "../actions/explore";
import * as OptimizeActions from "../actions/optimize";
// #endregion

export type ThunkResult<R> = ThunkAction<R, IAppState, null, AppActions>

export type AppThunk = ThunkAction<void, IAppState, null, AppActions>

export type ThunkDispatch = TD<IAppState, null, AppActions>
export type ThunkDispatchNoParam = TD<IAppState, void, AppActions>;

//export const thunkDispatch = 

// #region AppActions
type AppActions =
  | ReturnType<typeof App.Actions.CHANGE_SECTION>
  | ReturnType<typeof App.Actions.HIDE_ERROR>
  | ReturnType<typeof App.Actions.HIDE_FLASH>
  | ReturnType<typeof App.Actions.HIDE_MODAL>
  | ReturnType<typeof App.Actions.RESET_STATE>
  | ReturnType<typeof App.Actions.SET_IS_BUSY>
  | ReturnType<typeof App.Actions.SET_STATE>
  | ReturnType<typeof App.Actions.SHOW_ERROR>
  | ReturnType<typeof App.Actions.SHOW_FLASH>
  | ReturnType<typeof App.Actions.SHOW_MODAL>
  | ReturnType<typeof App.Actions.TOGGLE_SIDEBAR>
  | ReturnType<typeof CharacterEditActions.addTargetStat>
  | ReturnType<typeof CharacterEditActions.changeCharacterEditMode>
  | ReturnType<typeof CharacterEditActions.changeCharacterFilter>
  | ReturnType<typeof CharacterEditActions.changeSetRestrictions>
  | ReturnType<typeof CharacterEditActions.changeTargetStats>
  | ReturnType<typeof CharacterEditActions.removeSetBonus>
  | ReturnType<typeof CharacterEditActions.removeTargetStat>
  | ReturnType<typeof CharacterEditActions.selectSetBonus>
  | ReturnType<typeof CharacterEditActions.toggleCharacterEditSortView>
  | ReturnType<typeof CharacterEditActions.toggleHideSelectedCharacters>
  | ReturnType<typeof ExploreActions.changeModsViewOptions>
  | ReturnType<typeof OptimizeActions.cancelOptimizeMods>
  | ReturnType<typeof OptimizeActions.startModOptimization>
  | ReturnType<typeof OptimizeActions.updateProgress>
  | ReturnType<typeof ReviewActions.changeModListFilter>
  | ReturnType<typeof ReviewActions.changeOptimizerView>
  | ReturnType<typeof StorageActions.addPlayerProfile>
  | ReturnType<typeof StorageActions.setBaseCharacters>
  | ReturnType<typeof StorageActions.setCharacterTemplates>
  | ReturnType<typeof StorageActions.setHotUtilsSubscription>
  | ReturnType<typeof StorageActions.setPlayerProfiles>
  | ReturnType<typeof StorageActions.setProfile>
;
// #endregion


type RootReducer = Redux.Reducer<IAppState, AppActions>;

const modsOptimizer: RootReducer = function(state: IAppState | undefined, action: AppActions): IAppState {
  if (!state) {
    return AppState.save(AppState.restore());
  }

  switch (action.type) {
    case SET_BASE_CHARACTERS:
      return StorageReducers.setBaseCharacters(state, action);
    case SET_PROFILE:
      return AppState.save(StorageReducers.setProfile(state, action));
    case SET_CHARACTER_TEMPLATES:
      return AppState.save(StorageReducers.setCharacterTemplates(state, action));
    case ADD_PLAYER_PROFILE:
      return StorageReducers.addPlayerProfile(state, action);
    case SET_PLAYER_PROFILES:
      return StorageReducers.setPlayerProfiles(state, action);
    case SET_HOTUTILS_SUBSCRIPTION:
      return StorageReducers.setHotUtilsSubscription(state, action);


    case App.ActionNames.CHANGE_SECTION:
      return AppState.save(AppReducers.changeSection(state, action));
    case App.ActionNames.SHOW_MODAL:
      return AppReducers.showModal(state, action);
    case App.ActionNames.HIDE_MODAL:
      return AppReducers.hideModal(state);
    case App.ActionNames.SHOW_ERROR:
      return AppReducers.showError(state, action);
    case App.ActionNames.HIDE_ERROR:
      return AppReducers.hideError(state);
    case App.ActionNames.SHOW_FLASH:
      return AppReducers.showFlash(state, action);
    case App.ActionNames.HIDE_FLASH:
      return AppReducers.hideFlash(state);
    case App.ActionNames.RESET_STATE:
      const result = AppState.save(AppReducers.resetState());
      window.location.reload();
      return result;
    case App.ActionNames.TOGGLE_SIDEBAR:
      return AppState.save(AppReducers.toggleSidebar(state));
    case App.ActionNames.SET_STATE:
      return AppState.save(AppReducers.setState(action));
    case App.ActionNames.SET_IS_BUSY:
      return AppReducers.setIsBusy(state, action);

    case CHANGE_CHARACTER_EDIT_MODE:
      return AppState.save(CharacterEditReducers.changeCharacterEditMode(state, action));
    case CHANGE_CHARACTER_FILTER:
      return AppState.save(CharacterEditReducers.changeCharacterFilter(state, action));
    case TOGGLE_HIDE_SELECTED_CHARACTERS:
      return AppState.save(CharacterEditReducers.toggleHideSelectedCharacters(state, action));
    case TOGGLE_CHARACTER_EDIT_SORT_VIEW:
      return AppState.save(CharacterEditReducers.toggleCharacterEditSortView(state, action));
    case CHANGE_SET_RESTRICTIONS:
      return CharacterEditReducers.changeSetRestrictions(state, action);
    case SELECT_SET_BONUS:
      return CharacterEditReducers.selectSetBonus(state, action);
    case REMOVE_SET_BONUS:
      return CharacterEditReducers.removeSetBonus(state, action);
    case ADD_TARGET_STAT:
      return CharacterEditReducers.addTargetStat(state, action);
    case CHANGE_TARGET_STATS:
      return CharacterEditReducers.changeTargetStats(state, action);
    case REMOVE_TARGET_STAT:
      return CharacterEditReducers.removeTargetStat(state, action);

    case CHANGE_MODS_VIEW_OPTIONS:
      return AppState.save(ExploreReducers.changeModsViewOptions(state, action));

    case OPTIMIZE_MODS:
      return OptimizeReducers.optimizeMods(state);
    case UPDATE_PROGRESS:
        return OptimizeReducers.updateProgress(state, action);      
    case CANCEL_OPTIMIZE_MODS:
      return AppState.save(OptimizeReducers.cancelOptimizeMods(state));

    case CHANGE_OPTIMIZER_VIEW:
      return AppState.save(changeOptimizerView(state, action));
    case CHANGE_MODLIST_FILTER:
      return AppState.save(changeModListFilter(state, action));

    default:
      return state;
  }
}

export default modsOptimizer;