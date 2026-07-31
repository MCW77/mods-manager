// utils
import * as v from "valibot";

// domain
import { CharacterByIdSchemaV26 } from "./index";

const PersistedRosterSchemaV27 = v.record(
	v.string(),
	v.object({
		id: v.string(),
		characterById: CharacterByIdSchemaV26,
	}),
);

export { PersistedRosterSchemaV27 };
