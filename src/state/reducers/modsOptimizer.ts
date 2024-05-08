// react
import type * as Redux from "redux";
import type { ThunkAction, ThunkDispatch as TD } from "redux-thunk";

// state
import { type IAppState, AppState } from "../storage";

// #region modules
import { App } from "../modules/app";
import { CharacterEdit } from "../modules/characterEdit";
import { Explore } from "../modules/explore";
import { Optimize } from "../modules/optimize";
import { Review } from "../modules/review";
import { Storage } from "../modules/storage";
// #endregion


export type ThunkResult<R> = ThunkAction<R, IAppState, null, AppActions>
export type AppThunk = ThunkAction<void, IAppState, null, AppActions>
export type ThunkDispatch = TD<IAppState, null, AppActions>
export type ThunkDispatchNoParam = TD<IAppState, void, AppActions>;


// #region AppActions
type AppActions =
  | ReturnType<typeof App.actions.resetState>
  | ReturnType<typeof App.actions.setState>
  | ReturnType<typeof App.actions.toggleSidebar>
  | ReturnType<typeof CharacterEdit.actions.setTemplatesAddingMode>
  | ReturnType<typeof Explore.actions.changeModsViewOptions>
  | ReturnType<typeof Optimize.actions.startModOptimization>
  | ReturnType<typeof Optimize.actions.updateProgress>
  | ReturnType<typeof Review.actions.changeModListFilter>
  | ReturnType<typeof Storage.actions.setBaseCharacters>
  | ReturnType<typeof Storage.actions.setCharacterTemplates>
  | ReturnType<typeof Storage.actions.setProfile>
;
// #endregion


type RootReducer = Redux.Reducer<IAppState, AppActions>;

const modsOptimizer: RootReducer = (state: IAppState | undefined, action: AppActions): IAppState => {
  if (!state) {
    return AppState.save(AppState.restore());
  }

  switch (action.type) {
    case App.actionNames.RESET_STATE: {
      const result = AppState.save(App.reducers.resetState());
      window.location.reload();
      return result;
    }
    case App.actionNames.SET_STATE:
      return AppState.save(
        App.reducers.setState(action)
      );
    case App.actionNames.TOGGLE_SIDEBAR:
      return AppState.save(
        App.reducers.toggleSidebar(state)
      );

    case CharacterEdit.actionNames.SET_TEMPLATES_ADDING_MODE:
      return CharacterEdit.reducers.setTemplatesAddingMode(state, action);

    case Explore.actionNames.CHANGE_MODS_VIEW_OPTIONS:
      return AppState.save(
        Explore.reducers.changeModsViewOptions(state, action)
      );

    case Optimize.actionNames.UPDATE_PROGRESS:
        return Optimize.reducers.updateProgress(state, action);

    case Review.actionNames.CHANGE_MODLIST_FILTER:
      return AppState.save(
        Review.reducers.changeModListFilter(state, action)
      );

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

    default:
      return state;
  }
}

export default modsOptimizer;