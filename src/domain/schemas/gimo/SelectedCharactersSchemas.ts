// utils
import * as v from "valibot";

// domain
import { ArbitraryCharacterNamesSchema } from "./CharacterNamesSchemas";
import { OptimizationPlanSchema, OptimizationPlanOutputSchema } from "./OptimizationPlanSchemas";

const SelectedCharactersSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchema,
	}),
);

const SelectedCharactersOutputSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanOutputSchema,
	}),
);

export { SelectedCharactersSchema, SelectedCharactersOutputSchema };
