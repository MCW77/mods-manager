// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings.js";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters.js";

// domain
import type { BaseCharacterById } from "../domain/BaseCharacter.js";
import type { CharactersObservable } from "../domain/CharactersObservable.js";

const characters$ = observable<CharactersObservable>({
	baseCharacterById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			throw new Error("Failed to fetch base characters", { cause: error });
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
await when(syncStatus$.isPersistLoaded);

export { characters$ };
