// react
import { createSelector } from "@reduxjs/toolkit";

// modules
import { Storage } from "#/state/modules/storage";

export namespace selectors {
	export const selectSelectedCharactersInActiveProfile = createSelector(
		[Storage.selectors.selectActiveProfile],
		(activeProfile) => activeProfile.selectedCharacters,
	);
}
