// react
import { createSelector } from "@reduxjs/toolkit";

// state
import type { IAppState } from "#/state/storage";

// modules
import type { actions } from "#/state/actions/characterEdit";
import { Storage } from '#/state/modules/storage';

export namespace reducers {
  export function setTemplatesAddingMode(state: IAppState, action: ReturnType<typeof actions.setTemplatesAddingMode>): IAppState {
    return Object.assign({}, state, {
      templates: {
        templatesAddingMode: action.mode,
        userTemplatesByName: state.templates.userTemplatesByName,
      }
    });
  }
}

export namespace selectors {
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
