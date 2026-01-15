// utils
import * as v from "valibot";

// domain
import {
	CharacterTemplateByNameSchema,
	CompilationSchemaV18,
	CompilationSchemaV20,
	CompilationSchemaV22,
	CurrenciesSchemaV24,
	DatacronsSchemaV24,
	LockedStatusByCharacterIdSchemaV20,
	LockedStatusByCharacterIdSchemaV18,
	MaterialsSchemaV24,
	ModsViewSetupsSchema,
	ModsViewSetupsSchemaV19,
	PersistedProfilesSchemaV18,
	PersistedProfilesSchemaV21,
	PersistedProfilesSchemaV23,
	SettingsByProfileSchema,
	HotutilsSchemaV18,
	HotutilsSchemaV21,
	StackRankSchemaV25,
} from "./index";

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
	version: v.literal(19),
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
	version: v.literal(20),
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
type ModsManagerBackupDataSchemaV21Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV21
>;

const ModsManagerBackupSchemaV21 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV21,
	version: v.literal(21),
});

const ModsManagerBackupDataSchemaV22 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV22)),
	defaultCompilation: CompilationSchemaV22,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV21,
	sessionIds: HotutilsSchemaV21,
	settings: SettingsByProfileSchema,
});
type ModsManagerBackupDataSchemaV22Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV22
>;

const ModsManagerBackupSchemaV22 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV22,
	version: v.literal(22),
});

const ModsManagerBackupDataSchemaV23 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV22)),
	defaultCompilation: CompilationSchemaV22,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV23,
	sessionIds: HotutilsSchemaV21,
	settings: SettingsByProfileSchema,
});
type ModsManagerBackupDataSchemaV23Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV23
>;

const ModsManagerBackupSchemaV23 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV23,
	version: v.literal(23),
});

const ModsManagerBackupDataSchemaV24 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV22)),
	currencies: CurrenciesSchemaV24,
	datacrons: DatacronsSchemaV24,
	defaultCompilation: CompilationSchemaV22,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	materials: MaterialsSchemaV24,
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV23,
	sessionIds: HotutilsSchemaV21,
	settings: SettingsByProfileSchema,
});

const ModsManagerBackupSchemaV24 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV24,
	version: v.literal(24),
});
type ModsManagerBackupDataSchemaV24Output = v.InferOutput<
	typeof ModsManagerBackupDataSchemaV24
>;

const ModsManagerBackupDataSchemaV25 = v.object({
	characterTemplates: CharacterTemplateByNameSchema,
	compilations: v.map(v.string(), v.map(v.string(), CompilationSchemaV22)),
	currencies: CurrenciesSchemaV24,
	datacrons: DatacronsSchemaV24,
	defaultCompilation: CompilationSchemaV22,
	incrementalOptimizationIndices: v.record(v.string(), v.nullable(v.number())),
	lockedStatus: v.record(v.string(), LockedStatusByCharacterIdSchemaV20),
	materials: MaterialsSchemaV24,
	modsViewSetups: ModsViewSetupsSchemaV19,
	profilesManagement: PersistedProfilesSchemaV23,
	sessionIds: HotutilsSchemaV21,
	settings: SettingsByProfileSchema,
	stackRank: StackRankSchemaV25,
});

const ModsManagerBackupSchemaV25 = v.object({
	appVersion: v.string(),
	backupType: v.literal("fullBackup"),
	client: v.literal("mods-manager"),
	data: ModsManagerBackupDataSchemaV25,
	version: v.literal(25),
});

const LatestModsManagerBackupDataSchema = ModsManagerBackupDataSchemaV25;
type LatestModsManagerBackupDataSchemaOutput = v.InferOutput<
	typeof LatestModsManagerBackupDataSchema
>;

const LatestModsManagerBackupSchema = ModsManagerBackupSchemaV25;
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
	ModsManagerBackupSchemaV22,
	ModsManagerBackupSchemaV23,
	ModsManagerBackupSchemaV24,
	ModsManagerBackupSchemaV25,
	type ModsManagerBackupSchemaV16Output,
	type ModsManagerBackupSchemaV18Output,
	type ModsManagerBackupDataSchemaV19Output,
	type ModsManagerBackupSchemaV19Output,
	type ModsManagerBackupDataSchemaV20Output,
	type ModsManagerBackupSchemaV20Output,
	type ModsManagerBackupDataSchemaV21Output,
	type ModsManagerBackupDataSchemaV22Output,
	type ModsManagerBackupDataSchemaV23Output,
	type ModsManagerBackupDataSchemaV24Output,
	ModsManagerSchema,
};
