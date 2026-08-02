// state
import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharacterById } from "../domain/BaseCharacter";
import type { CharactersObservable } from "../domain/CharactersObservable";
import { BaseError } from "#/domain/BaseError";

const insideWebWorker = !Object.hasOwn(self, "document");

const dialogModule =
	insideWebWorker === false
		? await import("#/modules/dialog/state/dialog")
		: undefined;

const characters$ = observable<CharactersObservable>({
	baseCharacterById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			if (error instanceof BaseError && dialogModule !== undefined) {
				dialogModule.dialog$.showError({
					error: error.error,
					reason: error.reason,
					solution: error.solution,
				});
			} else {
				if (error instanceof BaseError) {
					console.error(error.error);
					console.error(`Reason: ${error.reason}`);
					console.error(`Solution: ${error.solution}`);
				} else {
					console.error(
						"Unexpected error while fetching base characters:",
						error,
					);
				}
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
