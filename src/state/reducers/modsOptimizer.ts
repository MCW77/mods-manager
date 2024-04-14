// react
import * as Redux from "redux";
import { ThunkAction, ThunkDispatch as TD } from "redux-thunk";

// state
import { IAppState, AppState } from "../storage";

// #region modules
import { App } from "../modules/app";
import { CharacterEdit } from "../modules/characterEdit";
import { Explore } from "../modules/explore";
import { Help } from "../modules/help";
import { Optimize } from "../modules/optimize";
import { Review } from "../modules/review";
import { Settings } from "../modules/settings";
import { Storage } from "../modules/storage";
// #endregion


export type ThunkResult<R> = ThunkAction<R, IAppState, null, AppActions>
export type AppThunk = ThunkAction<void, IAppState, null, AppActions>
export type ThunkDispatch = TD<IAppState, null, AppActions>
export type ThunkDispatchNoParam = TD<IAppState, void, AppActions>;


// #region AppActions
type AppActions =
  | ReturnType<typeof App.actions.changeSection>
  | ReturnType<typeof App.actions.resetState>
  | ReturnType<typeof App.actions.setState>
  | ReturnType<typeof App.actions.toggleSidebar>
  | ReturnType<typeof CharacterEdit.actions.changeCharacterEditMode>
  | ReturnType<typeof CharacterEdit.actions.changeCharacterFilter>
  | ReturnType<typeof CharacterEdit.actions.changeSetRestrictions>
  | ReturnType<typeof CharacterEdit.actions.removeSetBonus>
  | ReturnType<typeof CharacterEdit.actions.selectSetBonus>
  | ReturnType<typeof CharacterEdit.actions.setTemplatesAddingMode>
  | ReturnType<typeof CharacterEdit.actions.toggleCharacterEditSortView>
  | ReturnType<typeof CharacterEdit.actions.toggleHideSelectedCharacters>
  | ReturnType<typeof Explore.actions.changeModsViewOptions>
  | ReturnType<typeof Help.actions.setHelpPosition>
  | ReturnType<typeof Optimize.actions.startModOptimization>
  | ReturnType<typeof Optimize.actions.updateProgress>
  | ReturnType<typeof Review.actions.changeModListFilter>
  | ReturnType<typeof Settings.actions.setSettingsPosition>
  | ReturnType<typeof Storage.actions.setBaseCharacters>
  | ReturnType<typeof Storage.actions.setCharacterTemplates>
  | ReturnType<typeof Storage.actions.setHotUtilsSubscription>
  | ReturnType<typeof Storage.actions.setProfile>
;
// #endregion


type RootReducer = Redux.Reducer<IAppState, AppActions>;

const modsOptimizer: RootReducer = function(state: IAppState | undefined, action: AppActions): IAppState {
  if (!state) {
    return AppState.save(AppState.restore());
  }

  switch (action.type) {

    case App.actionNames.CHANGE_SECTION:
      return AppState.save(App.reducers.changeSection(state, action));
    case App.actionNames.RESET_STATE:
      const result = AppState.save(App.reducers.resetState());
      window.location.reload();
      return result;
    case App.actionNames.SET_STATE:
      return AppState.save(
        App.reducers.setState(action)
      );
    case App.actionNames.TOGGLE_SIDEBAR:
      return AppState.save(
        App.reducers.toggleSidebar(state)
      );

    case CharacterEdit.actionNames.CHANGE_CHARACTER_EDIT_MODE:
      return AppState.save(
        CharacterEdit.reducers.changeCharacterEditMode(state, action)
      );
    case CharacterEdit.actionNames.CHANGE_CHARACTER_FILTER:
      return AppState.save(
        CharacterEdit.reducers.changeCharacterFilter(state, action)
      );
    case CharacterEdit.actionNames.CHANGE_SET_RESTRICTIONS:
      return CharacterEdit.reducers.changeSetRestrictions(state, action);
    case CharacterEdit.actionNames.REMOVE_SET_BONUS:
      return CharacterEdit.reducers.removeSetBonus(state, action);
    case CharacterEdit.actionNames.SELECT_SET_BONUS:
      return CharacterEdit.reducers.selectSetBonus(state, action);
    case CharacterEdit.actionNames.SET_TEMPLATES_ADDING_MODE:
      return CharacterEdit.reducers.setTemplatesAddingMode(state, action);
    case CharacterEdit.actionNames.TOGGLE_CHARACTER_EDIT_SORT_VIEW:
      return AppState.save(
        CharacterEdit.reducers.toggleCharacterEditSortView(state)
      );
    case CharacterEdit.actionNames.TOGGLE_HIDE_SELECTED_CHARACTERS:
      return AppState.save(
        CharacterEdit.reducers.toggleHideSelectedCharacters(state)
      );

    case Explore.actionNames.CHANGE_MODS_VIEW_OPTIONS:
      return AppState.save(
        Explore.reducers.changeModsViewOptions(state, action)
      );

    case Help.actionNames.SET_HELP_POSITION:
      return Help.reducers.setHelpPosition(state, action);


    case Optimize.actionNames.UPDATE_PROGRESS:
        return Optimize.reducers.updateProgress(state, action);

    case Review.actionNames.CHANGE_MODLIST_FILTER:
      return AppState.save(
        Review.reducers.changeModListFilter(state, action)
      );

    case Settings.actionNames.SET_SETTINGS_POSITION:
      return Settings.reducers.setSettingsPosition(state, action);

    case Storage.actionNames.SET_BASE_CHARACTERS:
      return Storage.reducers.setBaseCharacters(state, action);
    case Storage.actionNames.SET_PROFILE:
      return AppState.save(
        Storage.reducers.setProfile(state, action)
      );
    case Storage.actionNames.SET_CHARACTER_TEMPLATES:
      return AppState.save(
        Storage.reducers.setCharacterTemplates(state, action)
      );
    case Storage.actionNames.SET_HOTUTILS_SUBSCRIPTION:
      return Storage.reducers.setHotUtilsSubscription(state, action);

    default:
      return state;
  }
}

export default modsOptimizer;