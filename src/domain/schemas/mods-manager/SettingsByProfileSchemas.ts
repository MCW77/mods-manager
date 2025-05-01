// utils
import * as v from "valibot";

const ProfileOptimizationSettingsSchema = v.object({
	forceCompleteSets: v.boolean(),
	lockUnselectedCharacters: v.boolean(),
	modChangeThreshold: v.number(),
	simulate6EModSlice: v.boolean(),
	simulateLevel15Mods: v.boolean(),
	optimizeWithPrimaryAndSetRestrictions: v.boolean(),
});

const SettingsByProfileSchema = v.record(
	v.string(),
	ProfileOptimizationSettingsSchema,
);

export { ProfileOptimizationSettingsSchema, SettingsByProfileSchema };
