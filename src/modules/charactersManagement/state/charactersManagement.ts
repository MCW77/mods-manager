// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";

// domain
import {
	createTextCharacterFilter,
	type TextFilter,
	type CharacterFilter,
	type CustomFilter,
	type CharacterFilterPredicate,
} from "../domain/CharacterFilterById";
import type { CharacterFilterSetup } from "../domain/CharacterFilterSetup";
import type { Character } from "#/domain/Character";

interface CharactersManagement {
	filterSetup: CharacterFilterSetup;
	activeCustomFilter: () => CharacterFilterPredicate;
	addTextFilter: () => void;
}

const getDefaultFilterSetup = () => {
	return {
		customFilterById: new Map<string, CustomFilter>(),
		permanentFilterById: new Map<string, CustomFilter>([
			[
				"stars",
				{
					id: "stars",
					type: "custom",
					filter: "stars",
					filterPredicate: (character: Character) => {
						return (
							charactersManagement$.filterSetup.starsRange.peek()[0] <=
								character.playerValues.stars &&
							character.playerValues.stars <=
								charactersManagement$.filterSetup.starsRange.peek()[1]
						);
					},
				},
			],
			[
				"level",
				{
					id: "level",
					type: "custom",
					filter: "level",
					filterPredicate: (character: Character) => {
						return (
							charactersManagement$.filterSetup.levelRange.peek()[0] <=
								character.playerValues.level &&
							character.playerValues.level <=
								charactersManagement$.filterSetup.levelRange.peek()[1]
						);
					},
				},
			],
			[
				"gearLevel",
				{
					id: "gearLevel",
					type: "custom",
					filter: "gearLevel",
					filterPredicate: (character: Character) => {
						const minGear =
							charactersManagement$.filterSetup.gearLevelRange.peek()[0];
						const maxGear =
							charactersManagement$.filterSetup.gearLevelRange.peek()[1];

						const minGearLevel = minGear > 13 ? 13 : minGear;
						const maxGearLevel = maxGear > 13 ? 13 : maxGear;
						const minRelicLevel = minGear > 12 ? minGear - 13 : 0;
						const maxRelicLevel = maxGear > 12 ? maxGear - 13 : 0;

						return (
							minGearLevel <= character.playerValues.gearLevel &&
							character.playerValues.gearLevel <= maxGearLevel &&
							minRelicLevel <= character.playerValues.relicTier - 2 &&
							character.playerValues.relicTier - 2 <= maxRelicLevel
						);
					},
				},
			],
		]),
		customFilterId: "",
		filtersById: new Map<string, CharacterFilter>(),
		hideSelectedCharacters: true,
		quickFilter: {
			id: "quickFilter",
			type: "text",
			filter: "",
		} as TextFilter,
		gearLevelRange: [1, 22] as [number, number],
		levelRange: [0, 85] as [number, number],
		starsRange: [0, 7] as [number, number],
	};
};

export const charactersManagement$: ObservableObject<CharactersManagement> =
	observable<CharactersManagement>({
		filterSetup: getDefaultFilterSetup(),
		activeCustomFilter: () => {
			const id = charactersManagement$.filterSetup.customFilterId.get();
			const filter = charactersManagement$.filterSetup.customFilterById
				.get()
				.get(id);
			if (filter === undefined) return (character: Character) => true;
			return filter.filterPredicate;
		},
		addTextFilter: () => {
			const newFilter = createTextCharacterFilter(
				charactersManagement$.filterSetup.quickFilter.filter.peek(),
			);
			charactersManagement$.filterSetup.filtersById.set(
				newFilter.id,
				newFilter,
			);
		},
	});

const syncStatus$ = syncObservable(charactersManagement$.filterSetup, {
	persist: {
		name: "CharactersManagement",
		indexedDB: {
			itemID: "filterSetup",
		},
	},
	initial: getDefaultFilterSetup(),
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();
