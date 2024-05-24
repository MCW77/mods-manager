// state
import { type ObservableObject, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

export interface Filters {
	characterFilter: string;
	hideSelectedCharacters: boolean;
}

interface CharactersManagement {
	filters: Filters;
}

export const charactersManagement$: ObservableObject<CharactersManagement> =
	observable<CharactersManagement>({
		filters: {
			characterFilter: "",
			hideSelectedCharacters: true,
		},
	});

syncObservable(charactersManagement$.filters, {
	persist: {
		name: "CharactersManagement",
		indexedDB: {
			itemID: "filters",
		},
	},
});
