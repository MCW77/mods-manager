// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharactersById } from "../domain/BaseCharacter";

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

const syncStatus$ = syncObservable(characters$.baseCharactersById, {
	persist: {
		name: "Characters",
	},
	initial: {} as BaseCharactersById,
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();

export { characters$ };
