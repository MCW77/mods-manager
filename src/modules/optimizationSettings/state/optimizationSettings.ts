// state
import { type ObservableObject, observable, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";
import type { Mod } from "#/domain/Mod";
import type * as Character from "#/domain/Character";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import { type Stats, CharacterSummaryStats as CSStats } from "#/domain/Stats";

const CSStat = CSStats.CharacterSummaryStat;
type CSStat = CSStats.CharacterSummaryStat;

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettings {
	activeSettings: () => ProfileOptimizationSettings;
	settingsByProfile: SettingsByProfile;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
	getStatSummaryForCharacter: (
		mod: Mod,
		character: Character.Character,
		withUpgrades: boolean,
	) => {
		[key in CharacterStatNames.All]: CSStats.CharacterSummaryStat;
	};
	shouldLevelMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldSliceMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldUpgradeMods: (target: OptimizationPlan) => boolean;
}

const optimizationSettings$: ObservableObject<OptimizationSettings> =
	observable<OptimizationSettings>({
		activeSettings: () => {
			return optimizationSettings$.settingsByProfile[
				profilesManagement$.profiles.activeAllycode.get()
			].get() as ProfileOptimizationSettings;
		},
		settingsByProfile: {},
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
				const flatStats = modStat.getFlatValuesForCharacter(character);
				for (const stat of flatStats) {
					summary[stat.type as CharacterStatNames.All] =
						summary[stat.type as CharacterStatNames.All].plus(stat);
				}
			}

			return summary;
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
	optimizationSettings$.settingsByProfile,
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
