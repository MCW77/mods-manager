// state
import { observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

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

const syncStatus$ = syncObservable(
	characters$.baseCharacterById,
	persistOptions({
		persist: {
			name: "Characters",
		},
		initial: {} as BaseCharacterById,
	}),
);
console.log("Waiting for characters$ to load");
await when(syncStatus$.isPersistLoaded);
console.log("characters$ loaded");
/*
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
*/

export { characters$ };
