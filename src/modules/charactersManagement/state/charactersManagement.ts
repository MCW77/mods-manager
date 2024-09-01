// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

export interface Filters {
	characterFilter: string;
	hideSelectedCharacters: boolean;
}

interface CharactersManagement {
	filters: Filters;
}
const getDefaultFilters = () => {
	return {
		characterFilter: "",
		hideSelectedCharacters: true,
	};
};

export const charactersManagement$: ObservableObject<CharactersManagement> =
	observable<CharactersManagement>({
		filters: getDefaultFilters(),
	});

const syncStatus$ = syncObservable(charactersManagement$.filters, {
	persist: {
		name: "CharactersManagement",
		indexedDB: {
			itemID: "filters",
		},
	},
	initial: getDefaultFilters(),
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
