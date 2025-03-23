// utils
import * as v from "valibot";

// domain
import {
	CharacterByIdSchema,
	KnownCharacterNamesSchema,
	LockedStatusByCharacterIdSchema,
	OptimizationPlanSchema,
	ProfileOptimizationSettingsSchema,
	SelectedCharactersSchema,
	TargetStatSchema,
} from "./";

const MissedGoalSchema = v.tuple([TargetStatSchema, v.number()]);
const MissedGoalsSchema = v.array(MissedGoalSchema);

const OptimizationConditionsSchema = v.nullable(
	v.object({
		characterById: CharacterByIdSchema,
		globalSettings: ProfileOptimizationSettingsSchema,
		lockedStatus: LockedStatusByCharacterIdSchema,
		modCount: v.number(),
		selectedCharacters: SelectedCharactersSchema,
	}),
);

const CompilationSchema = v.object({
	id: v.string(),
	category: v.string(),
	description: v.string(),
	hasSelectionChanged: v.boolean(),
	lastOptimized: v.nullable(v.date()),
	optimizationConditions: OptimizationConditionsSchema,
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

export { CompilationSchema };
