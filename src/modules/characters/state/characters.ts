// state
import { observable } from "@legendapp/state";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharactersById } from "../domain/BaseCharacter";
import { syncObservable } from "@legendapp/state/sync";

const characters$ = observable<{
	baseCharactersById: () => Promise<BaseCharactersById>;
}>({
	baseCharactersById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			throw error;
		}
	},
});

syncObservable(characters$.baseCharactersById, {
	persist: {
		name: "Characters",
		indexedDB: {
			itemID: "baseCharactersById",
		},
	},
});

export { characters$ };
