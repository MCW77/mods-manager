// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";
import type { Mod } from "#/domain/Mod";
import type * as Character from "#/domain/Character";
import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { CharacterSummaryStats as CSStats } from "#/domain/Stats";
import { ModLoadout } from "#/domain/ModLoadout";

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettingsObservable {
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

export type { OptimizationSettingsObservable };
