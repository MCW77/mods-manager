// utils
import * as v from "valibot";

// domain
import {
	ArbitraryCharacterNamesSchema,
	OptimizationPlanSchema,
	OptimizationPlanSchemaV26,
} from "./index";

const SelectedCharactersSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchema,
	}),
);

const SelectedCharactersSchemaV26 = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchemaV26,
	}),
);

export { SelectedCharactersSchema, SelectedCharactersSchemaV26 };
