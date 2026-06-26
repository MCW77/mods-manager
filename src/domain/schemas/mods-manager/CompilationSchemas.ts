// utils
import * as v from "valibot";

// domain
import {
	CharacterByIdSchema,
	KnownCharacterNamesSchema,
	LockedStatusByCharacterIdSchemaV18,
	OptimizationPlanSchema,
	OptimizationPlanSchemaV26,
	ProfileOptimizationSettingsSchema,
	SelectedCharactersSchema,
	SelectedCharactersSchemaV26,
	TargetStatSchema,
} from "./index";

const MissedGoalSchema = v.tuple([TargetStatSchema, v.number()]);
const MissedGoalsSchema = v.array(MissedGoalSchema);

const OptimizationConditionsSchemaV18 = v.nullable(
	v.object({
		characterById: CharacterByIdSchema,
		globalSettings: ProfileOptimizationSettingsSchema,
		lockedStatus: LockedStatusByCharacterIdSchemaV18,
		modCount: v.number(),
		selectedCharacters: SelectedCharactersSchema,
	}),
);

const OptimizationConditionsSchemaV20 = v.nullable(
	ProfileOptimizationSettingsSchema,
);

const CompilationSchemaV18 = v.object({
	id: v.string(),
	category: v.string(),
	description: v.string(),
	hasSelectionChanged: v.boolean(),
	lastOptimized: v.nullable(v.date()),
	optimizationConditions: OptimizationConditionsSchemaV18,
	selectedCharacters: SelectedCharactersSchema,
	flatCharacterModdings: v.array(
		v.object({
			assignedMods: v.array(v.string()),
			characterId: KnownCharacterNamesSchema,
			messages: v.optional(v.array(v.string())),
			missedGoals: MissedGoalsSchema,
			target: OptimizationPlanSchema,
		}),
	),
});

const CompilationSchemaV20 = v.object({
	category: v.string(),
	description: v.string(),
	flatCharacterModdings: v.array(
		v.object({
			assignedMods: v.array(v.string()),
			characterId: KnownCharacterNamesSchema,
			messages: v.optional(v.array(v.string())),
			missedGoals: MissedGoalsSchema,
			target: OptimizationPlanSchema,
		}),
	),
	id: v.string(),
	isReoptimizationNeeded: v.boolean(),
	lastOptimized: v.nullable(v.date()),
	optimizationConditions: OptimizationConditionsSchemaV20,
	reoptimizationIndex: v.number(),
	selectedCharacters: SelectedCharactersSchema,
});

const CompilationSchemaV22 = v.object({
	category: v.string(),
	description: v.string(),
	flatCharacterModdings: v.array(
		v.object({
			assignedMods: v.array(v.string()),
			characterId: KnownCharacterNamesSchema,
			messages: v.optional(v.array(v.string())),
			missedGoals: MissedGoalsSchema,
			target: OptimizationPlanSchema,
			currentScore: v.number(),
			previousScore: v.number(),
		}),
	),
	id: v.string(),
	isReoptimizationNeeded: v.boolean(),
	lastOptimized: v.nullable(v.date()),
	optimizationConditions: OptimizationConditionsSchemaV20,
	reoptimizationIndex: v.number(),
	selectedCharacters: SelectedCharactersSchema,
});

const CompilationSchemaV26 = v.object({
	category: v.string(),
	description: v.string(),
	flatCharacterModdings: v.array(
		v.object({
			assignedMods: v.array(v.string()),
			characterId: KnownCharacterNamesSchema,
			messages: v.optional(v.array(v.string())),
			missedGoals: MissedGoalsSchema,
			target: OptimizationPlanSchemaV26,
			currentScore: v.number(),
			previousScore: v.number(),
		}),
	),
	id: v.string(),
	isReoptimizationNeeded: v.boolean(),
	lastOptimized: v.nullable(v.date()),
	optimizationConditions: OptimizationConditionsSchemaV20,
	reoptimizationIndex: v.number(),
	selectedCharacters: SelectedCharactersSchemaV26,
});

export { CompilationSchemaV26, CompilationSchemaV22, CompilationSchemaV20, CompilationSchemaV18 };
