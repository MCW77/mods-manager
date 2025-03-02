// state
import type { Observable } from "@legendapp/state";

// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";

import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";

import type { Mod } from "#/domain/Mod";
import type * as Character from "#/domain/Character";
import type { ModLoadout } from "#/domain/ModLoadout";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { CharacterSummaryStats as CSStats } from "#/domain/Stats";

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
	getOptimizationValue: (
		modLoadout: ModLoadout,
		character: Character.Character,
		target: OptimizationPlan,
		withUpgrades: boolean,
	) => number;
	shouldLevelMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldSliceMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldUpgradeMods: (target: OptimizationPlan) => boolean;
}

export type { OptimizationSettingsObservable, SettingsByProfile };
