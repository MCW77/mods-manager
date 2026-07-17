// utils
import * as v from "valibot";

// domain
import { GIMOFlatModSchema } from "./index";

const PersistedModByIdForProfileByAllycodeSchema = v.record(
	v.string(),
	v.object({
		id: v.string(),
		modById: v.map(v.string(), GIMOFlatModSchema),
	}),
);

const PersistedModsSchemaV27 = PersistedModByIdForProfileByAllycodeSchema;
export { PersistedModByIdForProfileByAllycodeSchema, PersistedModsSchemaV27 };
