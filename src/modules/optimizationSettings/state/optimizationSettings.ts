// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { charactersManagement$ } = await import(
	"#/modules/charactersManagement/state/charactersManagement"
);

// domain
import * as ModConsts from "#/domain/constants/ModConsts";
import setBonuses from "#/constants/setbonuses";

import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";
import type { Mod } from "#/domain/Mod";
import type * as Character from "#/domain/Character";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import {
	Stats,
	CharacterSummaryStats as CSStats,
	SetStats,
} from "#/domain/Stats";
import type { OptimizationSettingsObservable } from "../domain/OptimizationSettingsObservable";
import type { ModLoadout } from "#/domain/ModLoadout";
import type SetBonus from "#/domain/SetBonus";

const CSStat = CSStats.CharacterSummaryStat;
type CSStat = CSStats.CharacterSummaryStat;

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
		settingsByProfile: () => {
			return optimizationSettings$.persistedData.settingsByProfile;
		},
		addProfile: (allycode: string) => {
			return optimizationSettings$.settingsByProfile.set({
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
				[key in CharacterStatNames.All]: CSStats.CharacterSummaryStat;
			} = {
				Health: new CSStat("Health", "0"),
				Protection: new CSStat("Protection", "0"),
				Speed: new CSStat("Speed", "0"),
				"Critical Damage %": new CSStat("Critical Damage %", "0"),
				"Potency %": new CSStat("Potency %", "0"),
				"Tenacity %": new CSStat("Tenacity %", "0"),
				"Physical Damage": new CSStat("Physical Damage", "0"),
				"Physical Critical Chance %": new CSStat(
					"Physical Critical Chance %",
					"0",
				),
				Armor: new CSStat("Armor", "0"),
				"Special Damage": new CSStat("Special Damage", "0"),
				"Special Critical Chance %": new CSStat(
					"Special Critical Chance %",
					"0",
				),
				Resistance: new CSStat("Resistance", "0"),
				"Accuracy %": new CSStat("Accuracy %", "0"),
				"Critical Avoidance %": new CSStat("Critical Avoidance %", "0"),
			};

			if (withUpgrades) {
				// Upgrade or slice each mod as necessary based on the optimizer settings and level of the mod
				if (
					15 > workingMod.level &&
					optimizationSettings$.activeSettings.simulateLevel15Mods.peek()
				) {
					workingMod = workingMod.levelUp();
				}
				if (
					15 === workingMod.level &&
					5 === workingMod.pips &&
					optimizationSettings$.activeSettings.simulate6EModSlice.peek()
				) {
					workingMod = workingMod.slice();
				}
			}

			for (const modStat of [workingMod.primaryStat as Stats.Stat].concat(
				workingMod.secondaryStats,
			)) {
				const flatStats = charactersManagement$.getFlatValuesForCharacter(
					character,
					modStat,
				);
				for (const stat of flatStats) {
					summary[stat.type as CharacterStatNames.All] =
						summary[stat.type as CharacterStatNames.All].plus(stat);
				}
			}

			return summary;
		},
		getSummary(
			modLoadout: ModLoadout,
			character: Character.Character,
			withUpgrades: boolean,
		) {
			const loadoutSummary: {
				[key in CharacterStatNames.All]: CSStats.CharacterSummaryStat;
			} = {
				Health: new CSStats.CharacterSummaryStat("Health", "0"),
				Protection: new CSStats.CharacterSummaryStat("Protection", "0"),
				Speed: new CSStats.CharacterSummaryStat("Speed", "0"),
				"Critical Damage %": new CSStats.CharacterSummaryStat(
					"Critical Damage %",
					"0",
				),
				"Potency %": new CSStats.CharacterSummaryStat("Potency %", "0"),
				"Tenacity %": new CSStats.CharacterSummaryStat("Tenacity %", "0"),
				"Physical Damage": new CSStats.CharacterSummaryStat(
					"Physical Damage",
					"0",
				),
				"Physical Critical Chance %": new CSStats.CharacterSummaryStat(
					"Physical Critical Chance %",
					"0",
				),
				Armor: new CSStats.CharacterSummaryStat("Armor", "0"),
				"Special Damage": new CSStats.CharacterSummaryStat(
					"Special Damage",
					"0",
				),
				"Special Critical Chance %": new CSStats.CharacterSummaryStat(
					"Special Critical Chance %",
					"0",
				),
				Resistance: new CSStats.CharacterSummaryStat("Resistance", "0"),
				"Accuracy %": new CSStats.CharacterSummaryStat("Accuracy %", "0"),
				"Critical Avoidance %": new CSStats.CharacterSummaryStat(
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
						? loadoutSummary[stat].plus(modStats[stat])
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
			for (const setKey of SetStats.SetStat.statNames) {
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
						loadoutSummary[stat.type as CharacterStatNames.All] =
							loadoutSummary[stat.type as CharacterStatNames.All].plus(stat);
					}
				}

				const smallSetStats = charactersManagement$.getFlatValuesForCharacter(
					character,
					setDescription.smallBonus,
				);
				for (const stat of smallSetStats) {
					for (let i = 0; i < smallSetMultiplier; i++) {
						loadoutSummary[stat.type as CharacterStatNames.All] =
							loadoutSummary[stat.type as CharacterStatNames.All].plus(stat);
					}
				}
			}

			// Update the summary to mark the stats that should always be displayed as percentages
			// Also update all stats to be the correct precision
			for (const stat of Object.values(loadoutSummary)) {
				if (
					!Stats.Stat.mixedTypes.includes(
						stat.getDisplayType() as Stats.DisplayStatNames,
					)
				) {
					stat.displayModifier = "%";
				} else {
					stat.value = Math.trunc(stat.value);
				}
				stat.updateDisplayValue();
			}

			return loadoutSummary;
		},
		getOptimizationValue(
			modLoadout: ModLoadout,
			character: Character.Character,
			target: OptimizationPlan,
			withUpgrades = false,
		) {
			return Object.values(
				optimizationSettings$.getSummary(modLoadout, character, withUpgrades),
			).reduce(
				(setValue, stat) =>
					setValue +
					charactersManagement$.getOptimizationValue(character, target, stat),
				0,
			);
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
await when(syncStatus$.isPersistLoaded);

export { optimizationSettings$ };
