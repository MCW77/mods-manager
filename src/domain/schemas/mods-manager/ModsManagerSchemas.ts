// utils
import * as v from "valibot";

// domain
import {
	CharacterTemplateByNameSchema,
	CompilationSchemaV18,
	CompilationSchemaV20,
	LockedStatusByCharacterIdSchemaV20,
	LockedStatusByCharacterIdSchemaV18,
	ModsViewSetupsSchema,
	ModsViewSetupsSchemaV19,
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
type ModsManagerBackupSchemaV16Output = v.InferOutput<
	typeof ModsManagerBackupSchemaV16
>;

const ModsManagerBackupSchemaV18 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.record(
		v.string(),
		v.record(v.string(), CompilationSchemaV18),
	),
	defaultCompilation: CompilationSchemaV18,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV18),
	modsViewSetups: ModsViewSetupsSchema,
	profilesManagement: PersistedProfilesSchema,
	sessionIds: v.record(v.string(), v.string()),
	settings: SettingsByProfileSchema,
	version: v.string(),
	client: v.exactOptional(v.literal("mods-manager"), "mods-manager"),
});
type ModsManagerBackupSchemaV18Output = v.InferOutput<
	typeof ModsManagerBackupSchemaV18
>;

const ModsManagerBackupDataSchemaV19 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV18)),
	defaultCompilation: CompilationSchemaV18,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV18),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchema,
	sessionIds: v.record(v.string(), v.string()),
	settings: SettingsByProfileSchema,
});
type ModsManagerBackupDataSchemaV19Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV19
>;

const ModsManagerBackupSchemaV19 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV19,
	version: v.number(),
});
type ModsManagerBackupSchemaV19Output = v.InferOutput<
	typeof ModsManagerBackupSchemaV19
>;

const ModsManagerBackupDataSchemaV20 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.record(
		v.string(),
		v.record(v.string(), CompilationSchemaV20),
	),
	defaultCompilation: CompilationSchemaV20,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchema,
	sessionIds: v.record(v.string(), v.string()),
	settings: SettingsByProfileSchema,
});

const ModsManagerBackupSchemaV20 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV20,
	version: v.number(),
});

const LatestModsManagerBackupDataSchema = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV20)),
	defaultCompilation: v.exactOptional(v.optional(CompilationSchemaV20)),
	incrementalOptimizationIndices: v.exactOptional(
		v.record(v.string(), v.nullable(v.number())),
		{},
	),
	lockedStatus: v.exactOptional(
		v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
		{},
	),
	modsViewSetups: v.exactOptional(v.optional(ModsViewSetupsSchemaV19)),
	profilesManagement: v.exactOptional(v.optional(PersistedProfilesSchema)),
	sessionIds: v.exactOptional(v.record(v.string(), v.string()), {}),
	settings: v.exactOptional(v.optional(SettingsByProfileSchema)),
});
type LatestModsManagerBackupDataSchemaOutput = v.InferOutput<
	typeof LatestModsManagerBackupDataSchema
>;
type Comp = LatestModsManagerBackupDataSchemaOutput["compilations"];

const LatestModsManagerBackupSchema = v.object({
	appVersion: v.string(),
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
	ModsManagerBackupSchemaV19,
	ModsManagerBackupSchemaV20,
	type ModsManagerBackupSchemaV16Output,
	type ModsManagerBackupSchemaV18Output,
	type ModsManagerBackupDataSchemaV19Output,
	type ModsManagerBackupSchemaV19Output,
	ModsManagerSchema,
};
