// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharacterById } from "../domain/BaseCharacter";
import type { CharactersObservable } from "../domain/CharactersObservable";

const characters$ = observable<CharactersObservable>({
	baseCharacterById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			throw error;
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
