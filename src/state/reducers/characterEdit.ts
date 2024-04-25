// react
import { createSelector } from "@reduxjs/toolkit";

// state
import type { IAppState } from "#/state/storage";

// modules
import type { actions } from "#/state/actions/characterEdit";
import { Storage } from '#/state/modules/storage';

export namespace reducers {
  export function changeCharacterEditMode(state: IAppState, action: ReturnType<typeof actions.changeCharacterEditMode>): IAppState {
    return Object.assign({}, state, {
      characterEditMode: action.mode
    });
  }

  export function changeCharacterFilter(state: IAppState, action: ReturnType<typeof actions.changeCharacterFilter>): IAppState {
    return Object.assign({}, state, {
      characterFilter: action.filter
    });
  }

  export function setTemplatesAddingMode(state: IAppState, action: ReturnType<typeof actions.setTemplatesAddingMode>): IAppState {
    return Object.assign({}, state, {
      templates: {
        templatesAddingMode: action.mode,
        userTemplatesByName: state.templates.userTemplatesByName,
      }
    });
  }

  export function toggleCharacterEditSortView(state: IAppState): IAppState {
    return Object.assign({}, state, {
      characterEditSortView: !state.characterEditSortView
    });
  }

  export function toggleHideSelectedCharacters(state: IAppState): IAppState {
    return Object.assign({}, state, {
      hideSelectedCharacters: !state.hideSelectedCharacters
    });
  }
}

export namespace selectors {
  export const selectCharacterEditMode = (state: IAppState) => state.characterEditMode;
  export const selectTemplates = (state: IAppState) => state.templates;
  export const selectSelectedCharactersInActiveProfile = createSelector(
    [Storage.selectors.selectActiveProfile],
    (activeProfile) => activeProfile.selectedCharacters
  );
  export const selectTemplatesAddingMode = (state: IAppState) => selectTemplates(state).templatesAddingMode;
  export const selectUserTemplates = createSelector(
    selectTemplates,
    (templates) => Object.values(templates.userTemplatesByName)
  );
  export const selectUserTemplatesNames = createSelector(
    selectTemplates,
    (templates) => Object.keys(templates.userTemplatesByName)
  );
}
