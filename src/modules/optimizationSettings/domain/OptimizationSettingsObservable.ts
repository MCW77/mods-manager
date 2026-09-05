// state
import type { Observable } from "@legendapp/state";

// domain
import type { ProfileOptimizationSettings } from "../domain/ProfileOptimizationSettings";

import type * as Character from "#/domain/Character";
import type { CharacterSummary } from "#/domain/CharacterSummary";
import type { Mod } from "#/domain/Mod";
import type { ModLoadout } from "#/domain/ModLoadout";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

type SettingsByProfile = Record<string, ProfileOptimizationSettings>;

interface OptimizationSettingsObservable {
	persistedData: {
		id: "settingsByProfile";
		settingsByProfile: SettingsByProfile;
	};
	activeSettings: () => ProfileOptimizationSettings;
	activeSettings2: () => Observable<ProfileOptimizationSettings>;
	settingsByProfile: () => Observable<SettingsByProfile>;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
	getStatSummaryForCharacter: (
		mod: Mod,
		character: Character.Character,
		withUpgrades: boolean,
	) => CharacterSummary;
	getSummary: (
		modLoadout: ModLoadout,
		character: Character.Character,
		withUpgrades: boolean,
	) => CharacterSummary;
	shouldLevelMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldSliceMod: (mod: Mod, target: OptimizationPlan) => boolean;
	shouldUpgradeMods: (target: OptimizationPlan) => boolean;
}

export type { OptimizationSettingsObservable, SettingsByProfile };
