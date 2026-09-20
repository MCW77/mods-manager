// utils
import * as v from "valibot";

// domain
import {
	ArbitraryCharacterNamesSchema,
	OptimizationPlanSchema,
	OptimizationPlanSchemaV26,
	OptimizationPlanSchemaV31,
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

const SelectedCharactersSchemaV31 = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchemaV31,
	}),
);

export {
	SelectedCharactersSchema,
	SelectedCharactersSchemaV26,
	SelectedCharactersSchemaV31,
};
