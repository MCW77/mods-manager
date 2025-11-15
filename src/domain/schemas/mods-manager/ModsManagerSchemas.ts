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
	PersistedProfilesSchemaV18,
	PersistedProfilesSchemaV21,
	SettingsByProfileSchema,
	HotutilsSchemaV18,
	HotutilsSchemaV21,
} from "./index.js";

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
		defaultCompilation: {
			category: "",
			description: "",
			flatCharacterModdings: [],
			id: "DefaultCompilation",
			isReoptimizationNeeded: true,
			lastOptimized: null as Date | null,
			optimizationConditions: null,
			reoptimizationIndex: -1,
			selectedCharacters: [],
		},
		incrementalOptimizationIndices: {},
		lockedStatus: {},
		modsViewSetups: {
			AllMods: {},
			Calibrate: {},
			Level: {},
			Reveal: {},
			Slice5Dot: {},
			Slice6Dot: {},
			Slice6E: {},
		},
		profilesManagement: {
			activeAllycode: "",
			lastUpdatedByAllycode: {},
			playernameByAllycode: {},
			profileByAllycode: {},
		},
		sessionIds: {},
		settings: {},
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
	profilesManagement: PersistedProfilesSchemaV18,
	sessionIds: HotutilsSchemaV18,
	settings: SettingsByProfileSchema,
	version: v.string(),
	client: v.literal("mods-manager"),
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
	profilesManagement: PersistedProfilesSchemaV18,
	sessionIds: HotutilsSchemaV18,
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
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV20)),
	defaultCompilation: CompilationSchemaV20,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV18,
	sessionIds: HotutilsSchemaV18,
	settings: SettingsByProfileSchema,
});
type ModsManagerBackupDataSchemaV20Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV20
>;

const ModsManagerBackupSchemaV20 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV20,
	version: v.number(),
});
type ModsManagerBackupSchemaV20Output = v.InferOutput<
	typeof ModsManagerBackupSchemaV20
>;

const ModsManagerBackupDataSchemaV21 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV20)),
	defaultCompilation: CompilationSchemaV20,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV21,
	sessionIds: HotutilsSchemaV21,
	settings: SettingsByProfileSchema,
});

const ModsManagerBackupSchemaV21 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV21,
	version: v.number(),
});

const LatestModsManagerBackupDataSchema = ModsManagerBackupDataSchemaV21;
type LatestModsManagerBackupDataSchemaOutput = v.InferOutput<
	typeof LatestModsManagerBackupDataSchema
>;

const LatestModsManagerBackupSchema = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: LatestModsManagerBackupDataSchema,
	version: v.number(),
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
	ModsManagerBackupSchemaV21,
	type ModsManagerBackupSchemaV16Output,
	type ModsManagerBackupSchemaV18Output,
	type ModsManagerBackupDataSchemaV19Output,
	type ModsManagerBackupSchemaV19Output,
	type ModsManagerBackupDataSchemaV20Output,
	type ModsManagerBackupSchemaV20Output,
	ModsManagerSchema,
};
