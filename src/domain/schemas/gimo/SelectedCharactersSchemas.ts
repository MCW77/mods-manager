// utils
import * as v from "valibot";

// domain
import { ArbitraryCharacterNamesSchema } from "./CharacterNamesSchemas.js";
import { OptimizationPlanSchema } from "./OptimizationPlanSchemas.js";

const SelectedCharactersSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchema,
	}),
);

export { SelectedCharactersSchema };
