// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

// api
import { fetchCharacters } from "../api/fetchBaseCharacters";

// domain
import type { BaseCharacterById } from "../domain/BaseCharacter";

const characters$ = observable<{
	baseCharacterById: () => Promise<BaseCharacterById>;
}>({
	baseCharacterById: async () => {
		try {
			return await fetchCharacters();
		} catch (error) {
			throw error;
		}
	},
});

const syncStatus$ = syncObservable(characters$.baseCharacterById, {
	persist: {
		name: "Characters",
	},
	initial: {} as BaseCharacterById,
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();

export { characters$ };
