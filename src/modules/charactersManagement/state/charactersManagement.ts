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
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

interface CharactersManagement {
	filterSetup: CharacterFilterSetup;
	activeCustomFilter: () => CharacterFilterPredicate;
	addTextFilter: () => void;
}

const getDefaultFilterSetup = () => {
	return {
		customFilterById: new Map<string, CustomFilter>([
			[
				"None",
				{
					id: "None",
					type: "custom",
					filter: "None",
					filterPredicate: (character: Character) => true,
				},
			],
			[
				"Has stat targets",
				{
					id: "Has stat targets",
					type: "custom",
					filter: "Has stat targets",
					filterPredicate: (character: Character) => {
						const selectedCharacters = profilesManagement$.activeProfile.selectedCharacters.peek();
						const selectedCharacter = selectedCharacters.find((c) => c.id === character.id);
						if (selectedCharacter === undefined) return false;
						return selectedCharacter.target.targetStats.length > 0;
					},
				},
			],
			[
				"Missing Mods",
				{
					id: "Missing Mods",
					type: "custom",
					filter: "Missing Mods",
					filterPredicate: (character: Character) => {
						const modAssignments = profilesManagement$.activeProfile.modAssignments.peek();
						const modsAssignedToCharacter = modAssignments.find((ma) => ma.id === character.id);
						if (modsAssignedToCharacter === undefined) return false;
						return modsAssignedToCharacter.assignedMods.length < 6;
					},
				},
			],
			[
				"Needs Leveling",
				{
					id: "Needs Leveling",
					type: "custom",
					filter: "Needs Leveling",
					filterPredicate: (character: Character) => {
						const modAssignments = profilesManagement$.activeProfile.modAssignments.peek();
						const modsAssignedToCharacter = modAssignments.find((ma) => ma.id === character.id);
						if (modsAssignedToCharacter === undefined) return false;
//						const mods = profilesManagement$.activeProfile.mods.peek();
//						return modsAssignedToCharacter.assignedMods.some((mod) => mod.level < 15);
						return true;
					},
				},
			],
			[
				"QA",
				{
					id: "QA",
					type: "custom",
					filter: "QA",
					filterPredicate: (character: Character) => {
						return (
							character.id === "QUEENAMIDALA" ||
							character.id === "MASTERQUIGON" ||
							character.id === "PADAWANOBIWAN"
						);
					},
				},
			],
			[
				"Maul/Sidious/Nute",
				{
					id: "Maul/Sidious/Nute",
					type: "custom",
					filter: "Maul/Sidious/Nute",
					filterPredicate: (character: Character) => {
						return (
							character.id === "MAUL" ||
							character.id === "DARTHSIDIOUS" ||
							character.id === "NUTEGUNRAY"
						);
					},
				},
			],
			[
				"Gungans",
				{
					id: "Gungans",
					type: "custom",
					filter: "Gungans",
					filterPredicate: (character: Character) => {
						return (
							character.id === "JARJARBINKS" ||
							character.id === "BOSSNASS" ||
							character.id === "CAPTAINTARPALS" ||
							character.id === "GUNGANPHALANX" ||
							character.id === "BOOMADIER"
						);
					},
				},
			],
			[
				"KB",
				{
					id: "KB",
					type: "custom",
					filter: "KB",
					filterPredicate: (character: Character) => {
						return (
							character.id === "KELLERANBEQ" ||
							character.id === "KIADIMUNDI" ||
							character.id === "MACEWINDU" ||
							character.id === "SHAAKTI" ||
							character.id === "GRANDMASTERYODA"
						);
					},
				},
			],
			[
				"Lumi",
				{
					id: "Lumi",
					type: "custom",
					filter: "Lumi",
					filterPredicate: (character: Character) => {
						return (
							character.id === "LUMINARAUNDULI" ||
							character.id === "KITFISTO" ||
							character.id === "PLOKOON" ||
							character.id === "GRANDMASTERYODA" ||
							character.id === "QUIGONJINN"
						);
					},
				},
			],
			[
				"B2",
				{
					id: "B2",
					type: "custom",
					filter: "B2",
					filterPredicate: (character: Character) => {
						return (
							character.id === "B2SUPERBATTLEDROID" ||
							character.id === "MAGNAGUARD" ||
							character.id === "DROIDEKA" ||
							character.id === "B1BATTLEDROIDV2" ||
							character.id === "STAP"
						);
					},
				},
			],
		]),
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
		customFilterId: "None",
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
			const customFilterById = charactersManagement$.filterSetup.customFilterById.get();
			if (customFilterById.has(id) === false) return (character: Character) => true;
			return customFilterById.get(id)?.filterPredicate ?? ((character: Character) => true);
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
