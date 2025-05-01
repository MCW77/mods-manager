// utils
import * as v from "valibot";

// domain
import {
	CharacterTemplateByNameSchema,
	CompilationSchema,
	LockedStatusByCharacterIdSchema,
	ModsViewSetupsSchema,
	PersistedProfilesSchema,
	SettingsByProfileSchema,
} from "./";

const ModsManagerBackupSchema = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.record(v.string(), v.record(v.string(), CompilationSchema)),
	defaultCompilation: CompilationSchema,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchema),
	modsViewSetups: ModsViewSetupsSchema,
	profilesManagement: PersistedProfilesSchema,
	sessionIds: v.record(v.string(), v.string()),
	settings: SettingsByProfileSchema,
	version: v.string(),
	client: v.exactOptional(v.literal("mods-manager"), "mods-manager"),
});

const ModsManagerSchema = v.object({
	client: v.literal("mods-manager"),
});

export { ModsManagerBackupSchema, ModsManagerSchema };
