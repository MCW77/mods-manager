// state
import { type ObservableObject, observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

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

persistObservable(charactersManagement$.filters, {
	local: {
		name: "CharactersManagement",
		indexedDB: {
			itemID: "filters",
		},
	},
});
