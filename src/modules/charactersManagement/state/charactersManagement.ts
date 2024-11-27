// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

/*
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const compilations$ = stateLoader$.compilations$;
*/
const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);

// domain
import {
	createTextCharacterFilter,
	type TextFilter,
	type CharacterFilter,
	type CustomFilter,
} from "../domain/CharacterFilterById";
import type { Character } from "#/domain/Character";
import type { CharactersManagementObservable } from "../domain/CharactersManagementObservable";

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
						const selectedCharacters =
							compilations$.defaultCompilation.selectedCharacters.peek();
						const selectedCharacter = selectedCharacters.find(
							(c) => c.id === character.id,
						);
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
						const modAssignments =
							compilations$.defaultCompilation.flatCharacterModdings.peek();
						const modsAssignedToCharacter = modAssignments.find(
							(ma) => ma.characterId === character.id,
						);
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
						const modAssignments =
							compilations$.defaultCompilation.flatCharacterModdings.peek();
						const modsAssignedToCharacter = modAssignments.find(
							(ma) => ma.characterId === character.id,
						);
						if (modsAssignedToCharacter === undefined) return false;
						//						const mods = profilesManagement$.activeProfile.mods.peek();
						//						return modsAssignedToCharacter.assignedMods.some((mod) => mod.level < 15);
						return true;
					},
				},
			],
			[
				"Naboo-All",
				{
					id: "Naboo-All",
					type: "custom",
					filter: "All",
					filterPredicate: (character: Character) => {
						return (
							character.id === "QUEENAMIDALA" ||
							character.id === "MASTERQUIGON" ||
							character.id === "PADAWANOBIWAN" ||
							character.id === "MAUL" ||
							character.id === "DARTHSIDIOUS" ||
							character.id === "NUTEGUNRAY" ||
							character.id === "JARJARBINKS" ||
							character.id === "BOSSNASS" ||
							character.id === "CAPTAINTARPALS" ||
							character.id === "GUNGANPHALANX" ||
							character.id === "BOOMADIER" ||
							character.id === "KELLERANBEQ" ||
							character.id === "KIADIMUNDI" ||
							character.id === "MACEWINDU" ||
							character.id === "SHAAKTI" ||
							character.id === "GRANDMASTERYODA" ||
							character.id === "LUMINARAUNDULI" ||
							character.id === "KITFISTO" ||
							character.id === "PLOKOON" ||
							character.id === "QUIGONJINN" ||
							character.id === "AAYLASECURA" ||
							character.id === "B2SUPERBATTLEDROID" ||
							character.id === "MAGNAGUARD" ||
							character.id === "DROIDEKA" ||
							character.id === "B1BATTLEDROIDV2" ||
							character.id === "STAP" ||
							character.id === "R2D2_LEGENDARY" ||
							character.id === "JEDIKNIGHTGUARDIAN" ||
							character.id === "EETHKOTH" ||
							character.id === "JEDIKNIGHTCONSULAR"
						);
					},
				},
			],
			[
				"Naboo-QA",
				{
					id: "Naboo-QA",
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
				"Naboo-Maul/Sidious/Nute",
				{
					id: "Naboo-Maul/Sidious/Nute",
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
				"Naboo-Gungans",
				{
					id: "Naboo-Gungans",
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
				"Naboo-KB",
				{
					id: "Naboo-KB",
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
				"Naboo-Lumi",
				{
					id: "Naboo-Lumi",
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
				"Naboo-B2",
				{
					id: "Naboo-B2",
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

const charactersManagement$: ObservableObject<CharactersManagementObservable> =
	observable<CharactersManagementObservable>({
		filterSetup: getDefaultFilterSetup(),
		activeCustomFilter: () => {
			const id = charactersManagement$.filterSetup.customFilterId.get();
			const customFilterById =
				charactersManagement$.filterSetup.customFilterById.get();
			if (customFilterById.has(id) === false)
				return (character: Character) => true;
			return (
				customFilterById.get(id)?.filterPredicate ??
				((character: Character) => true)
			);
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

const syncStatus$ = syncObservable(
	charactersManagement$.filterSetup,
	persistOptions({
		persist: {
			name: "CharactersManagement",
			indexedDB: {
				itemID: "filterSetup",
			},
		},
		initial: getDefaultFilterSetup(),
	}),
);
await when(syncStatus$.isPersistLoaded);

export { charactersManagement$ };
