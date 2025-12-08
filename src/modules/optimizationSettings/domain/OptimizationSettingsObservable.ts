// state
import type { Observable } from "@legendapp/state";

// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings.js";

import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames.js";

import type { Mod } from "#/domain/Mod.js";
import type * as Character from "#/domain/Character.js";
import type { ModLoadout } from "#/domain/ModLoadout.js";
import type { OptimizationPlan } from "#/domain/OptimizationPlan.js";
import type { CharacterSummaryStats as CSStats } from "#/domain/Stats.js";

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettingsObservable {
	persistedData: {
		id: "settingsByProfile";
		settingsByProfile: SettingsByProfile;
	};
	activeSettings: () => ProfileOptimizationSettings;
	settingsByProfile: () => Observable<SettingsByProfile>;
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
	getSummary: (
		modLoadout: ModLoadout,
		character: Character.Character,
		withUpgrades: boolean,
	) => {
		[key in CharacterStatNames.All]: CSStats.CharacterSummaryStat;
	};
	shouldLevelMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldSliceMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldUpgradeMods: (target: OptimizationPlan) => boolean;
}

export type { OptimizationSettingsObservable, SettingsByProfile };
