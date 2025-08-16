// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);
const { characters$ } = await import("#/modules/characters/state/characters");

// domain
import {
	createCustomCharacterFilter,
	createTextCharacterFilter,
	type TextFilter,
	type CharacterFilter,
	type CustomFilter,
} from "../domain/CharacterFilterById";
import type { CharactersManagementObservable } from "../domain/CharactersManagementObservable";

import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";

import type { Character } from "#/domain/Character";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import { Stat } from "#/domain/Stat";
import { CharacterSummaryStats as CSStats } from "#/domain/Stats";

const addCategoryFilter = (
	customFilterById: Map<string, CustomFilter>,
	category: string,
) => {
	const filterString = category.replace("Role--", "").replace("Faction--", "");
	const categoryFilter = createCustomCharacterFilter(
		category,
		(character: Character) => {
			return characters$.baseCharacterById[character.id].categories.includes(
				filterString,
			);
		},
	);
	customFilterById.set(category, categoryFilter);
};

const getDefaultFilterSetup = () => {
	const result = {
		id: "filterSetup",
		filterSetup: {
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
					"Has Stat Targets",
					{
						id: "Has Stat Targets",
						type: "custom",
						filter: "Has Stat Targets",
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
							if (modsAssignedToCharacter !== undefined)
								return modsAssignedToCharacter.assignedMods.length < 6;
							const modsEquippedOnCharacter = [
								...profilesManagement$.activeProfile.modById.peek().values(),
							].filter((mod) => mod.characterID === character.id);
							return modsEquippedOnCharacter.length < 6;
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
							if (modsAssignedToCharacter !== undefined) {
								const modsAssignedToCharacter2 = {
									...modsAssignedToCharacter,
									assignedMods: modsAssignedToCharacter.assignedMods
										.map((modId) => {
											return profilesManagement$.activeProfile.modById
												.peek()
												.get(modId);
										})
										.filter((mod) => mod !== undefined),
								};
								return modsAssignedToCharacter2.assignedMods.some(
									(mod) => mod.level < 15,
								);
							}
							const modsEquippedOnCharacter = [
								...profilesManagement$.activeProfile.modById.peek().values(),
							].filter((mod) => mod.characterID === character.id);
							return modsEquippedOnCharacter.some((mod) => mod.level < 15);
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
		},
	} as const;
	for (const role of [
		"Attacker",
		"Crew Member",
		"Fleet Commander",
		"Galactic Legend",
		"Healer",
		"Leader",
		"[c][ffff33]Order 66 Raid[-][/c]",
		"Support",
		"Tank",
	]) {
		addCategoryFilter(result.filterSetup.customFilterById, `Role--${role}`);
	}
	for (const faction of [
		"501st",
		"Bad Batch",
		"Bounty Hunter",
		"Clone Trooper",
		"Droid",
		"Empire",
		"Ewok",
		"First Order",
		"Galactic Republic",
		"Geonosian",
		"Gungan",
		"Hutt Cartel",
		"Imperial Remnant",
		"Imperial Trooper",
		"Inquisitorius",
		"Jawa",
		"Jedi",
		"Jedi Vanguard",
		"Mandalorian",
		"Mercenary",
		"Nightsister",
		"Old Republic",
		"Phoenix",
		"Pirate",
		"Rebel",
		"Rebel Fighter",
		"Resistance",
		"Rogue One",
		"Scoundrel",
		"Separatist",
		"Sith",
		"Sith Empire",
		"Smuggler",
		"Spectre",
		"Tusken",
		"Unaligned Force User",
		"Wookie",
	]) {
		addCategoryFilter(
			result.filterSetup.customFilterById,
			`Faction--${faction}`,
		);
	}
	return result;
};

const charactersManagement$: ObservableObject<CharactersManagementObservable> =
	observable<CharactersManagementObservable>({
		persistedData: getDefaultFilterSetup(),
		filterSetup: () => charactersManagement$.persistedData.filterSetup,
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
		/**
		 * Convert this stat to one or more with flat values, even if it had a percent-based value before
		 * @param character
		 * @returns {Array<Stat>}
		 */
		getFlatValuesForCharacter: (character: Character, stat: Stat) => {
			const statPropertyNames =
				Stat.display2CSGIMOStatNamesMap[stat.getDisplayType()];

			return statPropertyNames.map((statName) => {
				const displayName = Stat.gimo2DisplayStatNamesMap[statName];
				const statType: CharacterStatNames.All = (
					Stat.mixedTypes.includes(displayName)
						? displayName
						: `${displayName} %`
				) as CharacterStatNames.All;

				if (stat.isPercentVersion && character.playerValues?.baseStats) {
					return new CSStats.CharacterSummaryStat(
						statType,
						`${stat.bigValue
							.mul(character?.playerValues?.baseStats[statName] ?? 0)
							.div(100)
							.toNumber()}`,
					);
				}
				if (!stat.isPercentVersion) {
					return new CSStats.CharacterSummaryStat(statType, stat.valueString);
				}
				throw new Error(
					`Stat is given as a percentage, but ${character.id} has no base stats`,
				);
			});
		},
		/**
		 * Get the value of this stat for optimization
		 *
		 * @param character {Character}
		 * @param target {OptimizationPlan}
		 */
		getOptimizationValue: (
			character: Character,
			target: OptimizationPlan,
			stat: Stat,
		) => {
			// Optimization Plans don't have separate physical and special critical chances, since both are always affected
			// equally. If this is a physical crit chance stat, then use 'critChance' as the stat type. If it's special crit
			// chance, ignore it altogether.
			if (stat.getDisplayType() === "Special Critical Chance") {
				return 0;
			}

			type OptStats =
				| Readonly<CharacterStatNames.WithoutCC[]>
				| Readonly<"Critical Chance"[]>;

			const statTypes: OptStats =
				"Physical Critical Chance" === stat.getDisplayType()
					? ["Critical Chance"]
					: (Stat.display2CSGIMOStatNamesMap[
							stat.getDisplayType()
						] as CharacterStatNames.WithoutCC[]);

			if (!statTypes) {
				return 0;
			}

			if (stat.isPercentVersion) {
				return statTypes
					.map(
						(statType: CharacterStatNames.WithoutCC | "Critical Chance") =>
							target[statType] *
							Math.floor(
								(character.playerValues.baseStats[
									statType as CharacterStatNames.All
								] *
									stat.value) /
									100,
							),
					)
					.reduce((a, b) => a + b, 0);
			}
			return statTypes
				.map((statType: CharacterStatNames.WithoutCC | "Critical Chance") =>
					stat.bigValue.mul(target[statType]).toNumber(),
				)
				.reduce((a, b) => a + b, 0);
		},
	});

const syncStatus$ = syncObservable(
	charactersManagement$.persistedData,
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
