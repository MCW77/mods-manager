// state
import { type ObservableObject, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";

// domain
import * as ModConsts from "#/domain/constants/ModConsts";
import setBonuses from "#/constants/setbonuses";

import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";
import { levelUpMod, sliceMod, type Mod } from "#/domain/Mod";
import type * as Character from "#/domain/Character";
import {
	type CharacterSummaryStat,
	addCSStats,
	createCharacterSummaryStat,
	getDisplayType,
} from "#/domain/CharacterSummaryStat";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import { statNames } from "#/domain/SetStat";
import {
	type DisplayStatNames,
	mixedTypes,
	updateDisplayValue,
	getStatValue,
	setStatValue,
} from "#/domain/Stat";
import type { OptimizationSettingsObservable } from "../domain/OptimizationSettingsObservable";
import type { ModLoadout } from "#/domain/ModLoadout";
import type { SetBonus } from "#/domain/SetBonus";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";

const optimizationSettings$: ObservableObject<OptimizationSettingsObservable> =
	observable<OptimizationSettingsObservable>({
		persistedData: {
			id: "settingsByProfile",
			settingsByProfile: {},
		},
		activeSettings: () => {
			return optimizationSettings$.settingsByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			].get() as ProfileOptimizationSettings;
		},
		activeSettings2: () => {
			return optimizationSettings$.persistedData.settingsByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			];
		},
		settingsByProfile: () => {
			return optimizationSettings$.persistedData.settingsByProfile;
		},
		addProfile: (allycode: string) => {
			if (
				Object.hasOwn(optimizationSettings$.settingsByProfile.peek(), allycode)
			) {
				return;
			}
			optimizationSettings$.settingsByProfile.set({
				...optimizationSettings$.settingsByProfile.peek(),
				[allycode]: {
					forceCompleteSets: false,
					lockUnselectedCharacters: false,
					modChangeThreshold: 0,
					simulate6EModSlice: false,
					simulateLevel15Mods: true,
					optimizeWithPrimaryAndSetRestrictions: false,
				},
			});
		},
		reset: () => {
			syncStatus$.reset();
		},
		deleteProfile: (allycode: string) => {
			optimizationSettings$.settingsByProfile[allycode].delete();
		},
		shouldLevelMod(mod: Mod, target: OptimizationPlan) {
			return optimizationSettings$.shouldUpgradeMods(target) && mod.level < 15;
		},
		shouldSliceMod: (mod: Mod, target: OptimizationPlan) => {
			return (
				optimizationSettings$.activeSettings.simulate6EModSlice.peek() &&
				mod.pips === 5 &&
				(mod.level === 15 || optimizationSettings$.shouldLevelMod(mod, target))
			);
		},
		shouldUpgradeMods: (target: OptimizationPlan) => {
			return (
				optimizationSettings$.activeSettings.simulateLevel15Mods.peek() ||
				target.targetStats.length > 0
			);
		},
		getStatSummaryForCharacter(
			mod: Mod,
			character: Character.Character,
			withUpgrades = true,
		) {
			let workingMod = mod;
			const summary: {
				[key in CharacterStatNames.All]: CharacterSummaryStat;
			} = {
				Health: createCharacterSummaryStat("Health", "0"),
				Protection: createCharacterSummaryStat("Protection", "0"),
				Speed: createCharacterSummaryStat("Speed", "0"),
				"Critical Damage %": createCharacterSummaryStat(
					"Critical Damage %",
					"0",
				),
				"Potency %": createCharacterSummaryStat("Potency %", "0"),
				"Tenacity %": createCharacterSummaryStat("Tenacity %", "0"),
				"Physical Damage": createCharacterSummaryStat("Physical Damage", "0"),
				"Physical Critical Chance %": createCharacterSummaryStat(
					"Physical Critical Chance %",
					"0",
				),
				Armor: createCharacterSummaryStat("Armor", "0"),
				"Special Damage": createCharacterSummaryStat("Special Damage", "0"),
				"Special Critical Chance %": createCharacterSummaryStat(
					"Special Critical Chance %",
					"0",
				),
				Resistance: createCharacterSummaryStat("Resistance", "0"),
				"Accuracy %": createCharacterSummaryStat("Accuracy %", "0"),
				"Critical Avoidance %": createCharacterSummaryStat(
					"Critical Avoidance %",
					"0",
				),
			};

			if (withUpgrades) {
				// Upgrade or slice each mod as necessary based on the optimizer settings and level of the mod
				if (
					15 > workingMod.level &&
					optimizationSettings$.activeSettings.simulateLevel15Mods.peek()
				) {
					workingMod = levelUpMod(workingMod);
				}
				if (
					15 === workingMod.level &&
					5 === workingMod.pips &&
					optimizationSettings$.activeSettings.simulate6EModSlice.peek()
				) {
					workingMod = sliceMod(workingMod);
				}
			}

			const flatStats = charactersManagement$.getFlatValuesForCharacter(
				character,
				workingMod.primaryStat,
			);

			for (const secondaryStat of workingMod.secondaryStats) {
				flatStats.push(
					...charactersManagement$.getFlatValuesForCharacter(
						character,
						secondaryStat,
					),
				);
			}

			for (const stat of flatStats) {
				summary[stat.type as CharacterStatNames.All] = addCSStats(
					summary[stat.type as CharacterStatNames.All],
					stat,
				);
			}

			return summary;
		},
		getSummary(
			modLoadout: ModLoadout,
			character: Character.Character,
			withUpgrades: boolean,
		) {
			const loadoutSummary: {
				[key in CharacterStatNames.All]: CharacterSummaryStat;
			} = {
				Health: createCharacterSummaryStat("Health", "0"),
				Protection: createCharacterSummaryStat("Protection", "0"),
				Speed: createCharacterSummaryStat("Speed", "0"),
				"Critical Damage %": createCharacterSummaryStat(
					"Critical Damage %",
					"0",
				),
				"Potency %": createCharacterSummaryStat("Potency %", "0"),
				"Tenacity %": createCharacterSummaryStat("Tenacity %", "0"),
				"Physical Damage": createCharacterSummaryStat("Physical Damage", "0"),
				"Physical Critical Chance %": createCharacterSummaryStat(
					"Physical Critical Chance %",
					"0",
				),
				Armor: createCharacterSummaryStat("Armor", "0"),
				"Special Damage": createCharacterSummaryStat("Special Damage", "0"),
				"Special Critical Chance %": createCharacterSummaryStat(
					"Special Critical Chance %",
					"0",
				),
				Resistance: createCharacterSummaryStat("Resistance", "0"),
				"Accuracy %": createCharacterSummaryStat("Accuracy %", "0"),
				"Critical Avoidance %": createCharacterSummaryStat(
					"Critical Avoidance %",
					"0",
				),
			};

			// Holds the number of mods in each set
			const smallSetCounts = new WeakMap();
			// Hold the number of mods in each set that have been or will be leveled fully (thus providing the max set bonus)
			const maxSetCounts = new WeakMap();

			for (const slot of ModConsts.gimoSlots) {
				const mod = modLoadout[slot];
				if (null === mod) {
					continue;
				}
				const set: SetBonus = setBonuses[mod.modset];

				const modStats = optimizationSettings$.getStatSummaryForCharacter(
					mod,
					character,
					withUpgrades,
				);
				let stat: CharacterStatNames.All;
				for (stat in modStats) {
					loadoutSummary[stat] = loadoutSummary[stat]
						? addCSStats(loadoutSummary[stat], modStats[stat])
						: modStats[stat];
				}

				// Get a count of how many mods are in each set
				const currentSmallCount = smallSetCounts.get(set) || 0;
				const currentMaxCount = maxSetCounts.get(set) || 0;
				if (set) {
					smallSetCounts.set(set, currentSmallCount + 1);
					if (
						(withUpgrades &&
							optimizationSettings$.activeSettings.simulateLevel15Mods.peek()) ||
						15 === mod.level
					) {
						maxSetCounts.set(set, currentMaxCount + 1);
					}
				}
			}

			// Update the summary for each stat from each complete mod set
			for (const setKey of statNames) {
				const setDescription = setBonuses[setKey];

				// Add in any set bonuses
				// leveled or upgraded mods
				const maxSetMultiplier = Math.floor(
					(maxSetCounts.get(setDescription) || 0) /
						setDescription.numberOfModsRequired,
				);

				// Add in any set bonuses from unleveled mods
				const smallSetCount = smallSetCounts.get(setDescription);
				smallSetCounts.set(
					setDescription,
					smallSetCount -
						setDescription.numberOfModsRequired * maxSetMultiplier,
				);
				const smallSetMultiplier = Math.floor(
					(smallSetCounts.get(setDescription) || 0) /
						setDescription.numberOfModsRequired,
				);

				const maxSetStats = charactersManagement$.getFlatValuesForCharacter(
					character,
					setDescription.maxBonus,
				);
				for (const stat of maxSetStats) {
					for (let i = 0; i < maxSetMultiplier; i++) {
						loadoutSummary[stat.type as CharacterStatNames.All] = addCSStats(
							loadoutSummary[stat.type as CharacterStatNames.All],
							stat,
						);
					}
				}

				const smallSetStats = charactersManagement$.getFlatValuesForCharacter(
					character,
					setDescription.smallBonus,
				);
				for (const stat of smallSetStats) {
					for (let i = 0; i < smallSetMultiplier; i++) {
						loadoutSummary[stat.type as CharacterStatNames.All] = addCSStats(
							loadoutSummary[stat.type as CharacterStatNames.All],
							stat,
						);
					}
				}
			}

			// Update the summary to mark the stats that should always be displayed as percentages
			// Also update all stats to be the correct precision
			for (const stat of Object.values(loadoutSummary)) {
				if (!mixedTypes.includes(getDisplayType(stat) as DisplayStatNames)) {
					stat.displayModifier = "%";
				} else {
					setStatValue(stat, Math.trunc(getStatValue(stat)));
				}
				updateDisplayValue(stat);
			}

			return loadoutSummary;
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	optimizationSettings$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		optimizationSettings$.reset();
		return;
	}
	optimizationSettings$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	optimizationSettings$.persistedData,
	persistOptions({
		persist: {
			name: "OptimizationSettings",
			indexedDB: {
				itemID: "settingsByProfile",
			},
		},
		initial: {},
	}),
);

export { optimizationSettings$, syncStatus$ };
