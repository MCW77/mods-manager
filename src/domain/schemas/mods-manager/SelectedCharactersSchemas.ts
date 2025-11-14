// utils
import * as v from "valibot";

// domain
import {
	ArbitraryCharacterNamesSchema,
	OptimizationPlanSchema,
} from "./index.js";

const SelectedCharactersSchema = v.array(
	v.object({
		id: ArbitraryCharacterNamesSchema,
		target: OptimizationPlanSchema,
	}),
);

export { SelectedCharactersSchema };
