// state
import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { dialog$ } from "#/modules/dialog/state/dialog";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharacterById } from "../domain/BaseCharacter";
import type { CharactersObservable } from "../domain/CharactersObservable";
import { BaseError } from "#/domain/BaseError";

const characters$ = observable<CharactersObservable>({
	baseCharacterById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			if (error instanceof BaseError) {
				dialog$.showError({
					error: error.error,
					reason: error.reason,
					solution: error.solution,
				});
			}
			return {} as BaseCharacterById; // Return an empty object to satisfy the return type
		}
	},
});

const syncStatus$ = syncObservable(
	characters$.baseCharacterById,
	persistOptions({
		persist: {
			name: "Characters",
		},
		initial: {} as BaseCharacterById,
	}),
);

export { characters$, syncStatus$ };
