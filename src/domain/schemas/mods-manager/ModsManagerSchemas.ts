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

const ModsManagerBackupSchemaV16 = v.pipe(
	v.object({
		characterTemplates: CharacterTemplateByNameSchema,
		lastRuns: v.array(v.any()),
		profilesManagement: v.object({}),
		version: v.string(),
	}),
	v.transform((input) => ({
		characterTemplates: input.characterTemplates,
		compilations: {},
		defaultCompilation: undefined,
		incrementalOptimizationIndices: {},
		lockedStatus: {},
		modsViewSetups: undefined,
		profilesManagement: undefined,
		sessionIds: {},
		settings: undefined,
		version: input.version,
		client: "mods-manager",
	})),
);

const ModsManagerBackupSchemaV18 = v.object({
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

const LatestModsManagerBackupDataSchema = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.exactOptional(
		v.record(v.string(), v.record(v.string(), CompilationSchema)),
		{},
	),
	defaultCompilation: v.exactOptional(v.optional(CompilationSchema)),
	incrementalOptimizationIndices: v.exactOptional(
		v.record(v.string(), v.nullable(v.number())),
		{},
	),
	lockedStatus: v.exactOptional(
		v.record(v.string(), LockedStatusByCharacterIdSchema),
		{},
	),
	modsViewSetups: v.exactOptional(v.optional(ModsViewSetupsSchema)),
	profilesManagement: v.exactOptional(v.optional(PersistedProfilesSchema)),
	sessionIds: v.exactOptional(v.record(v.string(), v.string()), {}),
	settings: v.exactOptional(v.optional(SettingsByProfileSchema)),
});
type LatestModsManagerBackupDataSchemaOutput = v.InferOutput<
	typeof LatestModsManagerBackupDataSchema
>;

const LatestModsManagerBackupSchema = v.object({
	data: LatestModsManagerBackupDataSchema,
	backupType: v.literal("fullBackup"),
	version: v.number(),
	client: v.exactOptional(v.literal("mods-manager"), "mods-manager"),
});
type LatestModsManagerBackupSchemaOutput = v.InferOutput<
	typeof LatestModsManagerBackupSchema
>;

const ModsManagerSchema = v.object({
	client: v.literal("mods-manager"),
});

export {
	LatestModsManagerBackupSchema,
	type LatestModsManagerBackupSchemaOutput,
	type LatestModsManagerBackupDataSchemaOutput,
	ModsManagerBackupSchemaV16,
	ModsManagerBackupSchemaV18,
	ModsManagerSchema,
};
