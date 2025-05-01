// utils
import * as v from "valibot";

// domain
import { ArbitraryCharacterNamesSchema } from "./CharacterNamesSchemas";
import { OptimizationPlanSchema } from "./OptimizationPlanSchemas";

const SelectedCharactersSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchema,
	}),
);

export { SelectedCharactersSchema };
